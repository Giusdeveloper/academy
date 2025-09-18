const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bvqrovzrvmdhuehonfcq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs'
);

async function testProgression() {
  try {
    console.log('🧪 Testando il sistema di progressione...\n');
    
    // 1. Controlla le tabelle esistenti
    console.log('1️⃣ Controllando le tabelle...');
    
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .limit(1);
    
    if (progressError) {
      console.log('❌ Tabella progress:', progressError.message);
    } else {
      console.log('✅ Tabella progress: OK');
    }
    
    // 2. Controlla le lezioni
    console.log('\n2️⃣ Controllando le lezioni...');
    
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, "order", course_id')
      .order('order')
      .limit(5);
    
    if (lessonsError) {
      console.log('❌ Errore lezioni:', lessonsError.message);
    } else {
      console.log(`✅ Trovate ${lessons.length} lezioni:`);
      lessons.forEach(lesson => {
        console.log(`   - Lezione ${lesson.order}: ${lesson.title}`);
      });
    }
    
    // 3. Controlla i materiali video
    console.log('\n3️⃣ Controllando i materiali video...');
    
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('id, title, type, lesson_id')
      .eq('type', 'video')
      .limit(5);
    
    if (materialsError) {
      console.log('❌ Errore materiali:', materialsError.message);
    } else {
      console.log(`✅ Trovati ${materials.length} video:`);
      materials.forEach(material => {
        console.log(`   - ${material.title} (Lezione: ${material.lesson_id})`);
      });
    }
    
    // 4. Controlla i corsi
    console.log('\n4️⃣ Controllando i corsi...');
    
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title')
      .limit(3);
    
    if (coursesError) {
      console.log('❌ Errore corsi:', coursesError.message);
    } else {
      console.log(`✅ Trovati ${courses.length} corsi:`);
      courses.forEach(course => {
        console.log(`   - ${course.title}`);
      });
    }
    
    // 5. Test di inserimento progresso (simulato)
    console.log('\n5️⃣ Testando la struttura del progresso...');
    
    if (lessons && lessons.length > 0) {
      const firstLesson = lessons[0];
      console.log(`📝 Struttura per la lezione "${firstLesson.title}":`);
      console.log(`   - lesson_id: ${firstLesson.id}`);
      console.log(`   - course_id: ${firstLesson.course_id}`);
      console.log(`   - order: ${firstLesson.order}`);
      console.log('   - user_id: [da autenticazione]');
      console.log('   - video_watched: false');
      console.log('   - quiz_completed: false');
      console.log('   - completed: false');
    }
    
    console.log('\n🎉 Test completato!');
    console.log('\n📋 Prossimi passi per testare:');
    console.log('1. Apri http://localhost:3000');
    console.log('2. Vai a un corso');
    console.log('3. Clicca su una lezione');
    console.log('4. Guarda il video');
    console.log('5. Verifica che appaia il messaggio per il quiz');
    
  } catch (error) {
    console.error('❌ Errore durante il test:', error);
  }
}

testProgression();
