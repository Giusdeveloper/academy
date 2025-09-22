// Test script per verificare la connessione a Supabase
import { createClient } from '@supabase/supabase-js';

// Verifica se le variabili d'ambiente sono definite
console.log('🔍 Verifica variabili d\'ambiente:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Definita' : '❌ Mancante');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Definita' : '❌ Mancante');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('\n❌ Variabili d\'ambiente mancanti!');
  console.log('Configura le variabili su Vercel Dashboard:');
  console.log('1. Vai su Vercel → Il tuo progetto → Settings → Environment Variables');
  console.log('2. Aggiungi NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Test connessione
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  try {
    console.log('\n🔗 Test connessione Supabase...');
    
    // Test semplice: verifica se la tabella resources esiste
    const { data, error } = await supabase
      .from('resources')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Errore connessione:', error.message);
      if (error.message.includes('relation "resources" does not exist')) {
        console.log('\n💡 Soluzione: Applica la migrazione del database');
        console.log('1. Vai su Supabase Dashboard → SQL Editor');
        console.log('2. Esegui il contenuto di create_resources_database.sql');
      }
    } else {
      console.log('✅ Connessione Supabase funzionante!');
      console.log('✅ Tabella resources accessibile');
    }
    
  } catch (err) {
    console.log('❌ Errore generico:', err.message);
  }
}

testConnection();
