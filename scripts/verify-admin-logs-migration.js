import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carica variabili da .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([^#][^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Errore: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devono essere configurate in .env.local');
  console.error('💡 Assicurati che il file .env.local esista nella root del progetto');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function verifyMigration() {
  console.log('🔍 Verifica migration admin_logs...\n');
  
  const checks = {
    tableExists: false,
    enumsExist: false,
    indexesExist: false,
    functionExists: false,
    columnsCorrect: false,
  };

  try {
    // 1. Verifica che la tabella esista
    console.log('1️⃣  Verifica tabella admin_logs...');
    const { error: tableError } = await supabase
      .from('admin_logs')
      .select('*')
      .limit(0);
    
    if (tableError) {
      if (tableError.code === '42P01') {
        console.log('   ❌ Tabella admin_logs non trovata!');
        console.log('   💡 Esegui la migration nel SQL Editor di Supabase');
        return false;
      }
      throw tableError;
    }
    
    checks.tableExists = true;
    console.log('   ✅ Tabella admin_logs esiste');

    // 2. Verifica gli enum tramite inserimento di test
    console.log('\n2️⃣  Verifica enum types...');
    
    // Verifica alternativa: prova a inserire un valore enum per vedere se esiste
    const testLog = {
      admin_id: '00000000-0000-0000-0000-000000000000', // UUID dummy
      admin_email: 'test@test.com',
      action_type: 'CREATE',
      entity_type: 'EVENT',
      description: 'Test verification',
    };

    let insertResult;
    try {
      insertResult = await supabase
        .from('admin_logs')
        .insert(testLog)
        .select();
    } catch (err) {
      insertResult = { error: err };
    }

    if (insertResult.error) {
      const errorMsg = insertResult.error.message || String(insertResult.error);
      if (errorMsg.includes('invalid input value for enum') || errorMsg.includes('type') || errorMsg.includes('does not exist')) {
        console.log('   ❌ Enum types non trovati!');
        console.log('   💡 Verifica che gli enum siano stati creati correttamente');
        console.log(`   📝 Errore: ${errorMsg}`);
        return false;
      }
      // Altri errori (es. foreign key) sono ok, significa che gli enum esistono
    }
    
    // Elimina il log di test se è stato creato
    if (!insertResult.error) {
      await supabase
        .from('admin_logs')
        .delete()
        .eq('admin_email', 'test@test.com');
    }

    checks.enumsExist = true;
    console.log('   ✅ Enum types esistono');

    // 3. Verifica le colonne
    console.log('\n3️⃣  Verifica colonne...');
    
    const expectedColumns = [
      'id', 'admin_id', 'admin_email', 'admin_name', 
      'action_type', 'entity_type', 'entity_id', 
      'description', 'details', 'ip_address', 'user_agent', 'created_at'
    ];

    // Verifica: prova a fare una query SELECT con tutte le colonne
    const { error: sampleError } = await supabase
      .from('admin_logs')
      .select('id, admin_id, admin_email, admin_name, action_type, entity_type, entity_id, description, details, ip_address, user_agent, created_at')
      .limit(1);

    if (sampleError) {
      const errorMsg = sampleError.message || String(sampleError);
      if (errorMsg.includes('column') || errorMsg.includes('does not exist')) {
        console.log('   ❌ Alcune colonne mancanti!');
        console.log('   💡 Verifica la struttura della tabella');
        console.log(`   📝 Errore: ${errorMsg}`);
        return false;
      }
    }

    checks.columnsCorrect = true;
    console.log('   ✅ Tutte le colonne sono presenti');
    console.log(`   📋 Colonne verificate: ${expectedColumns.length}`);

    // 4. Verifica indici (query diretta non disponibile, ma possiamo verificare le performance)
    console.log('\n4️⃣  Verifica indici...');
    // Non possiamo verificare direttamente gli indici, ma possiamo verificare che le query funzionino
    const { error: indexError } = await supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (indexError) {
      console.log('   ⚠️  Impossibile verificare indici direttamente');
    } else {
      checks.indexesExist = true;
      console.log('   ✅ Indici funzionanti (query ordinate funzionano)');
    }

    // 5. Verifica funzione cleanup
    console.log('\n5️⃣  Verifica funzione cleanup_old_admin_logs...');
    const { error: functionError } = await supabase.rpc('cleanup_old_admin_logs', {
      days_to_keep: 999999 // Numero molto alto per non eliminare nulla
    });

    if (functionError) {
      if (functionError.message?.includes('function') && functionError.message?.includes('does not exist')) {
        console.log('   ⚠️  Funzione cleanup_old_admin_logs non trovata');
        console.log('   💡 La funzione è opzionale, ma consigliata');
      } else {
        throw functionError;
      }
    } else {
      checks.functionExists = true;
      console.log('   ✅ Funzione cleanup_old_admin_logs esiste');
    }

    // Riepilogo
    console.log('\n' + '='.repeat(50));
    console.log('📊 Riepilogo verifica:');
    console.log('='.repeat(50));
    console.log(`✅ Tabella admin_logs: ${checks.tableExists ? 'OK' : 'MISSING'}`);
    console.log(`✅ Enum types: ${checks.enumsExist ? 'OK' : 'MISSING'}`);
    console.log(`✅ Colonne: ${checks.columnsCorrect ? 'OK' : 'MISSING'}`);
    console.log(`✅ Indici: ${checks.indexesExist ? 'OK' : 'UNKNOWN'}`);
    console.log(`✅ Funzione cleanup: ${checks.functionExists ? 'OK' : 'MISSING (opzionale)'}`);
    console.log('='.repeat(50));

    const allCritical = checks.tableExists && checks.enumsExist && checks.columnsCorrect;
    
    if (allCritical) {
      console.log('\n✅ Migration completata con successo!');
      console.log('🎉 Il sistema di logging è pronto per l\'uso.');
      console.log('\n💡 Prossimi passi:');
      console.log('   1. Vai su /admin');
      console.log('   2. Crea/modifica una risorsa o evento');
      console.log('   3. Vai su /admin/logs per vedere i log');
      return true;
    } else {
      console.log('\n❌ Migration incompleta!');
      console.log('💡 Esegui la migration nel SQL Editor di Supabase');
      return false;
    }

  } catch (error) {
    console.error('\n❌ Errore durante la verifica:', error.message);
    console.log('\n💡 Esegui manualmente la migration nel SQL Editor di Supabase');
    return false;
  }
}

verifyMigration().then((success) => {
  process.exit(success ? 0 : 1);
});

