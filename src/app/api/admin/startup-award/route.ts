import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';

// GET: Recupera completamenti Startup Award con filtri
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userEmail = searchParams.get('userEmail');
    const status = searchParams.get('status'); // 'completed' o 'enrolled'

    const supabaseAdmin = createSupabaseAdmin();

    // Query base
    let query = supabaseAdmin
      .from('startup_award_progress')
      .select(`
        *,
        courses:course_id (
          id,
          title,
          slug
        )
      `)
      .order('phase1_completed_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    // Filtro per data completamento
    if (startDate) {
      query = query.gte('phase1_completed_at', startDate);
    }
    if (endDate) {
      query = query.lte('phase1_completed_at', endDate);
    }

    // Filtro per email utente
    if (userEmail) {
      query = query.ilike('user_email', `%${userEmail}%`);
    }

    // Filtro per status
    if (status === 'completed') {
      query = query.not('phase1_completed_at', 'is', null);
    } else if (status === 'enrolled') {
      query = query.is('phase1_completed_at', null);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Recupera anche i dati utente per ogni completamento
    const completionsWithUserData = await Promise.all(
      (data || []).map(async (completion) => {
        // Cerca l'utente per email
        const { data: user } = await supabaseAdmin
          .from('users')
          .select('id, name, last_name, email')
          .eq('email', completion.user_email)
          .single();

        return {
          ...completion,
          user: user || null,
        };
      })
    );

    // Statistiche
    const totalCompletions = completionsWithUserData.filter(
      (c) => c.phase1_completed_at !== null
    ).length;
    const totalEnrolled = completionsWithUserData.length;
    const recentCompletions = completionsWithUserData.filter((c) => {
      if (!c.phase1_completed_at) return false;
      const completionDate = new Date(c.phase1_completed_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return completionDate >= sevenDaysAgo;
    }).length;

    return NextResponse.json({
      completions: completionsWithUserData,
      stats: {
        totalCompletions,
        totalEnrolled,
        recentCompletions,
      },
    });
  } catch (error) {
    console.error('Errore nel recupero completamenti:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero completamenti' },
      { status: 500 }
    );
  }
}

