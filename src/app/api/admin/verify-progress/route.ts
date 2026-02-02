/**
 * Endpoint per verificare e pulire i record di progresso errati
 * GET /api/admin/verify-progress?userId=xxx&courseId=xxx
 * POST /api/admin/verify-progress (con body per pulire)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Client Supabase con service role key per bypassare RLS
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key non configurato' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const courseId = searchParams.get('courseId');
    const userEmail = searchParams.get('userEmail');

    // Prima verifica: conta TUTTI i record di progresso (non solo completed)
    const { count: totalProgressCount } = await supabaseAdmin
      .from('progress')
      .select('*', { count: 'exact', head: true });

    // Seconda verifica: conta solo i completed
    const { count: completedCount } = await supabaseAdmin
      .from('progress')
      .select('*', { count: 'exact', head: true })
      .eq('completed', true);

    let query = supabaseAdmin
      .from('progress')
      .select(`
        *,
        lesson:lesson_id (
          id,
          title,
          "order"
        ),
        course:course_id (
          id,
          title,
          slug
        ),
        user:user_id (
          id,
          email
        )
      `)
      .eq('completed', true)
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (courseId) {
      query = query.eq('course_id', courseId);
    }
    if (userEmail) {
      // Prima trova l'user_id dall'email
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();
      
      if (user) {
        query = query.eq('user_id', user.id);
      } else {
        return NextResponse.json(
          { error: 'Utente non trovato', email: userEmail },
          { status: 404 }
        );
      }
    }

    const { data: progressRecords, error } = await query.limit(100);

    if (error) {
      return NextResponse.json(
        { error: 'Errore nel recuperare progresso', details: error.message },
        { status: 500 }
      );
    }

    // Verifica anche i record NON completati per capire meglio
    const { data: allProgressRecords } = await supabaseAdmin
      .from('progress')
      .select('user_id, course_id, completed')
      .limit(100);

    // Analizza i record per trovare potenziali problemi
    const analysis = {
      totalRecords: progressRecords?.length || 0,
      totalProgressRecords: totalProgressCount || 0,
      completedRecords: completedCount || 0,
      allProgressSample: allProgressRecords?.slice(0, 10) || [],
      byCourse: {} as Record<string, {
        courseTitle: string;
        totalLessons: number;
        completedLessons: number;
        users: Set<string>;
        suspiciousRecords: Array<{
          id: string;
          userId: string;
          userEmail: string;
          lessonTitle: string;
          completedAt: string;
          createdAt: string;
        }>;
      }>,
      suspiciousPatterns: [] as Array<{
        type: string;
        description: string;
        records: Array<{
          id: string;
          userId: string;
          userEmail: string;
          lessonTitle: string;
          completedAt: string;
          createdAt: string;
        }>;
      }>
    };

    interface CourseData {
      id: string;
      title?: string;
      slug?: string;
    }

    interface LessonData {
      id: string;
      title?: string;
      order?: number;
    }

    interface UserData {
      id?: string;
      email?: string;
    }

    // Raggruppa per corso
    if (progressRecords) {
      for (const record of progressRecords) {
        const course = record.course as CourseData | CourseData[] | null;
        const lesson = record.lesson as LessonData | LessonData[] | null;
        const user = record.user as UserData | UserData[] | null;

        const courseObj = Array.isArray(course) ? course[0] : course;
        const lessonObj = Array.isArray(lesson) ? lesson[0] : lesson;
        const userObj = Array.isArray(user) ? user[0] : user;

        if (!courseObj || !lessonObj) continue;

        const currentCourseId = courseObj.id;
        if (!analysis.byCourse[currentCourseId]) {
          // Conta le lezioni totali del corso
          const { count: totalLessons } = await supabaseAdmin
            .from('lessons')
            .select('id', { count: 'exact', head: true })
            .eq('course_id', currentCourseId);

          analysis.byCourse[currentCourseId] = {
            courseTitle: courseObj.title || 'Sconosciuto',
            totalLessons: totalLessons || 0,
            completedLessons: 0,
            users: new Set(),
            suspiciousRecords: []
          };
        }

        analysis.byCourse[currentCourseId].completedLessons++;
        if (userObj?.id) {
          analysis.byCourse[currentCourseId].users.add(userObj.id);
        }

        // Verifica pattern sospetti
        // 1. Record creati tutti nello stesso momento (possibile chiamata endpoint test)
        const createdAt = new Date(record.created_at);
        const completedAt = record.completed_at ? new Date(record.completed_at) : null;
        
        if (completedAt && Math.abs(completedAt.getTime() - createdAt.getTime()) < 1000) {
          // Creato e completato nello stesso secondo = sospetto
          analysis.byCourse[currentCourseId].suspiciousRecords.push({
            id: record.id,
            userId: record.user_id,
            userEmail: userObj?.email || 'N/A',
            lessonTitle: lessonObj.title || 'N/A',
            completedAt: record.completed_at || '',
            createdAt: record.created_at
          });
        }
      }
    }

    // Verifica se ci sono utenti con tutte le lezioni completate immediatamente
    for (const [courseId, courseData] of Object.entries(analysis.byCourse)) {
      if (courseData.completedLessons === courseData.totalLessons) {
        // Tutte le lezioni completate - potrebbe essere un problema
        analysis.suspiciousPatterns.push({
          type: 'all_lessons_completed',
          description: `Tutte le ${courseData.totalLessons} lezioni completate per ${courseData.users.size} utente/i`,
          records: courseData.suspiciousRecords
        });
      }
    }

    // Diagnostica aggiuntiva
    const diagnostics = {
      hasCompletedRecords: (completedCount || 0) > 0,
      hasAnyProgressRecords: (totalProgressCount || 0) > 0,
      possibleIssues: [] as string[]
    };

    if (totalProgressCount === 0) {
      diagnostics.possibleIssues.push('⚠️ Nessun record nella tabella progress - potrebbe essere un problema di RLS o dati');
    } else if (completedCount === 0) {
      diagnostics.possibleIssues.push('⚠️ Ci sono record di progresso ma nessuno è completato - il problema potrebbe essere nella visualizzazione');
      diagnostics.possibleIssues.push('💡 Verifica se il problema è nel calcolo del progresso nella dashboard');
    }

    return NextResponse.json({
      success: true,
      analysis,
      diagnostics,
      records: progressRecords?.slice(0, 20) || [], // Mostra solo i primi 20 per non sovraccaricare
      recommendations: [
        ...diagnostics.possibleIssues,
        ...(analysis.suspiciousPatterns.length > 0 ? [
          '⚠️ Trovati pattern sospetti: alcune lezioni potrebbero essere state completate automaticamente',
          '💡 Controlla se l\'endpoint /api/startup-award/test-complete è stato chiamato',
          '💡 Verifica i record con createdAt e completedAt molto vicini nel tempo'
        ] : []),
        '📊 Usa POST per pulire i record sospetti (richiede conferma)',
        '🔍 Se vedi "tutti i corsi completati" ma qui non ci sono record completati, il problema è nella logica di visualizzazione'
      ]
    });

  } catch (error) {
    console.error('Errore nella verifica progresso:', error);
    return NextResponse.json(
      { error: 'Errore interno', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key non configurato' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { action, userId, courseId, recordIds, confirm } = body;

    if (!confirm) {
      return NextResponse.json(
        { error: 'Conferma richiesta. Invia confirm: true nel body' },
        { status: 400 }
      );
    }

    if (action === 'delete_suspicious') {
      // Elimina record sospetti (creati e completati nello stesso momento)
      const { data: suspiciousRecords, error: findError } = await supabaseAdmin
        .from('progress')
        .select('id, created_at, completed_at')
        .eq('completed', true)
        .not('completed_at', 'is', null);

      if (findError) {
        return NextResponse.json(
          { error: 'Errore nel trovare record sospetti', details: findError.message },
          { status: 500 }
        );
      }

      const toDelete = suspiciousRecords?.filter(record => {
        const createdAt = new Date(record.created_at);
        const completedAt = new Date(record.completed_at);
        // Se creato e completato nello stesso secondo, è sospetto
        return Math.abs(completedAt.getTime() - createdAt.getTime()) < 2000; // 2 secondi di tolleranza
      }) || [];

      if (toDelete.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'Nessun record sospetto trovato',
          deleted: 0
        });
      }

      const idsToDelete = toDelete.map(r => r.id);
      
      // Filtra per userId e courseId se specificati
      let finalIdsToDelete = idsToDelete;
      if (userId || courseId) {
        if (userId) {
          // Filtra per userId
          const { data: userRecords } = await supabaseAdmin
            .from('progress')
            .select('id')
            .in('id', idsToDelete)
            .eq('user_id', userId);
          finalIdsToDelete = userRecords?.map(r => r.id) || [];
        }
        if (courseId) {
          const { data: courseRecords } = await supabaseAdmin
            .from('progress')
            .select('id')
            .in('id', finalIdsToDelete)
            .eq('course_id', courseId);
          finalIdsToDelete = courseRecords?.map(r => r.id) || [];
        }
      }

      if (finalIdsToDelete.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'Nessun record da eliminare con i filtri specificati',
          deleted: 0
        });
      }

      const { error: deleteError } = await supabaseAdmin
        .from('progress')
        .delete()
        .in('id', finalIdsToDelete);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Errore nell\'eliminare record', details: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Eliminati ${finalIdsToDelete.length} record sospetti`,
        deleted: finalIdsToDelete.length,
        deletedIds: finalIdsToDelete
      });

    } else if (action === 'delete_by_ids' && recordIds && Array.isArray(recordIds)) {
      // Elimina record specifici
      const { error: deleteError } = await supabaseAdmin
        .from('progress')
        .delete()
        .in('id', recordIds);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Errore nell\'eliminare record', details: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Eliminati ${recordIds.length} record`,
        deleted: recordIds.length
      });

    } else if (action === 'reset_user_course' && userId && courseId) {
      // Reset completo del progresso per un utente e corso specifico
      const { error: deleteError } = await supabaseAdmin
        .from('progress')
        .delete()
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (deleteError) {
        return NextResponse.json(
          { error: 'Errore nel resettare progresso', details: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Progresso resettato per utente e corso',
        userId,
        courseId
      });

    } else {
      return NextResponse.json(
        { error: 'Azione non valida. Usa: delete_suspicious, delete_by_ids, o reset_user_course' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Errore nella pulizia progresso:', error);
    return NextResponse.json(
      { error: 'Errore interno', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
