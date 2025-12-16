/**
 * Endpoint di test per simulare il completamento di tutte le lezioni
 * POST /api/startup-award/test-complete
 * Body: { email: string, userId?: string, courseSlug?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/config/supabase';
import { createClient } from '@supabase/supabase-js';
import { checkAndUpdatePhase1Completion } from '@/lib/startup-award-tracking';

// Client Supabase con service role key per bypassare RLS (solo per endpoint di test)
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

    console.log(`🧪 Test completamento corso per ${email || userId}`);

    // 1. Recupera l'user_id se non fornito
    let finalUserId = userId;
    let finalEmail = email;
    
    if (!finalUserId && email) {
      // Prova prima dalla tabella users pubblica
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (!userError && userData) {
        finalUserId = userData.id;
      } else {
        // Se non trovato nella tabella users, usa la funzione SQL per recuperare da auth.users
        console.log(`🔍 Tentativo di recuperare user_id da auth.users per email: ${email}`);
        const { data: userIdFromRpc, error: rpcError } = await supabase.rpc('get_user_id_by_email', {
          user_email_param: email
        });
        
        console.log(`🔍 Risultato RPC:`, { userIdFromRpc, rpcError });
        
        if (!rpcError && userIdFromRpc) {
          finalUserId = userIdFromRpc;
          console.log(`✅ User ID recuperato: ${finalUserId}`);
        } else {
          // Se la funzione RPC non funziona, prova a recuperare dalla sessione corrente
          const { data: { user: currentUser } } = await supabase.auth.getUser();
          
          if (currentUser && currentUser.email === email) {
            finalUserId = currentUser.id;
            console.log(`✅ User ID recuperato dalla sessione: ${finalUserId}`);
          } else {
            return NextResponse.json(
              { 
                error: 'Utente non trovato',
                hint: 'Verifica che l\'email sia corretta o fornisci userId nel body della richiesta.',
                details: rpcError?.message || 'Nessun utente trovato con questa email',
                troubleshooting: {
                  step1: 'Verifica che la funzione SQL get_user_id_by_email sia stata eseguita nel database',
                  step2: 'Oppure fornisci userId direttamente nel body: { "email": "...", "userId": "..." }',
                  step3: 'Puoi trovare l\'user_id nella tabella auth.users in Supabase'
                }
              },
              { status: 404 }
            );
          }
        }
      }
    }
    
    if (!finalEmail && finalUserId) {
      // Se abbiamo solo userId, recupera l'email dalla tabella users
      const { data: userData } = await supabase
        .from('users')
        .select('email')
        .eq('id', finalUserId)
        .single();
      
      if (userData) {
        finalEmail = userData.email;
      } else {
        // Se non trovato, prova a recuperare da auth.users usando una query diretta
        // Nota: questo potrebbe non funzionare senza service role key
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

    // 1.5. Verifica che l'utente esista nella tabella users pubblica (richiesta dalla foreign key)
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', finalUserId)
      .single();

    if (userCheckError || !existingUser) {
      // L'utente non esiste nella tabella users, crealo
      console.log(`📝 Creando utente nella tabella users: ${finalUserId}`);
      
      const { error: createUserError } = await supabaseAdmin
        .from('users')
        .insert({
          id: finalUserId,
          email: finalEmail || 'unknown@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (createUserError) {
        console.error('Errore nella creazione utente:', createUserError);
        return NextResponse.json(
          { 
            error: 'Errore nella creazione utente nella tabella users',
            details: createUserError.message 
          },
          { status: 500 }
        );
      }
      
      console.log(`✅ Utente creato nella tabella users`);
    }

    // 2. Recupera il corso
    const { data: course, error: courseError } = await supabase
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

    // 3. Recupera tutte le lezioni del corso
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', course.id)
      .order('order', { ascending: true });

    if (lessonsError || !lessons || lessons.length === 0) {
      return NextResponse.json(
        { error: 'Nessuna lezione trovata' },
        { status: 404 }
      );
    }

    console.log(`📚 Trovate ${lessons.length} lezioni`);

    // 4. Completa tutte le lezioni
    const now = new Date().toISOString();
    const progressRecords = lessons.map(lesson => ({
      user_id: finalUserId,
      course_id: course.id,
      lesson_id: lesson.id,
      completed: true,
      completed_at: now,
      video_watched: true,
      video_watched_at: now,
      quiz_completed: false,
      last_accessed_at: now,
      updated_at: now
    }));

    // Usa il client admin per bypassare RLS
    const clientToUse = supabaseAdmin || supabase;
    
    const { error: progressError } = await clientToUse
      .from('progress')
      .upsert(progressRecords, {
        onConflict: 'user_id,course_id,lesson_id'
      });

    if (progressError) {
      console.error('Errore nel completare lezioni:', progressError);
      return NextResponse.json(
        { error: 'Errore nel completare lezioni', details: progressError.message },
        { status: 500 }
      );
    }

    console.log(`✅ ${lessons.length} lezioni completate`);

    // 5. Verifica e aggiorna il completamento Fase 1
    if (!finalEmail) {
      return NextResponse.json(
        { error: 'Email non disponibile. Fornisci email nel body della richiesta.' },
        { status: 400 }
      );
    }
    
    const isCompleted = await checkAndUpdatePhase1Completion(
      finalEmail,
      course.id,
      finalUserId
    );

    return NextResponse.json({
      success: true,
      message: `Completate ${lessons.length} lezioni`,
      courseId: course.id,
      lessonsCompleted: lessons.length,
      phase1Completed: isCompleted,
      userId: finalUserId
    });

  } catch (error) {
    console.error('Errore nel test completamento:', error);
    return NextResponse.json(
      { error: 'Errore interno', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

