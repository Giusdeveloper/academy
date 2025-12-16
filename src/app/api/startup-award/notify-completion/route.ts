/**
 * API Route per inviare notifiche di completamento corso
 * POST /api/startup-award/notify-completion
 * Body: { userEmail, userName?, userId, courseId, courseTitle, completedAt, phase1CompletedAt }
 */

import { NextRequest, NextResponse } from 'next/server';
import { notifyCourseCompletion } from '@/lib/startup-award-notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, userName, userId, courseId, courseTitle, completedAt, phase1CompletedAt } = body;

    if (!userEmail || !userId || !courseId || !courseTitle) {
      return NextResponse.json(
        { error: 'Parametri mancanti' },
        { status: 400 }
      );
    }

    await notifyCourseCompletion({
      userEmail,
      userName,
      userId,
      courseId,
      courseTitle,
      completedAt: completedAt || new Date().toISOString(),
      phase1CompletedAt: phase1CompletedAt || new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'invio notifica:', error);
    return NextResponse.json(
      { error: 'Errore interno', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

