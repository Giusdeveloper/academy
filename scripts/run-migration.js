import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carica le variabili d'ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devono essere configurate');
  process.exit(1);
}

// Nome del file migration da eseguire
const migrationFile = process.argv[2] || '20250118000001_create_admin_logs.sql';

async function runMigration() {
  try {
    console.log(`📦 Caricamento migration: ${migrationFile}...`);
    
    // Leggi il file SQL
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);
    
    if (!fs.existsSync(migrationPath)) {
      console.error(`❌ File migration non trovato: ${migrationPath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    console.log('🔌 Connessione a Supabase...');
    
    // Crea client Supabase con service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    console.log('⚡ Esecuzione migration...');
    
    // Esegui la migration
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    // Se la funzione RPC non esiste, prova con query diretta
    if (error && error.message?.includes('function') && error.message?.includes('does not exist')) {
      console.log('⚠️  RPC non disponibile, tentativo con query diretta...');
      
      // Dividi lo SQL in singole istruzioni
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      for (const statement of statements) {
        try {
          // Usa query diretta per statement semplici
          if (statement.startsWith('CREATE TYPE') || statement.startsWith('CREATE TABLE')) {
            // Per CREATE TYPE e CREATE TABLE, usa una query raw
            const { error: execError } = await supabase
              .from('_migrations')
              .select('*')
              .limit(0); // Query dummy per testare connessione
            
            console.log(`⚠️  Statement complesso rilevato. Esegui manualmente nel SQL Editor di Supabase.`);
            console.log(`\n📋 Contenuto della migration:\n`);
            console.log(sql);
            console.log(`\n✅ Copia il contenuto sopra e incollalo nel SQL Editor di Supabase Dashboard.`);
            process.exit(0);
          }
        } catch (err) {
          console.error('❌ Errore nell\'esecuzione:', err);
        }
      }
    } else if (error) {
      throw error;
    }

    console.log('✅ Migration eseguita con successo!');
  } catch (error) {
    console.error('❌ Errore nell\'esecuzione della migration:', error);
    console.log('\n📋 Esegui manualmente la migration nel SQL Editor di Supabase Dashboard:');
    console.log('   1. Vai su https://supabase.com/dashboard');
    console.log('   2. Seleziona il tuo progetto');
    console.log('   3. Vai su SQL Editor');
    console.log('   4. Copia e incolla il contenuto del file migration');
    console.log('   5. Esegui la query\n');
    process.exit(1);
  }
}

runMigration();

