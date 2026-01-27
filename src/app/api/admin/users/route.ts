import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';
import { logAdminAction } from '@/lib/admin-logs';

// GET: Recupera lista utenti con filtri
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const supabaseAdmin = createSupabaseAdmin();

    // Query base
    let query = supabaseAdmin
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filtro per ricerca (nome, email)
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    // Filtro per ruolo
    if (role) {
      query = query.eq('role', role);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json({
      users: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Errore nel recupero utenti:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero utenti' },
      { status: 500 }
    );
  }
}

// PUT: Aggiorna ruolo utente
export async function PUT(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { userId: targetUserId, role } = body;

    if (!targetUserId || !role) {
      return NextResponse.json(
        { error: 'ID utente e ruolo richiesti' },
        { status: 400 }
      );
    }

    // Verifica che il ruolo sia valido
    if (!['USER', 'ADMIN', 'MODERATOR'].includes(role)) {
      return NextResponse.json(
        { error: 'Ruolo non valido' },
        { status: 400 }
      );
    }

    // Non permettere di cambiare il proprio ruolo
    if (targetUserId === userId) {
      return NextResponse.json(
        { error: 'Non puoi modificare il tuo stesso ruolo' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createSupabaseAdmin();
    const { data, error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        role: role as 'USER' | 'ADMIN' | 'MODERATOR',
        updated_at: new Date().toISOString(),
      })
      .eq('id', targetUserId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Log dell'azione
    const userName = data.name
      ? `${data.name}${data.last_name ? ` ${data.last_name}` : ''}`
      : data.email;
    await logAdminAction({
      actionType: 'CHANGE_ROLE',
      entityType: 'USER',
      entityId: targetUserId,
      description: `Ruolo cambiato per ${userName}: ${role}`,
      details: { oldRole: data.role, newRole: role },
      request,
    });

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    console.error('Errore nell\'aggiornamento ruolo:', error);
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento ruolo' },
      { status: 500 }
    );
  }
}

