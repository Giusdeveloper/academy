/**
 * Script di test per il flusso di verifica email
 * 
 * Questo script testa:
 * 1. Registrazione di un nuovo utente
 * 2. Verifica che l'email di verifica sia inviata
 * 3. Simula la verifica dell'email
 * 4. Testa il login dopo la verifica
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = 'https://bvqrovzrvmdhuehonfcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs';

const supabase = createClient(supabaseUrl, supabaseKey);

// Email di test (usa una email temporanea o di test)
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';
const testName = 'Test User';

async function testEmailVerificationFlow() {
  console.log('🧪 Iniziando test del flusso di verifica email...\n');

  try {
    // 1. Test registrazione
    console.log('1️⃣ Test registrazione...');
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
        },
        emailRedirectTo: 'http://localhost:3000/verify-email',
      },
    });

    if (signupError) {
      console.error('❌ Errore registrazione:', signupError.message);
      return;
    }

    console.log('✅ Registrazione completata');
    console.log('   - User ID:', signupData.user?.id);
    console.log('   - Email confermata:', !!signupData.user?.email_confirmed_at);
    console.log('   - Email inviata:', signupData.user ? 'Sì' : 'No');

    if (!signupData.user?.email_confirmed_at) {
      console.log('📧 Email di verifica inviata a:', testEmail);
      console.log('   Controlla la tua casella di posta e clicca sul link di verifica.');
      console.log('   Dopo aver verificato, esegui di nuovo questo script per testare il login.\n');
      
      // Test del reinvio email
      console.log('2️⃣ Test reinvio email di verifica...');
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: testEmail,
        options: {
          emailRedirectTo: 'http://localhost:3000/verify-email'
        }
      });

      if (resendError) {
        console.error('❌ Errore reinvio email:', resendError.message);
      } else {
        console.log('✅ Email di verifica reinviata');
      }
    }

    // 2. Test login (dovrebbe fallire se email non verificata)
    console.log('\n3️⃣ Test login (dovrebbe fallire se email non verificata)...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (loginError) {
      if (loginError.message.includes('Email not confirmed')) {
        console.log('✅ Login correttamente bloccato - email non verificata');
        console.log('   Messaggio:', loginError.message);
      } else {
        console.error('❌ Errore login inaspettato:', loginError.message);
      }
    } else {
      console.log('✅ Login riuscito - email già verificata');
      console.log('   - User ID:', loginData.user?.id);
      console.log('   - Email confermata:', !!loginData.user?.email_confirmed_at);
    }

    // 3. Test logout
    console.log('\n4️⃣ Test logout...');
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) {
      console.error('❌ Errore logout:', logoutError.message);
    } else {
      console.log('✅ Logout completato');
    }

  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
  }

  console.log('\n🏁 Test completato!');
  console.log('\n📋 Prossimi passi:');
  console.log('1. Controlla la tua email per il link di verifica');
  console.log('2. Clicca sul link per verificare l\'account');
  console.log('3. Esegui di nuovo questo script per testare il login');
  console.log('4. Verifica che il flusso funzioni correttamente nel browser');
}

// Funzione per testare solo il login (dopo la verifica)
async function testLoginAfterVerification() {
  console.log('🔐 Test login dopo verifica email...\n');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (error) {
      console.error('❌ Errore login:', error.message);
    } else {
      console.log('✅ Login riuscito!');
      console.log('   - User ID:', data.user?.id);
      console.log('   - Email:', data.user?.email);
      console.log('   - Nome:', data.user?.user_metadata?.name);
      console.log('   - Email confermata:', !!data.user?.email_confirmed_at);
      console.log('   - Data conferma:', data.user?.email_confirmed_at);
    }
  } catch (error) {
    console.error('❌ Errore durante il test login:', error.message);
  }
}

// Esegui il test
if (process.argv.includes('--login-only')) {
  testLoginAfterVerification();
} else {
  testEmailVerificationFlow();
}

module.exports = {
  testEmailVerificationFlow,
  testLoginAfterVerification
};
