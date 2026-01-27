import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, createSupabaseAdmin } from '@/lib/admin-utils';
import { logAdminAction } from '@/lib/admin-logs';

// POST: Reset progressi di un utente
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAdmin();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const body = await request.json();
    const { userEmail, courseId } = body;

    if (!userEmail || !courseId) {
      return NextResponse.json(
        { error: 'Email utente e ID corso richiesti' },
        { status: 400 }
      );
    }

    // Usa service role per bypassare RLS
    const clientToUse = createSupabaseAdmin();

    // 1. Recupera l'user_id dall'email
    const { data: user, error: userError } = await clientToUse
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Utente non trovato' },
        { status: 404 }
      );
    }

    const finalUserId = user.id;

    // 2. Reset progressi nelle lezioni
    const { error: progressError } = await clientToUse
      .from('progress')
      .delete()
      .eq('user_id', finalUserId)
      .eq('course_id', courseId);

    if (progressError) {
      console.error('Errore nel reset progressi:', progressError);
      return NextResponse.json(
        { error: 'Errore nel reset progressi lezioni' },
        { status: 500 }
      );
    }

    // 3. Reset startup_award_progress
    const { error: awardError } = await clientToUse
      .from('startup_award_progress')
      .update({
        phase1_completed_at: null,
        current_phase: 1,
        status: 'enrolled',
        updated_at: new Date().toISOString(),
      })
      .eq('user_email', userEmail)
      .eq('course_id', courseId);

    if (awardError) {
      console.error('Errore nel reset startup award:', awardError);
      return NextResponse.json(
        { error: 'Errore nel reset startup award progress' },
        { status: 500 }
      );
    }

    // Log dell'azione
    await logAdminAction({
      actionType: 'RESET_PROGRESS',
      entityType: 'STARTUP_AWARD',
      entityId: courseId,
      description: `Progressi resettati per Startup Award - Utente: ${userEmail}`,
      details: { userEmail, courseId },
      request,
    });

    return NextResponse.json({
      success: true,
      message: `Progressi resettati per ${userEmail}`,
    });
  } catch (error) {
    console.error('Errore nel reset progressi:', error);
    return NextResponse.json(
      { error: 'Errore interno nel reset progressi' },
      { status: 500 }
    );
  }
}

