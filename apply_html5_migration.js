const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Carica le variabili d'ambiente manualmente
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variabili d\'ambiente mancanti!');
  console.error('Assicurati di avere NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nel file .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🔄 Applicando migrazione per supporto video HTML5...');
    
    // Aggiungi i nuovi campi
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE materials ADD COLUMN IF NOT EXISTS video_type VARCHAR(20) DEFAULT 'iframe';
        ALTER TABLE materials ADD COLUMN IF NOT EXISTS html5_url VARCHAR(500);
      `
    });

    if (alterError) {
      console.error('❌ Errore nell\'aggiunta delle colonne:', alterError);
      return;
    }

    // Aggiorna i materiali esistenti
    const { error: updateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE materials 
        SET video_type = 'iframe' 
        WHERE type = 'video' AND video_type IS NULL;
      `
    });

    if (updateError) {
      console.error('❌ Errore nell\'aggiornamento dei materiali:', updateError);
      return;
    }

    // Crea gli indici
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_materials_video_type ON materials(video_type);
        CREATE INDEX IF NOT EXISTS idx_materials_html5_url ON materials(html5_url);
      `
    });

    if (indexError) {
      console.error('❌ Errore nella creazione degli indici:', indexError);
      return;
    }

    console.log('✅ Migrazione applicata con successo!');
    
    // Mostra i materiali video esistenti
    const { data: materials, error: fetchError } = await supabase
      .from('materials')
      .select('id, title, type, video_type, html5_url')
      .eq('type', 'video')
      .limit(5);

    if (fetchError) {
      console.error('❌ Errore nel recupero dei materiali:', fetchError);
      return;
    }

    console.log('\n📋 Materiali video esistenti:');
    materials.forEach(material => {
      console.log(`- ID: ${material.id}, Titolo: ${material.title}, Tipo: ${material.video_type || 'iframe'}`);
    });

  } catch (error) {
    console.error('❌ Errore generale:', error);
  }
}

applyMigration();
