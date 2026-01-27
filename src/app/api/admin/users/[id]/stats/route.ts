import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';

// GET: Recupera statistiche di un utente specifico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const { id: userIdParam } = await params;
    const supabaseAdmin = createSupabaseAdmin();

    // Recupera dati utente
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userIdParam)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    // Statistiche corsi completati
    const { count: coursesCompleted } = await supabaseAdmin
      .from('progress')
      .select('course_id', { count: 'exact', head: true })
      .eq('user_id', userIdParam)
      .eq('completed', true);

    // Corsi iscritti
    const { data: enrolledCourses } = await supabaseAdmin
      .from('progress')
      .select('course_id')
      .eq('user_id', userIdParam);

    const uniqueCourses = new Set(enrolledCourses?.map((p) => p.course_id) || []);
    const totalEnrolled = uniqueCourses.size;

    // Startup Award progress
    const { data: startupAward } = await supabaseAdmin
      .from('startup_award_progress')
      .select('*')
      .eq('user_email', user.email)
      .single();

    // Ordini/pagamenti
    const { count: ordersCount } = await supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userIdParam);

    return NextResponse.json({
      user,
      stats: {
        coursesCompleted: coursesCompleted || 0,
        totalEnrolled,
        ordersCount: ordersCount || 0,
        startupAward: startupAward || null,
      },
    });
  } catch (error) {
    console.error('Errore nel recupero statistiche utente:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero statistiche' },
      { status: 500 }
    );
  }
}

