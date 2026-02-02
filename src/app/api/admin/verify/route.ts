import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Verifica la sessione
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      console.log('⚠️ /api/admin/verify: Nessuna sessione o user.id mancante');
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    // Crea client Supabase con service role key per bypassare RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ /api/admin/verify: Supabase URL o Service Role Key non configurati');
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Configurazione Supabase mancante' 
      }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Recupera il ruolo dell'utente dal database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error) {
      // Se l'errore è "not found" (PGRST116), l'utente non esiste nella tabella users
      if (error.code === 'PGRST116' || error.message?.includes('No rows')) {
        console.log(`⚠️ /api/admin/verify: Utente ${session.user.id} non trovato nella tabella users`);
        return NextResponse.json({ isAdmin: false }, { status: 200 }); // 200 invece di 500, non è un errore critico
      }
      console.error('❌ /api/admin/verify: Errore nel recupero ruolo utente:', error);
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Errore nel recupero ruolo utente' 
      }, { status: 500 });
    }

    if (!user) {
      console.log(`⚠️ /api/admin/verify: Utente ${session.user.id} non trovato`);
      return NextResponse.json({ isAdmin: false }, { status: 200 }); // 200 invece di 500
    }

    const isAdmin = user.role === 'ADMIN';
    console.log(`✅ /api/admin/verify: Utente ${session.user.id} - Admin: ${isAdmin}`);

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('❌ /api/admin/verify: Errore generico:', error);
    return NextResponse.json({ 
      isAdmin: false, 
      error: error instanceof Error ? error.message : 'Errore sconosciuto' 
    }, { status: 500 });
  }
}

