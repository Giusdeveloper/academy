/**
 * Endpoint per eliminare i record del vecchio account
 * POST /api/admin/cleanup-old-account
 * Body: {
 *   email: string,
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
    const { email, confirm } = body;

    if (!confirm) {
      return NextResponse.json(
        { error: 'Conferma richiesta. Invia confirm: true nel body' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email è richiesta' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Eliminazione record per account: ${email}`);

    // 1. Trova l'user_id associato all'email
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (!user) {
      console.log(`⚠️ Utente non trovato nella tabella users per ${email}`);
    }

    const userId = user?.id;

    // 2. Elimina iscrizioni
    const { data: enrollmentsToDelete, error: enrollmentsSelectError } = await supabaseAdmin
      .from('enrollments')
      .select('id, course_id')
      .eq('user_email', email);

    let deletedEnrollments = 0;
    if (enrollmentsToDelete && enrollmentsToDelete.length > 0) {
      const { error: enrollmentsDeleteError } = await supabaseAdmin
        .from('enrollments')
        .delete()
        .eq('user_email', email);

      if (enrollmentsDeleteError) {
        console.error('❌ Errore nell\'eliminare iscrizioni:', enrollmentsDeleteError);
      } else {
        deletedEnrollments = enrollmentsToDelete.length;
        console.log(`✅ Eliminate ${deletedEnrollments} iscrizioni`);
      }
    }

    // 3. Elimina progresso (se abbiamo user_id)
    let deletedProgress = 0;
    if (userId) {
      const { data: progressToDelete, error: progressSelectError } = await supabaseAdmin
        .from('progress')
        .select('id')
        .eq('user_id', userId);

      if (progressToDelete && progressToDelete.length > 0) {
        const { error: progressDeleteError } = await supabaseAdmin
          .from('progress')
          .delete()
          .eq('user_id', userId);

        if (progressDeleteError) {
          console.error('❌ Errore nell\'eliminare progresso:', progressDeleteError);
        } else {
          deletedProgress = progressToDelete.length;
          console.log(`✅ Eliminati ${deletedProgress} record di progresso`);
        }
      }
    } else {
      console.warn('⚠️ Impossibile eliminare progresso: user_id non trovato');
    }

    // 4. Elimina ordini (se abbiamo user_id)
    let deletedOrders = 0;
    if (userId) {
      const { data: ordersToDelete, error: ordersSelectError } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('user_id', userId);

      if (ordersToDelete && ordersToDelete.length > 0) {
        const { error: ordersDeleteError } = await supabaseAdmin
          .from('orders')
          .delete()
          .eq('user_id', userId);

        if (ordersDeleteError) {
          console.error('❌ Errore nell\'eliminare ordini:', ordersDeleteError);
        } else {
          deletedOrders = ordersToDelete.length;
          console.log(`✅ Eliminati ${deletedOrders} ordini`);
        }
      }
    } else {
      console.warn('⚠️ Impossibile eliminare ordini: user_id non trovato');
    }

    // 5. Elimina startup_award_progress (se presente)
    let deletedStartupAward = 0;
    const { data: startupAwardToDelete } = await supabaseAdmin
      .from('startup_award_progress')
      .select('id')
      .eq('user_email', email);

    if (startupAwardToDelete && startupAwardToDelete.length > 0) {
      const { error: startupAwardDeleteError } = await supabaseAdmin
        .from('startup_award_progress')
        .delete()
        .eq('user_email', email);

      if (startupAwardDeleteError) {
        console.error('❌ Errore nell\'eliminare startup_award_progress:', startupAwardDeleteError);
      } else {
        deletedStartupAward = startupAwardToDelete.length;
        console.log(`✅ Eliminati ${deletedStartupAward} record di startup_award_progress`);
      }
    }

    // 6. Elimina payments (se presente)
    let deletedPayments = 0;
    const { data: paymentsToDelete } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('user_email', email);

    if (paymentsToDelete && paymentsToDelete.length > 0) {
      const { error: paymentsDeleteError } = await supabaseAdmin
        .from('payments')
        .delete()
        .eq('user_email', email);

      if (paymentsDeleteError) {
        console.error('❌ Errore nell\'eliminare payments:', paymentsDeleteError);
      } else {
        deletedPayments = paymentsToDelete.length;
        console.log(`✅ Eliminati ${deletedPayments} pagamenti`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Pulizia completata',
      summary: {
        enrollments: deletedEnrollments,
        progress: deletedProgress,
        orders: deletedOrders,
        startupAwardProgress: deletedStartupAward,
        payments: deletedPayments,
        total: deletedEnrollments + deletedProgress + deletedOrders + deletedStartupAward + deletedPayments
      },
      note: userId 
        ? 'Tutti i record sono stati eliminati'
        : 'Alcuni record potrebbero non essere stati eliminati perché user_id non trovato nella tabella users'
    });

  } catch (error) {
    console.error('Errore nella pulizia:', error);
    return NextResponse.json(
      { error: 'Errore interno', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
