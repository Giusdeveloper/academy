/**
 * Script per monitorare lo stato della verifica email
 * 
 * Questo script:
 * 1. Controlla lo stato di un account specifico
 * 2. Monitora se l'email è stata verificata
 * 3. Fornisce informazioni dettagliate
 */

import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = 'https://bvqrovzrvmdhuehonfcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEmailVerificationStatus(email) {
  console.log(`🔍 Controllo stato verifica email per: ${email}\n`);

  try {
    // Prova a fare login per vedere lo stato
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: 'TestPassword123!',
    });

    if (loginError) {
      if (loginError.message.includes('Email not confirmed')) {
        console.log('📧 STATO: Email non ancora verificata');
        console.log('   L\'account esiste ma l\'email non è stata confermata');
        console.log('   Controlla la tua casella di posta per il link di verifica');
        
        // Prova a reinviare l'email
        console.log('\n🔄 Tentativo di reinvio email di verifica...');
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: 'http://localhost:3000/verify-email'
          }
        });

        if (resendError) {
          console.error('❌ Errore reinvio:', resendError.message);
          
          if (resendError.message.includes('rate limit')) {
            console.log('\n🚨 RATE LIMIT SUPERATO');
            console.log('   Non è possibile inviare più email oggi');
            console.log('   SOLUZIONE: Configura SMTP personalizzato');
          }
        } else {
          console.log('✅ Email di verifica reinviata');
          console.log('   Controlla nuovamente la tua casella di posta');
        }
        
      } else if (loginError.message.includes('Invalid login credentials')) {
        console.log('❌ STATO: Credenziali non valide');
        console.log('   L\'account potrebbe non esistere o la password è sbagliata');
      } else {
        console.log('❌ Errore login:', loginError.message);
      }
    } else {
      console.log('✅ STATO: Login riuscito - Email verificata!');
      console.log('   - User ID:', loginData.user?.id);
      console.log('   - Email:', loginData.user?.email);
      console.log('   - Nome:', loginData.user?.user_metadata?.name);
      console.log('   - Email confermata il:', loginData.user?.email_confirmed_at);
      console.log('   - Creato il:', loginData.user?.created_at);
    }

  } catch (error) {
    console.error('❌ Errore durante il controllo:', error.message);
  }
}

async function monitorVerification(email, intervalMinutes = 2) {
  console.log(`⏰ Monitoraggio verifica email per: ${email}`);
  console.log(`   Intervallo: ${intervalMinutes} minuti`);
  console.log('   Premi Ctrl+C per fermare il monitoraggio\n');

  let attempts = 0;
  const maxAttempts = 10; // Massimo 20 minuti di monitoraggio

  const interval = setInterval(async () => {
    attempts++;
    console.log(`\n--- Tentativo ${attempts}/${maxAttempts} ---`);
    
    await checkEmailVerificationStatus(email);
    
    if (attempts >= maxAttempts) {
      console.log('\n⏰ Monitoraggio terminato (tempo scaduto)');
      clearInterval(interval);
    }
  }, intervalMinutes * 60 * 1000);

  // Controllo iniziale
  await checkEmailVerificationStatus(email);
}

// Esegui il controllo
const email = process.argv[2];
const monitor = process.argv.includes('--monitor');

if (!email) {
  console.log('❌ Specifica un\'email da controllare');
  console.log('Uso: node monitor_email_verification.js <email> [--monitor]');
  console.log('Esempio: node monitor_email_verification.js test@example.com --monitor');
  process.exit(1);
}

if (monitor) {
  monitorVerification(email);
} else {
  checkEmailVerificationStatus(email);
}

export {
  checkEmailVerificationStatus,
  monitorVerification
};
