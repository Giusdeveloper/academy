import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase (sostituisci con i tuoi valori)
const supabaseUrl = 'https://bvqrovzrvmdhuehonfcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase non configurate');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getLessons() {
  try {
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('id, title, "order"')
      .order('order');

    if (error) {
      console.error('❌ Errore nel recupero delle lezioni:', error);
      return;
    }

    console.log('📚 Lezioni nel database:');
    console.log('========================');
    lessons.forEach(lesson => {
      console.log(`${lesson.order}. ${lesson.title}`);
      console.log(`   ID: ${lesson.id}`);
      console.log('---');
    });

    console.log(`\n📊 Totale lezioni: ${lessons.length}`);

    // Genera anche gli INSERT statements corretti
    console.log('\n🔧 INSERT statements corretti:');
    console.log('===============================');
    lessons.forEach(lesson => {
      console.log(`-- Lezione ${lesson.order}: ${lesson.title}`);
      console.log(`'${lesson.id}', // ${lesson.title}`);
      console.log('');
    });

  } catch (err) {
    console.error('❌ Errore:', err);
  }
}

getLessons();
