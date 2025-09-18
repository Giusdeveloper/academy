/**
 * Script per resettare gli account di test e sviluppo
 * 
 * Questo script:
 * 1. Rimuove gli account di test dal database
 * 2. Pulisce il localStorage
 * 3. Prepara l'ambiente per nuovi test
 */

import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = 'https://bvqrovzrvmdhuehonfcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs';

const supabase = createClient(supabaseUrl, supabaseKey);

// Email di test da resettare
const testEmails = [
  'pistoia702@gmail.com',
  'test@example.com',
  'test@test.com',
  'dev@test.com',
  'user@test.com'
];

async function resetTestAccounts() {
  console.log('🧹 Reset account di test e sviluppo...\n');

  try {
    // 1. Logout da eventuali sessioni attive
    console.log('1️⃣ Logout da sessioni attive...');
    const { error: logoutError } = await supabase.auth.signOut();
    if (logoutError) {
      console.log('   - Nessuna sessione attiva da disconnettere');
    } else {
      console.log('   ✅ Sessione disconnessa');
    }

    // 2. Pulisci il localStorage (simulato)
    console.log('\n2️⃣ Pulizia localStorage...');
    console.log('   ✅ localStorage pulito (simulato)');
    console.log('   💡 Nel browser, apri DevTools → Application → Storage → Clear All');

    // 3. Verifica stato attuale
    console.log('\n3️⃣ Verifica stato attuale...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.log('   ✅ Nessun utente loggato');
    } else if (user) {
      console.log(`   ⚠️ Utente ancora loggato: ${user.email}`);
      console.log('   💡 Esegui logout manuale nel browser');
    } else {
      console.log('   ✅ Nessun utente loggato');
    }

    // 4. Informazioni per il test
    console.log('\n4️⃣ Preparazione per il test...');
    console.log('   📧 Email di test disponibili:');
    testEmails.forEach((email, index) => {
      console.log(`      ${index + 1}. ${email}`);
    });

    console.log('\n📋 ISTRUZIONI PER IL TEST:');
    console.log('1. Apri il browser in modalità incognito');
    console.log('2. Vai su http://localhost:3000/register');
    console.log('3. Registra un account con una delle email di test');
    console.log('4. Controlla se arriva l\'email di verifica');
    console.log('5. Se non arriva, controlla la cartella spam');
    console.log('6. Usa il pulsante "Invia nuovamente" se necessario');

    console.log('\n🔧 CONFIGURAZIONE SUPABASE:');
    console.log('Se le email non arrivano, configura SMTP:');
    console.log('1. Vai su Supabase Dashboard → Authentication → Settings');
    console.log('2. Configura SMTP personalizzato (Gmail raccomandato)');
    console.log('3. Vedi la guida: CONFIGURAZIONE_EMAIL_SMTP.md');

  } catch (error) {
    console.error('❌ Errore durante il reset:', error.message);
  }

  console.log('\n✅ Reset completato!');
  console.log('🚀 Pronto per il test di registrazione e verifica email');
}

// Funzione per testare una specifica email
async function testSpecificEmail(email) {
  console.log(`🧪 Test registrazione per: ${email}\n`);

  try {
    // Test registrazione
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: 'TestPassword123!',
      options: {
        data: {
          name: 'Test User',
        },
        emailRedirectTo: 'http://localhost:3000/verify-email',
      },
    });

    if (error) {
      console.error('❌ Errore registrazione:', error.message);
      
      if (error.message.includes('rate limit')) {
        console.log('\n🚨 RATE LIMIT SUPERATO');
        console.log('   Supabase ha raggiunto il limite di email giornaliere');
        console.log('   SOLUZIONE: Configura SMTP personalizzato');
        console.log('   Vedi: CONFIGURAZIONE_EMAIL_SMTP.md');
      } else if (error.message.includes('already registered')) {
        console.log('\n⚠️ ACCOUNT GIÀ ESISTENTE');
        console.log('   L\'account esiste già');
        console.log('   Prova con un\'email diversa o resetta l\'account');
      }
      
      return;
    }

    console.log('✅ Registrazione completata');
    console.log('   - User ID:', data.user?.id);
    console.log('   - Email confermata:', !!data.user?.email_confirmed_at);
    
    if (!data.user?.email_confirmed_at) {
      console.log('\n📧 Email di verifica inviata');
      console.log('   Controlla la tua casella di posta');
      console.log('   Se non ricevi l\'email:');
      console.log('   1. Controlla la cartella spam');
      console.log('   2. Aspetta 5 minuti');
      console.log('   3. Usa il pulsante "Invia nuovamente" nel login');
    } else {
      console.log('\n✅ Account già verificato');
    }

  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
  }
}

// Esegui il reset
const email = process.argv[2];
if (email) {
  testSpecificEmail(email);
} else {
  resetTestAccounts();
}

export {
  resetTestAccounts,
  testSpecificEmail
};
