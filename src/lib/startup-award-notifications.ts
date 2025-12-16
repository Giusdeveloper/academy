/**
 * Sistema di notifiche per il completamento del corso Startup Award
 * 
 * NOTA: Questo modulo deve essere usato solo lato server (API routes, Server Components)
 * Non importare in componenti client-side!
 */

// Funzione helper per ottenere Resend client (lazy dynamic import)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getResendClient(): Promise<any> {
  // Verifica che siamo lato server
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Resend può essere usato solo lato server');
    return null;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  
  try {
    // Dynamic import per evitare problemi con client-side bundling
    const { Resend } = await import('resend');
    return new Resend(apiKey);
  } catch (error) {
    console.error('Errore nell\'inizializzare Resend:', error);
    return null;
  }
}

interface CompletionNotificationData {
  userEmail: string;
  userName?: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  completedAt: string;
  phase1CompletedAt: string;
}

/**
 * Invia notifica quando un utente completa il corso
 */
export async function notifyCourseCompletion(data: CompletionNotificationData): Promise<void> {
  try {
    const notifications: Promise<void>[] = [];

    // 1. Log nella console (sempre attivo)
    console.log('🔔 NOTIFICA COMPLETAMENTO CORSO:', {
      user: data.userEmail,
      course: data.courseTitle,
      completedAt: data.completedAt
    });

    // 2. Email notification all'admin (se configurata)
    if (process.env.ADMIN_EMAIL) {
      console.log('📧 Configurazione email admin trovata, invio notifica email...');
      notifications.push(sendEmailNotification(data).catch(err => {
        console.error('❌ Errore nella notifica email admin:', err);
      }));
    } else {
      console.log('ℹ️ ADMIN_EMAIL non configurato, salto notifica email admin');
    }

    // 3. Email notification all'utente (sempre inviata se Resend è configurato)
    console.log('📧 Invio email di congratulazioni all\'utente...');
    notifications.push(sendUserCompletionEmail(data).catch(err => {
      console.error('❌ Errore nella notifica email utente:', err);
    }));

    // 4. Webhook notification (se configurato)
    if (process.env.WEBHOOK_URL) {
      console.log('🔗 Configurazione webhook trovata, invio notifica webhook...');
      notifications.push(sendWebhookNotification(data).catch(err => {
        console.error('❌ Errore nella notifica webhook:', err);
      }));
    } else {
      console.log('ℹ️ WEBHOOK_URL non configurato, salto notifica webhook');
    }

    // Esegui tutte le notifiche in parallelo
    const results = await Promise.allSettled(notifications);
    
    // Log dei risultati
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`❌ Notifica ${index + 1} fallita:`, result.reason);
      } else {
        console.log(`✅ Notifica ${index + 1} completata`);
      }
    });
  } catch (error) {
    console.error('❌ Errore critico nel sistema di notifiche:', error);
    // Non blocchiamo il processo anche se le notifiche falliscono
  }
}

/**
 * Invia email di notifica all'admin
 */
