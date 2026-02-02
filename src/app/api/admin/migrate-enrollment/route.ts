/**
 * Endpoint per migrare iscrizioni e progresso tra account
 * POST /api/admin/migrate-enrollment
 * Body: {
 *   fromEmail: string,
 *   toEmail: string,
 *   confirm: boolean
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service role key non configurato' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { fromEmail, toEmail, confirm } = body;

    if (!confirm) {
      return NextResponse.json(
        { error: 'Conferma richiesta. Invia confirm: true nel body' },
        { status: 400 }
      );
    }

    if (!fromEmail || !toEmail) {
      return NextResponse.json(
        { error: 'fromEmail e toEmail sono richiesti' },
        { status: 400 }
      );
    }

    if (fromEmail === toEmail) {
      return NextResponse.json(
        { error: 'fromEmail e toEmail devono essere diversi' },
        { status: 400 }
      );
    }

    console.log(`🔄 Migrazione dati da ${fromEmail} a ${toEmail}`);

    // 1. Trova tutti i record da migrare
    const { data: enrollments, error: enrollmentsError } = await supabaseAdmin
      .from('enrollments')
      .select('*')
      .eq('user_email', fromEmail);

    if (enrollmentsError) {
      return NextResponse.json(
        { error: 'Errore nel recuperare iscrizioni', details: enrollmentsError.message },
        { status: 500 }
      );
    }

    // 2. Trova il progresso associato (tramite user_id se possibile)
    // Prima trova gli user_id associati alle email
    const { data: fromUser } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', fromEmail)
      .single();

    const { data: toUser } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', toEmail)
      .single();

    interface ProgressRecord {
      id: string;
      user_id: string;
      course_id: string;
      lesson_id: string;
      completed: boolean;
      video_watched?: boolean;
      quiz_completed?: boolean;
      completed_at?: string | null;
      video_watched_at?: string | null;
      quiz_completed_at?: string | null;
      last_accessed_at?: string | null;
      time_spent?: number | null;
    }

    let progressRecords: ProgressRecord[] = [];
    if (fromUser?.id) {
      const { data: progress } = await supabaseAdmin
        .from('progress')
        .select('*')
        .eq('user_id', fromUser.id);
      progressRecords = (progress || []) as ProgressRecord[];
    }

    // 3. Migra le iscrizioni
    const migratedEnrollments = [];
    for (const enrollment of enrollments || []) {
      // Verifica se esiste già un'iscrizione per toEmail
      const { data: existing } = await supabaseAdmin
        .from('enrollments')
        .select('id')
        .eq('course_id', enrollment.course_id)
        .eq('user_email', toEmail)
        .single();

      if (existing) {
        console.log(`⚠️ Iscrizione già esistente per ${toEmail} al corso ${enrollment.course_id}`);
        continue;
      }

      // Crea nuova iscrizione
      const { error: insertError } = await supabaseAdmin
        .from('enrollments')
        .insert({
          course_id: enrollment.course_id,
          user_email: toEmail,
          enrolled_at: enrollment.enrolled_at,
          status: enrollment.status,
          payment_id: enrollment.payment_id
        });

      if (insertError) {
        console.error(`❌ Errore nel migrare iscrizione ${enrollment.id}:`, insertError);
      } else {
        migratedEnrollments.push(enrollment.id);
        console.log(`✅ Iscrizione migrata: ${enrollment.id}`);
      }
    }

    // 4. Migra il progresso (solo se abbiamo gli user_id)
    const migratedProgress: string[] = [];
    if (fromUser?.id && toUser?.id) {
      for (const progress of progressRecords) {
        // Verifica se esiste già
        const { data: existing } = await supabaseAdmin
          .from('progress')
          .select('id')
          .eq('user_id', toUser.id)
          .eq('course_id', progress.course_id)
          .eq('lesson_id', progress.lesson_id)
          .single();

        if (existing) {
          console.log(`⚠️ Progresso già esistente per lezione ${progress.lesson_id}`);
          continue;
        }

        // Crea nuovo record di progresso
        const { error: progressError } = await supabaseAdmin
          .from('progress')
          .insert({
            user_id: toUser.id,
            course_id: progress.course_id,
            lesson_id: progress.lesson_id,
            completed: progress.completed,
            video_watched: progress.video_watched,
            quiz_completed: progress.quiz_completed,
            completed_at: progress.completed_at,
            video_watched_at: progress.video_watched_at,
            quiz_completed_at: progress.quiz_completed_at,
            last_accessed_at: progress.last_accessed_at,
            time_spent: progress.time_spent
          });

        if (progressError) {
          console.error(`❌ Errore nel migrare progresso ${progress.id}:`, progressError);
        } else {
          migratedProgress.push(progress.id);
          console.log(`✅ Progresso migrato: ${progress.id}`);
        }
      }
    } else {
      console.warn('⚠️ Impossibile migrare progresso: user_id non trovato per una o entrambe le email');
    }

    // 5. Migra orders
    const migratedOrders: string[] = [];
    if (fromUser?.id && toUser?.id) {
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('user_id', fromUser.id);

      for (const order of orders || []) {
        // Verifica se esiste già
        const { data: existing } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('user_id', toUser.id)
          .eq('course_id', order.course_id)
          .single();

        if (existing) {
          continue;
        }

        const { error: orderError } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: toUser.id,
            course_id: order.course_id,
            amount: order.amount,
            status: order.status,
            created_at: order.created_at
          });

        if (!orderError) {
          migratedOrders.push(order.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Migrazione completata',
      summary: {
        enrollments: {
          found: enrollments?.length || 0,
          migrated: migratedEnrollments.length
        },
        progress: {
          found: progressRecords.length,
          migrated: migratedProgress.length
        },
        orders: {
          migrated: migratedOrders.length
        }
      },
      migratedEnrollments,
      migratedProgress,
      migratedOrders,
      note: 'I record originali non sono stati eliminati. Eliminali manualmente se necessario.'
    });

  } catch (error) {
    console.error('Errore nella migrazione:', error);
    return NextResponse.json(
      { error: 'Errore interno', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
