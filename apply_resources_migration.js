const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configurazione Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variabili d\'ambiente mancanti:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyResourcesMigration() {
  try {
    console.log('🚀 Inizio migrazione database risorse...');
    
    // Leggi il file SQL
    const sqlFile = path.join(__dirname, 'create_resources_database.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Esegui la migrazione
    console.log('📝 Esecuzione script SQL...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ Errore durante l\'esecuzione dello script SQL:', error);
      return;
    }
    
    console.log('✅ Migrazione completata con successo!');
    
    // Verifica che le tabelle siano state create
    console.log('🔍 Verifica creazione tabelle...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['resources', 'resource_downloads', 'resource_views']);
    
    if (tablesError) {
      console.error('❌ Errore nella verifica tabelle:', tablesError);
      return;
    }
    
    console.log('📊 Tabelle create:', tables.map(t => t.table_name));
    
    // Verifica inserimento dati di esempio
    const { data: resources, error: resourcesError } = await supabase
      .from('resources')
      .select('id, title, type, category')
      .limit(5);
    
    if (resourcesError) {
      console.error('❌ Errore nella verifica risorse:', resourcesError);
      return;
    }
    
    console.log('📚 Risorse di esempio inserite:', resources.length);
    resources.forEach(resource => {
      console.log(`   - ${resource.title} (${resource.type}, ${resource.category})`);
    });
    
    console.log('🎉 Migrazione database risorse completata!');
    console.log('📋 Prossimi passi:');
    console.log('   1. Implementare l\'interfaccia della pagina risorse');
    console.log('   2. Aggiungere funzionalità di ricerca e filtri');
    console.log('   3. Implementare sistema di download');
    
  } catch (error) {
    console.error('❌ Errore durante la migrazione:', error);
  }
}

// Esegui la migrazione
applyResourcesMigration();
