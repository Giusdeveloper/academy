const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leggi le variabili d'ambiente
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  }
}

loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase non configurate');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigrations() {
  console.log('🚀 Applicazione migrazioni per la tabella quizzes...');

  try {
    // Leggi il file di migrazione
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20241201000002_add_quizzes_table.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ File di migrazione non trovato:', migrationPath);
      return;
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 File di migrazione trovato');

    // Applica la migrazione
    console.log('⚡ Applico la migrazione...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      console.error('❌ Errore nell\'applicazione della migrazione:', error);
      
      // Prova a eseguire le query una per una
      console.log('🔄 Provo a eseguire le query individualmente...');
      
      const queries = migrationSQL.split(';').filter(q => q.trim());
      
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i].trim();
        if (query) {
          console.log(`📝 Eseguo query ${i + 1}/${queries.length}...`);
          try {
            const { error: queryError } = await supabase.rpc('exec_sql', { sql: query + ';' });
            if (queryError) {
              console.warn(`⚠️  Query ${i + 1} fallita:`, queryError.message);
            } else {
              console.log(`✅ Query ${i + 1} eseguita con successo`);
            }
          } catch (err) {
            console.warn(`⚠️  Query ${i + 1} fallita:`, err.message);
          }
        }
      }
    } else {
      console.log('✅ Migrazione applicata con successo!');
    }

    // Verifica che la tabella sia stata creata
    console.log('🔍 Verifico che la tabella quizzes sia stata creata...');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'quizzes');

    if (tableError) {
      console.log('⚠️  Non posso verificare le tabelle');
    } else if (tables && tables.length > 0) {
      console.log('✅ Tabella quizzes creata con successo!');
    } else {
      console.log('❌ Tabella quizzes non trovata');
    }

  } catch (error) {
    console.error('❌ Errore durante l\'applicazione delle migrazioni:', error);
  }
}

// Esegui le migrazioni
applyMigrations();