async function sendEmailNotification(data: CompletionNotificationData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  // Verifica che siamo lato server
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Le notifiche email possono essere inviate solo lato server');
    return;
  }

  // Inizializza Resend (lazy dynamic import)
  const resend = await getResendClient();
  
  // Se Resend non è configurato, logga solo
  if (!resend) {
    console.log('📧 Email notification (Resend non configurato):', {
      to: adminEmail,
      subject: `✅ Corso completato: ${data.courseTitle}`,
      body: `
        Un utente ha completato il corso Startup Award!
        
        Utente: ${data.userEmail}${data.userName ? ` (${data.userName})` : ''}
        Corso: ${data.courseTitle}
        Completato il: ${new Date(data.completedAt).toLocaleString('it-IT')}
        
        User ID: ${data.userId}
        Course ID: ${data.courseId}
      `
    });
    console.log('💡 Per inviare email reali, configura RESEND_API_KEY e RESEND_FROM_EMAIL nel .env.local');
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@onboarding.resend.dev';
  
  try {
    const completedDate = new Date(data.completedAt).toLocaleString('it-IT', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Pulisci il titolo del corso per il subject (rimuovi caratteri di nuova riga e spazi multipli)
    const cleanCourseTitle = data.courseTitle
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Pulisci anche per il corpo dell'email (mantieni spazi singoli ma rimuovi newline)
    const cleanCourseTitleForBody = data.courseTitle
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .trim();

    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: `✅ Corso completato: ${cleanCourseTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Corso Completato - Startup Award</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #9e005c 0%, #c2185b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Corso Completato!</h1>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Un utente ha completato con successo la Fase 1 del percorso <strong>Startup Award</strong>!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #9e005c;">
              <h2 style="margin-top: 0; color: #9e005c; font-size: 20px;">Dettagli Completamento</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 140px;">Utente:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 500;">
                    ${data.userName || data.userEmail}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Email:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Corso:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 500;">${cleanCourseTitleForBody}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Completato il:</td>
                  <td style="padding: 8px 0; color: #111827;">${completedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Fase:</td>
                  <td style="padding: 8px 0; color: #111827;">
                    <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                      Fase 1 Completata ✅
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>Prossimo passo:</strong> L'utente è ora pronto per la Fase 2 del percorso Startup Award.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
              <p style="margin: 0;">
                Questa è una notifica automatica dal sistema Academy.<br>
                User ID: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${data.userId}</code><br>
                Course ID: <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${data.courseId}</code>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Corso Completato - Startup Award

Un utente ha completato con successo il corso Startup Award!

Dettagli:
- Utente: ${data.userName || data.userEmail}
- Email: ${data.userEmail}
- Corso: ${cleanCourseTitleForBody}
- Completato il: ${completedDate}
- Fase: Fase 1 Completata ✅

Prossimo passo: L'utente è ora pronto per la Fase 2 del percorso Startup Award.

---
Questa è una notifica automatica dal sistema Academy.
User ID: ${data.userId}
Course ID: ${data.courseId}
      `.trim()
    });

    if (error) {
      throw error;
    }

    console.log('✅ Email di notifica inviata con successo:', emailData?.id);
  } catch (error: unknown) {
    const errorObj = error && typeof error === 'object' ? error : {};
    const errorMessage = 'message' in errorObj ? String(errorObj.message) : 'Errore sconosciuto';
    const statusCode = 'statusCode' in errorObj ? String(errorObj.statusCode) : '';
    
    console.error('❌ Errore nell\'invio email di notifica:', error);
    
    // Se l'errore è relativo alla verifica del dominio, fornisci istruzioni chiare
    if (errorMessage.includes('domain is not verified') || errorMessage.includes('not verified') || statusCode === '403') {
      console.error('');
      console.error('⚠️  DOMINIO NON VERIFICATO');
      console.error('Per inviare email con Resend, devi verificare il dominio.');
      console.error('');
      console.error('SOLUZIONE RAPIDA:');
      console.error('1. Vai su https://resend.com/domains');
      console.error('2. Aggiungi e verifica il tuo dominio (richiede configurazione DNS)');
      console.error('3. Oppure verifica l\'email di destinazione nel dashboard Resend');
      console.error('');
      console.error(`Dominio attuale: ${fromEmail}`);
      console.error(`Email destinatario: ${adminEmail}`);
      console.error('');
      console.error('💡 Per test rapidi, puoi verificare l\'email destinatario nel dashboard Resend:');
      console.error('   https://resend.com/emails');
      console.error('');
    }
    // Non blocchiamo il processo se l'email fallisce
  }
}

/**
 * Invia email di congratulazioni all'utente che ha completato il corso
 */
