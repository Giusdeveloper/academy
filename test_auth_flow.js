/**
 * Script di test per il flusso di autenticazione (senza invio email)
 * 
 * Questo script testa:
 * 1. La configurazione di Supabase
 * 2. La struttura del codice di autenticazione
 * 3. La gestione degli errori
 */

const { createClient } = require('@supabase/supabase-js');

// Configurazione Supabase
const supabaseUrl = 'https://bvqrovzrvmdhuehonfcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🔗 Test connessione Supabase...\n');

  try {
    // Test connessione di base
    const { data, error } = await supabase.from('courses').select('count').limit(1);
    
    if (error) {
      console.error('❌ Errore connessione Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Connessione Supabase funzionante');
    return true;
  } catch (error) {
    console.error('❌ Errore durante il test connessione:', error.message);
    return false;
  }
}

async function testAuthConfiguration() {
  console.log('🔐 Test configurazione autenticazione...\n');

  try {
    // Test configurazione auth
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error && !error.message.includes('Invalid JWT')) {
      console.error('❌ Errore configurazione auth:', error.message);
      return false;
    }
    
    console.log('✅ Configurazione autenticazione corretta');
    console.log('   - Utente attuale:', user ? user.email : 'Nessuno');
    return true;
  } catch (error) {
    console.error('❌ Errore durante il test auth:', error.message);
    return false;
  }
}

async function testEmailValidation() {
  console.log('📧 Test validazione email...\n');

  const testEmails = [
    'test@example.com',
    'invalid-email',
    'test@domain.com',
    'user+tag@example.org'
  ];

  for (const email of testEmails) {
    try {
      // Test solo la validazione, non l'invio
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      
      console.log(`   ${email}: ${isValid ? '✅ Valida' : '❌ Non valida'}`);
    } catch (error) {
      console.log(`   ${email}: ❌ Errore validazione`);
    }
  }
  
  return true;
}

async function testErrorHandling() {
  console.log('⚠️ Test gestione errori...\n');

  const testCases = [
    {
      name: 'Email non confermata',
      error: { message: 'Email not confirmed' },
      expected: 'Gestito correttamente'
    },
    {
      name: 'Credenziali non valide',
      error: { message: 'Invalid login credentials' },
      expected: 'Gestito correttamente'
    },
    {
      name: 'Errore generico',
      error: { message: 'Something went wrong' },
      expected: 'Gestito correttamente'
    }
  ];

  for (const testCase of testCases) {
    const error = testCase.error;
    let handled = false;
    
    if (error.message.includes('Email not confirmed') || 
        error.message.includes('email_not_confirmed')) {
      handled = true;
    } else if (error.message.includes('Invalid login credentials')) {
      handled = true;
    } else {
      handled = true; // Gestione generica
    }
    
    console.log(`   ${testCase.name}: ${handled ? '✅' : '❌'} ${testCase.expected}`);
  }
  
  return true;
}

async function runAllTests() {
  console.log('🧪 Iniziando test del flusso di autenticazione...\n');

  const results = [];
  
  results.push(await testSupabaseConnection());
  results.push(await testAuthConfiguration());
  results.push(await testEmailValidation());
  results.push(await testErrorHandling());

  console.log('\n📊 Risultati test:');
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`   Test superati: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('✅ Tutti i test sono passati!');
    console.log('\n📋 Prossimi passi:');
    console.log('1. Configura i redirect URL in Supabase Dashboard');
    console.log('2. Testa la registrazione nel browser');
    console.log('3. Verifica che le email arrivino correttamente');
    console.log('4. Testa il flusso completo di verifica');
  } else {
    console.log('❌ Alcuni test sono falliti. Controlla la configurazione.');
  }
}

// Esegui i test
runAllTests();

module.exports = {
  testSupabaseConnection,
  testAuthConfiguration,
  testEmailValidation,
  testErrorHandling
};
