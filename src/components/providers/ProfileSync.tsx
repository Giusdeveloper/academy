'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/config/supabase';

/**
 * Componente "Paracadute"
 * Assicura che ogni utente autenticato in Auth abbia un corrispondente profilo nella tabella public.users.
 * Se il trigger di database fallisce, questo componente recupera e sincronizza i dati al primo accesso.
 */
export default function ProfileSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const syncProfile = async () => {
      // Procediamo solo se l'utente è autenticato in NextAuth e abbiamo un ID
      if (status === 'authenticated' && session?.user?.id) {
        try {
          // 1. Controlla se l'utente esiste già nella tabella pubblica
          const { data: profile, error: fetchError } = await supabase
            .from('users')
            .select('id')
            .eq('id', session.user.id)
            .single();

          // Se c'è un errore (PGRST116: riga non trovata) o il profilo non esiste
          if (fetchError || !profile) {
            console.log('🪂 Paracadute: Profilo mancante in public.users. Avvio sincronizzazione forzata...');

            // 2. Ottieni i dati aggiornati direttamente da Supabase Auth
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

            if (authError || !authUser) {
              console.warn('⚠️ Paracadute: Impossibile recuperare dati da Supabase Auth', authError);
              return;
            }

            // 3. Esegui l'upsert del profilo
            // Utilizziamo i metadati per recuperare Nome e Cognome se presenti
            const { error: upsertError } = await supabase
              .from('users')
              .upsert({
                id: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0],
                last_name: authUser.user_metadata?.last_name || '',
                role: (authUser.user_metadata?.role?.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'USER'),
                email_verified: authUser.email_confirmed_at ? new Date(authUser.email_confirmed_at).toISOString() : null,
                updated_at: new Date().toISOString()
              }, {
                onConflict: 'id'
              });

            if (upsertError) {
              console.error('❌ Paracadute: Errore critico nella sincronizzazione profilo:', upsertError);
              
              // Logghiamo l'errore nel nostro nuovo sistema di monitoraggio!
              await supabase.from('system_errors').insert({
                message: `Paracadute sync failed for user ${authUser.id}`,
                severity: 'critical',
                metadata: { error: upsertError, user_id: authUser.id }
              });
            } else {
              console.log('✅ Paracadute: Profilo sincronizzato con successo. L\'utente ora esiste nel database pubblico.');
            }
          }
        } catch (err) {
          console.error('❌ Paracadute: Errore imprevisto durante il controllo profilo:', err);
        }
      }
    };

    syncProfile();
  }, [session, status]);

  return null;
}