async function sendUserCompletionEmail(data: CompletionNotificationData): Promise<void> {
  // Verifica che siamo lato server
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Le notifiche email possono essere inviate solo lato server');
    return;
  }

  // Inizializza Resend (lazy dynamic import)
  const resend = await getResendClient();
  
  // Definisci appUrl prima di usarlo
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://learning.imment.it';
  
  // Se Resend non è configurato, logga solo
  if (!resend) {
    console.log('📧 Email utente (Resend non configurato):', {
      to: data.userEmail,
      subject: `🎉 Congratulazioni! Hai completato il percorso Startup Award Fase 1`,
      body: `
        Congratulazioni! Hai completato con successo il percorso Startup Award Fase 1!
        
        Corso: ${data.courseTitle}
        Fase: Fase 1 Completata
        Completato il: ${new Date(data.completedAt).toLocaleString('it-IT')}
        
        Sei ora pronto per la Fase 2 del percorso Startup Award!

        Link alla dashboard: ${appUrl}/dashboard
      `
    });
    console.log('💡 Per inviare email reali, configura RESEND_API_KEY e RESEND_FROM_EMAIL nel .env.local');
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'notifications@onboarding.resend.dev';
  
  try {
    const completedDate = new Date(data.completedAt).toLocaleString('it-IT', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Pulisci il titolo del corso per il subject
    const cleanCourseTitle = data.courseTitle
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Pulisci anche per il corpo dell'email
    const cleanCourseTitleForBody = data.courseTitle
      .replace(/\n/g, ' ')
      .replace(/\r/g, ' ')
      .trim();

    // Usa il nome utente se disponibile, altrimenti usa la parte prima della @ dell'email
    const userName = data.userName || data.userEmail.split('@')[0] || 'Utente';

    const { data: emailData, error } = await resend.emails.send({
      from: fromEmail,
      to: data.userEmail,
      subject: `🎉 Congratulazioni! Hai completato ${cleanCourseTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Congratulazioni - Startup Award</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #9e005c 0%, #c2185b 100%); padding: 40px 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🎉 Congratulazioni!</h1>
            <p style="color: white; margin: 15px 0 0; font-size: 18px; opacity: 0.95;">Hai completato con successo la Fase 1</p>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 18px; margin-bottom: 25px; color: #111827;">
              Ciao <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; margin-bottom: 25px; color: #374151; line-height: 1.7;">
              Siamo entusiasti di comunicarti che hai completato con successo il corso <strong style="color: #9e005c;">${cleanCourseTitleForBody}</strong>!
            </p>
            
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
              <h2 style="margin-top: 0; color: #92400e; font-size: 20px; font-weight: 600;">✨ Cosa hai raggiunto</h2>
              <ul style="margin: 15px 0 0; padding-left: 20px; color: #78350f;">
                <li style="margin-bottom: 10px;">Hai completato tutte le lezioni del corso</li>
                <li style="margin-bottom: 10px;">Hai acquisito le competenze fondamentali sul fundraising</li>
                <li style="margin-bottom: 0;">Sei ora pronto per la <strong>Fase 2</strong> del percorso Startup Award</li>
              </ul>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #9e005c;">
              <h3 style="margin-top: 0; color: #9e005c; font-size: 18px; font-weight: 600;">📋 Dettagli Completamento</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 140px;">Utente:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 500;">${userName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Corso:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 500;">${cleanCourseTitleForBody}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Completato il:</td>
                  <td style="padding: 8px 0; color: #111827;">${completedDate}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Fase:</td>
                  <td style="padding: 8px 0; color: #111827;">
                    <span style="background: #10b981; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600;">
                      Fase 1 Completata ✅
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="background: #eff6ff; padding: 25px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #3b82f6; text-align: center;">
              <h3 style="margin-top: 0; color: #1e40af; font-size: 18px; font-weight: 600;">🚀 Prossimi Passi</h3>
              <p style="margin: 15px 0 20px; color: #1e3a8a; font-size: 16px;">
                Ora che hai completato la Fase 1, sei pronto per accedere alla <strong>Fase 2</strong> del percorso Startup Award.
              </p>
              <a href="${appUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #9e005c 0%, #c2185b 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(158, 0, 92, 0.2);">
                Accedi alla Dashboard →
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; text-align: center;">
              <p style="margin: 0 0 10px;">
                Hai domande o bisogno di supporto?<br>
                Siamo qui per aiutarti nel tuo percorso di crescita!
              </p>
              <p style="margin: 0; font-size: 12px;">
                Questa è una notifica automatica dal sistema Academy.<br>
                <a href="${appUrl}" style="color: #9e005c; text-decoration: none;">${appUrl}</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
🎉 Congratulazioni! Hai completato il corso Startup Award

Ciao ${userName},

Siamo entusiasti di comunicarti che hai completato con successo il corso ${cleanCourseTitleForBody}!

✨ Cosa hai raggiunto:
- Hai completato tutte le lezioni del corso
- Hai acquisito le competenze fondamentali sul finanziamento aziendale
- Sei ora pronto per la Fase 2 del percorso Startup Award

📋 Dettagli Completamento:
- Utente: ${userName}
- Corso: ${cleanCourseTitleForBody}
- Completato il: ${completedDate}
- Fase: Fase 1 Completata ✅

🚀 Prossimi Passi:
Ora che hai completato la Fase 1, sei pronto per accedere alla Fase 2 del percorso Startup Award.

Accedi alla Dashboard: ${appUrl}/dashboard

---
Hai domande o bisogno di supporto? Siamo qui per aiutarti nel tuo percorso di crescita!

Questa è una notifica automatica dal sistema Academy.
${appUrl}
      `.trim()
    });

    if (error) {
      throw error;
    }

    console.log('✅ Email di congratulazioni inviata all\'utente:', emailData?.id);
  } catch (error: unknown) {
    const errorObj = error && typeof error === 'object' ? error : {};
    const errorMessage = 'message' in errorObj ? String(errorObj.message) : 'Errore sconosciuto';
    const statusCode = 'statusCode' in errorObj ? String(errorObj.statusCode) : '';
    
    console.error('❌ Errore nell\'invio email all\'utente:', error);
    
    // Se l'errore è relativo alla verifica del dominio, logga ma non blocca
    if (errorMessage.includes('domain is not verified') || errorMessage.includes('not verified') || statusCode === '403') {
      console.error('⚠️  Dominio non verificato per email utente. Verifica il dominio su Resend.');
    }
    // Non blocchiamo il processo se l'email fallisce
  }
}

/**
 * Invia notifica via webhook
 */
async function sendWebhookNotification(data: CompletionNotificationData): Promise<void> {
  const webhookUrl = process.env.WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.WEBHOOK_SECRET && {
          'X-Webhook-Secret': process.env.WEBHOOK_SECRET
        })
      },
      body: JSON.stringify({
        event: 'course_completed',
        timestamp: new Date().toISOString(),
        data: {
          user: {
            email: data.userEmail,
            name: data.userName,
            id: data.userId
          },
          course: {
            id: data.courseId,
            title: data.courseTitle
          },
          completed_at: data.completedAt,
          phase1_completed_at: data.phase1CompletedAt
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook returned ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Webhook notification inviata con successo');
  } catch (error) {
    console.error('❌ Errore nell\'invio webhook notification:', error);
  }
}

