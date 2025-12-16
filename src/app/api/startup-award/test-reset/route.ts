/**
 * Endpoint di test per resettare i progressi di un utente
 * POST /api/startup-award/test-reset
 * Body: { email: string, userId?: string, courseSlug?: string }
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

export async function POST(request: NextRequest) {
  try {
    // Verifica che il service role key sia configurato
    if (!supabaseAdmin) {
      return NextResponse.json(
        { 
          error: 'Service role key non configurato',
          hint: 'Aggiungi SUPABASE_SERVICE_ROLE_KEY nel file .env.local'
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, userId, courseSlug = 'finanziamento-aziendale' } = body;

    if (!email && !userId) {
      return NextResponse.json(
        { error: 'Email o userId richiesti' },
        { status: 400 }
      );
    }

    console.log(`🔄 Reset progressi per ${email || userId}`);

    // 1. Recupera l'user_id se non fornito
    let finalUserId = userId;
    let finalEmail = email;
    
    if (!finalUserId && email) {
      // Prova prima dalla tabella users pubblica
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (!userError && userData) {
        finalUserId = userData.id;
      } else {
        // Se non trovato nella tabella users, usa la funzione SQL per recuperare da auth.users
        console.log(`🔍 Tentativo di recuperare user_id da auth.users per email: ${email}`);
        const { data: userIdFromRpc, error: rpcError } = await supabaseAdmin.rpc('get_user_id_by_email', {
          user_email_param: email
        });
        
        if (!rpcError && userIdFromRpc) {
          finalUserId = userIdFromRpc;
          console.log(`✅ User ID recuperato: ${finalUserId}`);
        } else {
          return NextResponse.json(
            { 
              error: 'Utente non trovato',
              hint: 'Verifica che l\'email sia corretta o fornisci userId nel body della richiesta.',
              details: rpcError?.message || 'Nessun utente trovato con questa email'
            },
            { status: 404 }
          );
        }
      }
    }
    
    if (!finalEmail && finalUserId) {
      // Se abbiamo solo userId, recupera l'email dalla tabella users
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('id', finalUserId)
        .single();
      
      if (userData) {
        finalEmail = userData.email;
      } else {
        return NextResponse.json(
          { error: 'Email non disponibile. Fornisci email nel body della richiesta.' },
          { status: 400 }
        );
      }
    }

    if (!finalUserId) {
      return NextResponse.json(
        { error: 'User ID non disponibile' },
        { status: 400 }
      );
    }

    // 2. Recupera il corso
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('slug', courseSlug)
      .single();

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Corso non trovato' },
        { status: 404 }
      );
    }

    // 3. Elimina tutti i progressi delle lezioni per questo utente e corso
    const { error: deleteProgressError } = await supabaseAdmin
      .from('progress')
      .delete()
      .eq('user_id', finalUserId)
      .eq('course_id', course.id);

    if (deleteProgressError) {
      console.error('Errore nell\'eliminare progressi:', deleteProgressError);
      return NextResponse.json(
        { error: 'Errore nell\'eliminare progressi', details: deleteProgressError.message },
        { status: 500 }
      );
    }

    console.log(`✅ Progressi lezioni eliminati`);

    // 4. Reset dello stato Startup Award (mantieni phase1_enrolled_at, resetta phase1_completed_at)
    const { error: updateError } = await supabaseAdmin
      .from('startup_award_progress')
      .update({
        phase1_completed_at: null,
        current_phase: 1,
        status: 'enrolled',
        updated_at: new Date().toISOString()
      })
      .eq('user_email', finalEmail)
      .eq('course_id', course.id);

    if (updateError) {
      // Se non esiste il record, non è un errore critico
      if (updateError.code !== 'PGRST116') {
        console.error('Errore nell\'aggiornare startup_award_progress:', updateError);
        return NextResponse.json(
          { error: 'Errore nell\'aggiornare stato Startup Award', details: updateError.message },
          { status: 500 }
        );
      }
    } else {
      console.log(`✅ Stato Startup Award resettato`);
    }

    return NextResponse.json({
      success: true,
      message: 'Progressi resettati con successo',
      userId: finalUserId,
      email: finalEmail,
      courseId: course.id,
      reset: {
        progress: 'eliminati',
        startupAwardStatus: 'resettato a fase 1'
      }
    });

  } catch (error) {
    console.error('Errore nel reset progressi:', error);
    return NextResponse.json(
      { error: 'Errore interno', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

