import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Verifica la sessione
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    // Crea client Supabase con service role key per bypassare RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Supabase URL o Service Role Key non configurati');
      return NextResponse.json({ isAdmin: false }, { status: 500 });
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

    if (error || !user) {
      console.error('Errore nel recupero ruolo utente:', error);
      return NextResponse.json({ isAdmin: false }, { status: 500 });
    }

    const isAdmin = user.role === 'ADMIN';

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Errore nella verifica admin:', error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}

