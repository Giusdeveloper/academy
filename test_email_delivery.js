/**
 * Script per testare la consegna delle email di Supabase
 * 
 * Questo script:
 * 1. Testa la registrazione
 * 2. Verifica se l'email viene inviata
 * 3. Fornisce informazioni per il troubleshooting
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = 'https://bvqrovzrvmdhuehonfcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEmailDelivery() {
  console.log('📧 Test consegna email di Supabase...\n');

  // Email di test (usa una email reale per testare)
  const testEmail = 'test@example.com'; // Cambia con la tua email
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  try {
    console.log('1️⃣ Tentativo di registrazione...');
    console.log(`   Email: ${testEmail}`);
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          name: testName,
        },
        emailRedirectTo: 'http://localhost:3000/verify-email',
      },
    });

    if (error) {
      console.error('❌ Errore registrazione:', error.message);
      
      if (error.message.includes('rate limit')) {
        console.log('\n🚨 PROBLEMA IDENTIFICATO: Rate limit superato');
        console.log('   Supabase ha limiti molto bassi per le email (circa 3/giorno)');
        console.log('   SOLUZIONE: Configura un provider SMTP personalizzato');
        console.log('   Vedi: CONFIGURAZIONE_EMAIL_SMTP.md');
      }
      
      return;
    }

    console.log('✅ Registrazione completata');
    console.log('   - User ID:', data.user?.id);
    console.log('   - Email confermata:', !!data.user?.email_confirmed_at);
    
    if (!data.user?.email_confirmed_at) {
      console.log('\n📧 Email di verifica dovrebbe essere stata inviata');
      console.log('   Controlla la tua casella di posta (inclusa la cartella spam)');
      console.log('   Se non ricevi l\'email, il problema è nella configurazione SMTP');
    }

    // Test del reinvio
    console.log('\n2️⃣ Test reinvio email...');
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: testEmail,
      options: {
        emailRedirectTo: 'http://localhost:3000/verify-email'
      }
    });

    if (resendError) {
      console.error('❌ Errore reinvio:', resendError.message);
      
      if (resendError.message.includes('rate limit')) {
        console.log('\n🚨 CONFERMATO: Rate limit superato');
        console.log('   Supabase non può inviare più email oggi');
        console.log('   SOLUZIONE IMMEDIATA:');
        console.log('   1. Configura Gmail SMTP (gratuito, 500 email/giorno)');
        console.log('   2. Oppure usa SendGrid (gratuito, 100 email/giorno)');
        console.log('   3. Vedi la guida: CONFIGURAZIONE_EMAIL_SMTP.md');
      }
    } else {
      console.log('✅ Email di verifica reinviata');
    }

  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
  }

  console.log('\n📋 DIAGNOSI:');
  console.log('Se non ricevi le email, il problema è:');
  console.log('1. 🚨 Rate limit di Supabase (molto probabile)');
  console.log('2. 📧 Email bloccata dal provider (Gmail, Outlook, etc.)');
  console.log('3. ⚙️ Configurazione SMTP mancante');
  
  console.log('\n🔧 SOLUZIONI:');
  console.log('1. Configura Gmail SMTP (raccomandato per sviluppo)');
  console.log('2. Usa SendGrid per produzione');
  console.log('3. Controlla la cartella spam');
  console.log('4. Verifica i redirect URL in Supabase Dashboard');
  
  console.log('\n📖 GUIDA COMPLETA: CONFIGURAZIONE_EMAIL_SMTP.md');
}

// Funzione per testare con email specifica
async function testWithSpecificEmail(email) {
  console.log(`📧 Test con email specifica: ${email}\n`);
  
  try {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/verify-email'
      }
    });

    if (error) {
      console.error('❌ Errore:', error.message);
    } else {
      console.log('✅ Email inviata con successo');
      console.log('   Controlla la tua casella di posta');
    }
  } catch (error) {
    console.error('❌ Errore durante l\'invio:', error.message);
  }
}

// Esegui il test
const email = process.argv[2];
if (email) {
  testWithSpecificEmail(email);
} else {
  testEmailDelivery();
}

module.exports = {
  testEmailDelivery,
  testWithSpecificEmail
};
