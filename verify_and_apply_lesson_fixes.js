// Script per verificare e applicare le correzioni delle lezioni
// Questo script controlla se le correzioni sono state applicate e le applica se necessario

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Configurazione Supabase (sostituisci con le tue credenziali)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Credenziali Supabase non trovate. Assicurati di avere NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nel file .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLessonContent() {
  console.log('🔍 Verifico il contenuto delle lezioni...');
  
  try {
    // Recupera tutte le lezioni
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('id, title, content')
      .order('order');

    if (error) {
      console.error('❌ Errore nel recupero delle lezioni:', error);
      return;
    }

    console.log(`📚 Trovate ${lessons.length} lezioni`);

    // Controlla se ci sono riferimenti malformati
    const malformedLessons = lessons.filter(lesson => 
      lesson.content && lesson.content.includes(':contentReference[oaicite:')
    );

    if (malformedLessons.length > 0) {
      console.log(`⚠️  Trovate ${malformedLessons.length} lezioni con riferimenti malformati:`);
      malformedLessons.forEach(lesson => {
        console.log(`   - ${lesson.title} (ID: ${lesson.id})`);
      });
      
      console.log('\n📝 Applico le correzioni...');
      await applyLessonFixes();
    } else {
      console.log('✅ Tutte le lezioni sono già corrette!');
    }

  } catch (error) {
    console.error('❌ Errore durante la verifica:', error);
  }
}

async function applyLessonFixes() {
  try {
    // Leggi il file delle correzioni complete
    const fixesContent = fs.readFileSync('lessons_content_fixed_complete.sql', 'utf8');
    
    // Dividi il contenuto in singole query UPDATE
    const updateQueries = fixesContent
      .split(';')
      .filter(query => query.trim().startsWith('UPDATE'))
      .map(query => query.trim() + ';');

    console.log(`🔄 Applico ${updateQueries.length} correzioni...`);

    for (let i = 0; i < updateQueries.length; i++) {
      const query = updateQueries[i];
      if (query.trim()) {
        console.log(`   ${i + 1}/${updateQueries.length} - Applicando correzione...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: query });
        
        if (error) {
          console.error(`❌ Errore nell'applicazione della correzione ${i + 1}:`, error);
        } else {
          console.log(`   ✅ Correzione ${i + 1} applicata con successo`);
        }
      }
    }

    console.log('\n🎉 Tutte le correzioni sono state applicate!');
    console.log('🔄 Verifico nuovamente il contenuto...');
    
    // Verifica finale
    await checkLessonContent();

  } catch (error) {
    console.error('❌ Errore durante l\'applicazione delle correzioni:', error);
  }
}

// Funzione principale
async function main() {
  console.log('🚀 Avvio verifica e correzione delle lezioni...\n');
  await checkLessonContent();
  console.log('\n✨ Operazione completata!');
}

// Esegui lo script
main().catch(console.error);
