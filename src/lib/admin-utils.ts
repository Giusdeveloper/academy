import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

/**
 * Crea un client Supabase admin con service role key per bypassare RLS
 */
export function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL o Service Role Key non configurati');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Verifica che l'utente corrente sia admin
 * @returns L'ID dell'utente se è admin, null altrimenti
 */
export async function verifyAdmin(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return null;
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    return user?.role === 'ADMIN' ? session.user.id : null;
  } catch (error) {
    console.error('Errore nella verifica admin:', error);
    return null;
  }
}

