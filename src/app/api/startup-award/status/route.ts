import { NextRequest, NextResponse } from 'next/server';
import { getStartupAwardStatus } from '@/lib/startup-award-tracking';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userEmail = searchParams.get('user_email');
    const courseId = searchParams.get('course_id');

    if (!userEmail || !courseId) {
      return NextResponse.json(
        { error: 'user_email e course_id sono richiesti' },
        { status: 400 }
      );
    }

    const status = await getStartupAwardStatus(userEmail, courseId);

    if (!status) {
      return NextResponse.json({
        enrolled: false,
        phase1_completed: false,
        current_phase: 0,
        status: 'not_enrolled'
      });
    }

    return NextResponse.json({
      enrolled: true,
      phase1_enrolled_at: status.phase1_enrolled_at,
      phase1_completed_at: status.phase1_completed_at,
      phase2_enrolled_at: status.phase2_enrolled_at,
      phase2_completed_at: status.phase2_completed_at,
      phase3_enrolled_at: status.phase3_enrolled_at,
      phase3_completed_at: status.phase3_completed_at,
      current_phase: status.current_phase,
      status: status.status,
      is_phase1_completed: status.is_phase1_completed
    });
  } catch (error) {
    console.error('Errore nel recuperare stato Startup Award:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

