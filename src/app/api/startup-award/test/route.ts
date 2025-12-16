import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/config/supabase';
import { trackPhase1Enrollment, getStartupAwardStatus, checkAndUpdatePhase1Completion } from '@/lib/startup-award-tracking';

/**
 * Route di test per verificare il sistema di tracking Startup Award
 * GET /api/startup-award/test?action=status&user_email=...&course_id=...
 * 
 * Actions disponibili:
 * - status: verifica lo stato del percorso
 * - enroll: traccia un'iscrizione di test
 * - check_completion: verifica il completamento
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'status';
    const userEmail = searchParams.get('user_email');
    const courseId = searchParams.get('course_id');

    if (!userEmail || !courseId) {
      return NextResponse.json(
        { 
          error: 'user_email e course_id sono richiesti',
          usage: {
            status: '/api/startup-award/test?action=status&user_email=...&course_id=...',
            enroll: '/api/startup-award/test?action=enroll&user_email=...&course_id=...',
            check_completion: '/api/startup-award/test?action=check_completion&user_email=...&course_id=...'
          }
        },
        { status: 400 }
      );
    }

    switch (action) {
      case 'status': {
        const status = await getStartupAwardStatus(userEmail, courseId);
        return NextResponse.json({
          success: true,
          action: 'status',
          data: status || { message: 'Nessun record trovato' }
        });
      }

      case 'enroll': {
        await trackPhase1Enrollment(userEmail, courseId);
        const status = await getStartupAwardStatus(userEmail, courseId);
        return NextResponse.json({
          success: true,
          action: 'enroll',
          message: 'Iscrizione tracciata con successo',
          data: status
        });
      }

      case 'check_completion': {
        // Ottieni userId dall'email
        const { data: { user } } = await supabase.auth.admin.getUserByEmail(userEmail);
        if (!user) {
          return NextResponse.json({
            success: false,
            error: 'Utente non trovato'
          }, { status: 404 });
        }

        const isCompleted = await checkAndUpdatePhase1Completion(userEmail, courseId, user.id);
        const status = await getStartupAwardStatus(userEmail, courseId);
        
        return NextResponse.json({
          success: true,
          action: 'check_completion',
          is_completed: isCompleted,
          data: status
        });
      }

      default:
        return NextResponse.json(
          { error: `Azione sconosciuta: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Errore nel test:', error);
    return NextResponse.json(
      { 
        error: 'Errore interno del server',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      },
      { status: 500 }
    );
  }
}

