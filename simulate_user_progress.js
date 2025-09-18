const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bvqrovzrvmdhuehonfcq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs'
);

async function simulateUserProgress() {
  try {
    console.log('👤 Simulando il progresso di un utente...\n');
    
    // ID di test (simuliamo un utente)
    const testUserId = 'test-user-123';
    const testCourseId = 'a7021988-3b61-40ad-8d53-5a75984cc55c'; // Finanziamento Aziendale
    
    // 1. Recupera la prima lezione
    console.log('1️⃣ Recuperando la prima lezione...');
    
    const { data: firstLesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', testCourseId)
      .eq('"order"', 1)
      .single();
    
    if (lessonError) {
      console.log('❌ Errore nel recupero della lezione:', lessonError.message);
      return;
    }
    
    console.log(`✅ Prima lezione: "${firstLesson.title}"`);
    
    // 2. Simula la visualizzazione del video
    console.log('\n2️⃣ Simulando la visualizzazione del video...');
    
    const { error: videoError } = await supabase
      .from('progress')
      .upsert({
        user_id: testUserId,
        course_id: testCourseId,
        lesson_id: firstLesson.id,
        video_watched: true,
        quiz_completed: false,
        completed: false
      });
    
    if (videoError) {
      console.log('❌ Errore nel salvare il progresso video:', videoError.message);
    } else {
      console.log('✅ Video marcato come visto!');
    }
    
    // 3. Verifica lo stato della lezione
    console.log('\n3️⃣ Verificando lo stato della lezione...');
    
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', testUserId)
      .eq('lesson_id', firstLesson.id)
      .single();
    
    if (progressError) {
      console.log('❌ Errore nel recupero del progresso:', progressError.message);
    } else {
      console.log('📊 Stato della lezione:');
      console.log(`   - Video visto: ${progress.video_watched ? '✅' : '❌'}`);
      console.log(`   - Quiz completato: ${progress.quiz_completed ? '✅' : '❌'}`);
      console.log(`   - Lezione completata: ${progress.completed ? '✅' : '❌'}`);
    }
    
    // 4. Simula il completamento del quiz
    console.log('\n4️⃣ Simulando il completamento del quiz...');
    
    const { error: quizError } = await supabase
      .from('progress')
      .upsert({
        user_id: testUserId,
        course_id: testCourseId,
        lesson_id: firstLesson.id,
        video_watched: true,
        quiz_completed: true,
        completed: true,
        completed_at: new Date().toISOString()
      });
    
    if (quizError) {
      console.log('❌ Errore nel salvare il completamento quiz:', quizError.message);
    } else {
      console.log('✅ Quiz completato! Lezione sbloccata!');
    }
    
    // 5. Verifica lo stato finale
    console.log('\n5️⃣ Stato finale della lezione...');
    
    const { data: finalProgress, error: finalError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', testUserId)
      .eq('lesson_id', firstLesson.id)
      .single();
    
    if (finalError) {
      console.log('❌ Errore nel recupero del progresso finale:', finalError.message);
    } else {
      console.log('🎉 Stato finale:');
      console.log(`   - Video visto: ${finalProgress.video_watched ? '✅' : '❌'}`);
      console.log(`   - Quiz completato: ${finalProgress.quiz_completed ? '✅' : '❌'}`);
      console.log(`   - Lezione completata: ${finalProgress.completed ? '✅' : '❌'}`);
      console.log(`   - Completata il: ${finalProgress.completed_at || 'N/A'}`);
    }
    
    // 6. Controlla se la seconda lezione è sbloccata
    console.log('\n6️⃣ Controllando lo sblocco della seconda lezione...');
    
    const { data: secondLesson, error: secondError } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', testCourseId)
      .eq('"order"', 2)
      .single();
    
    if (secondError) {
      console.log('❌ Errore nel recupero della seconda lezione:', secondError.message);
    } else {
      console.log(`📚 Seconda lezione: "${secondLesson.title}"`);
      console.log('🔓 Questa lezione dovrebbe essere sbloccata ora!');
    }
    
    console.log('\n🎯 Test di simulazione completato!');
    console.log('\n📋 Per testare nell\'interfaccia:');
    console.log('1. Apri http://localhost:3000');
    console.log('2. Vai al corso "Finanziamento Aziendale"');
    console.log('3. La prima lezione dovrebbe essere sbloccata');
    console.log('4. Guarda il video e verifica che appaia il messaggio per il quiz');
    console.log('5. Dopo aver "completato" il quiz, la seconda lezione dovrebbe sbloccarsi');
    
  } catch (error) {
    console.error('❌ Errore durante la simulazione:', error);
  }
}

simulateUserProgress();
