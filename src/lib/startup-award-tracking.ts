/**
 * Utility functions per tracciare il percorso Startup Award
 */

import { supabase } from '@/config/supabase';

export interface StartupAwardStatus {
  phase1_enrolled_at: string | null;
  phase1_completed_at: string | null;
  phase2_enrolled_at: string | null;
  phase2_completed_at: string | null;
  phase3_enrolled_at: string | null;
  phase3_completed_at: string | null;
  current_phase: number;
  status: string;
  is_phase1_completed: boolean;
}

/**
 * Traccia l'iscrizione al corso (Fase 1)
 */
export async function trackPhase1Enrollment(
  userEmail: string,
  courseId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('startup_award_progress')
      .upsert({
        user_email: userEmail,
        course_id: courseId,
        phase1_enrolled_at: new Date().toISOString(),
        current_phase: 1,
        status: 'enrolled',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_email,course_id'
      });

    if (error) {
      console.error('Errore nel tracciare iscrizione Fase 1:', error);
      throw error;
    }

    console.log(`✅ Iscrizione Fase 1 tracciata per ${userEmail} al corso ${courseId}`);
  } catch (error) {
    console.error('Errore nel tracciare iscrizione:', error);
    throw error;
  }
}

/**
 * Verifica se il corso è completato e aggiorna lo stato
 */
export async function checkAndUpdatePhase1Completion(
  userEmail: string,
  courseId: string,
  userId?: string
): Promise<boolean> {
  try {
    // Se non abbiamo userId, lo recuperiamo dalla sessione
    let finalUserId = userId;
    if (!finalUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      finalUserId = session?.user?.id;
    }

    if (!finalUserId) {
      console.error('User ID non disponibile per verificare completamento');
      return false;
    }

    // Chiama la funzione Supabase per verificare il completamento
    const { data, error } = await supabase.rpc('is_course_completed', {
      course_uuid: courseId,
      user_id_param: finalUserId
    });

    if (error) {
      console.error('Errore nel verificare completamento corso:', error);
      return false;
    }

    const isCompleted = data === true;

    if (isCompleted) {
      // Aggiorna lo stato nel database SOLO se phase1_completed_at è NULL (operazione atomica)
      // Questo previene race conditions quando la funzione viene chiamata più volte in parallelo
      const now = new Date().toISOString();
      const { data: updateData, error: updateError } = await supabase
        .from('startup_award_progress')
        .update({
          phase1_completed_at: now,
          current_phase: 2,
          status: 'phase1_completed',
          updated_at: now
        })
        .eq('user_email', userEmail)
        .eq('course_id', courseId)
        .is('phase1_completed_at', null) // Aggiorna SOLO se phase1_completed_at è NULL
        .select('phase1_completed_at'); // Ritorna i dati aggiornati per verificare se l'update è andato a buon fine

      if (updateError) {
        console.error('Errore nell\'aggiornare completamento Fase 1:', updateError);
        return false;
      }

      // Se updateData è vuoto o null, significa che il record è già stato completato
      // (un'altra chiamata ha già aggiornato il record)
      if (!updateData || updateData.length === 0) {
        console.log(`ℹ️ Completamento già registrato per ${userEmail} al corso ${courseId}. Notifiche già inviate.`);
        return true;
      }

      console.log(`✅ Fase 1 completata per ${userEmail} al corso ${courseId} (aggiornamento atomico)`);

      // Invia notifica di completamento (chiama API route lato server)
      try {
        // Recupera il titolo del corso
        const { data: courseData } = await supabase
          .from('courses')
          .select('title')
          .eq('id', courseId)
          .single();

        // Recupera il nome utente se disponibile (prova prima nella tabella users, poi usa l'email)
        let userName: string | undefined;
        
        // Usa il client admin se siamo lato server per bypassare RLS
        let supabaseClient = supabase;
        if (typeof window === 'undefined' && process.env.SUPABASE_SERVICE_ROLE_KEY) {
          const { createClient } = await import('@supabase/supabase-js');
          supabaseClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false
              }
            }
          );
        }
        
        const { data: userData, error: userDataError } = await supabaseClient
          .from('users')
          .select('name, last_name, email')
          .eq('id', finalUserId)
          .single();

        if (userDataError) {
          console.log('⚠️ Errore nel recuperare dati utente:', userDataError);
        }

        if (userData?.name) {
          // Combina nome e cognome se disponibili
          if (userData.last_name) {
            userName = `${userData.name} ${userData.last_name}`;
            console.log(`✅ Nome completo recuperato: ${userName}`);
          } else {
            userName = userData.name;
            console.log(`✅ Solo nome recuperato: ${userName}`);
          }
        } else if (userData?.email) {
          // Usa la parte prima della @ come nome se non c'è un nome
          userName = userData.email.split('@')[0];
          // Capitalizza la prima lettera
          if (userName) {
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
          }
          console.log(`⚠️ Nome non trovato, uso email: ${userName}`);
        } else {
          // Usa l'email passata come parametro
          userName = userEmail.split('@')[0];
          // Capitalizza la prima lettera
          if (userName) {
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);
          }
          console.log(`⚠️ Dati utente non trovati, uso email parametro: ${userName}`);
        }
        
        console.log(`📧 Nome utente che verrà usato nelle email: ${userName}`);

        // Chiama l'API route per inviare le notifiche (solo lato server)
        if (typeof window === 'undefined') {
          // Siamo lato server, possiamo chiamare direttamente
          const { notifyCourseCompletion } = await import('./startup-award-notifications');
          await notifyCourseCompletion({
            userEmail,
            userName: userName,
            userId: finalUserId,
            courseId,
            courseTitle: courseData?.title || 'Finanziamento Aziendale',
            completedAt: new Date().toISOString(),
            phase1CompletedAt: new Date().toISOString()
          });
        } else {
          // Siamo lato client, chiama l'API route
          fetch('/api/startup-award/notify-completion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userEmail,
              userName: userName,
              userId: finalUserId,
              courseId,
              courseTitle: courseData?.title || 'Finanziamento Aziendale',
              completedAt: new Date().toISOString(),
              phase1CompletedAt: new Date().toISOString()
            })
          }).catch(err => {
            console.error('Errore nel chiamare API notifica:', err);
          });
        }
      } catch (notificationError) {
        // Non blocchiamo il processo se la notifica fallisce
        console.error('Errore nell\'invio notifica completamento:', notificationError);
      }
    }

    return isCompleted;
  } catch (error) {
    console.error('Errore nel verificare completamento:', error);
    return false;
  }
}

/**
 * Ottieni lo stato del percorso Startup Award
 */
export async function getStartupAwardStatus(
  userEmail: string,
  courseId: string
): Promise<StartupAwardStatus | null> {
  try {
    const { data, error } = await supabase.rpc('get_startup_award_status', {
      user_email_param: userEmail,
      course_uuid: courseId
    });

    if (error) {
      console.error('Errore nel recuperare stato Startup Award:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0] as StartupAwardStatus;
  } catch (error) {
    console.error('Errore nel recuperare stato:', error);
    return null;
  }
}

/**
 * Verifica se l'utente può accedere alla Fase 2
 */
export async function canAccessPhase2(
  userEmail: string,
  courseId: string
): Promise<boolean> {
  const status = await getStartupAwardStatus(userEmail, courseId);
  return status?.is_phase1_completed === true;
}

