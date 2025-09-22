// Script per testare la struttura del database e identificare problemi
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase non configurate');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseStructure() {
  console.log('🔍 Testando la struttura del database...');
  
  try {
    // Test 1: Verifica se la tabella progress esiste
    console.log('\n1. Testando tabella progress...');
    const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .limit(1);
    
    if (progressError) {
      console.error('❌ Errore tabella progress:', progressError);
    } else {
      console.log('✅ Tabella progress accessibile');
      if (progressData && progressData.length > 0) {
        console.log('📊 Esempio record progress:', Object.keys(progressData[0]));
      } else {
        console.log('📊 Tabella progress vuota');
      }
    }
    
    // Test 2: Verifica se la tabella quiz_attempts esiste
    console.log('\n2. Testando tabella quiz_attempts...');
    const { data: attemptsData, error: attemptsError } = await supabase
      .from('quiz_attempts')
      .select('*')
      .limit(1);
    
    if (attemptsError) {
      console.error('❌ Errore tabella quiz_attempts:', attemptsError);
    } else {
      console.log('✅ Tabella quiz_attempts accessibile');
      if (attemptsData && attemptsData.length > 0) {
        console.log('📊 Esempio record quiz_attempts:', Object.keys(attemptsData[0]));
      } else {
        console.log('📊 Tabella quiz_attempts vuota');
      }
    }
    
    // Test 3: Verifica se la tabella quizzes esiste
    console.log('\n3. Testando tabella quizzes...');
    const { data: quizzesData, error: quizzesError } = await supabase
      .from('quizzes')
      .select('*')
      .limit(1);
    
    if (quizzesError) {
      console.error('❌ Errore tabella quizzes:', quizzesError);
    } else {
      console.log('✅ Tabella quizzes accessibile');
      if (quizzesData && quizzesData.length > 0) {
        console.log('📊 Esempio record quizzes:', Object.keys(quizzesData[0]));
      } else {
        console.log('📊 Tabella quizzes vuota');
      }
    }
    
    // Test 4: Test inserimento record di test
    console.log('\n4. Testando inserimento record...');
    
    // Prima cancella eventuali record di test
    await supabase
      .from('progress')
      .delete()
      .eq('lesson_id', 'test-lesson-id');
    
    const testRecord = {
      user_id: 'test-user-id',
      course_id: 'test-course-id',
      lesson_id: 'test-lesson-id',
      video_watched: true,
      quiz_completed: false,
      completed: false,
      completed_at: null
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('progress')
      .insert(testRecord)
      .select();
    
    if (insertError) {
      console.error('❌ Errore inserimento test record:', insertError);
      console.error('📝 Dettagli errore:', JSON.stringify(insertError, null, 2));
    } else {
      console.log('✅ Inserimento test record riuscito');
      console.log('📊 Record inserito:', insertData);
      
      // Pulisci il record di test
      await supabase
        .from('progress')
        .delete()
        .eq('lesson_id', 'test-lesson-id');
      console.log('🧹 Record di test rimosso');
    }
    
  } catch (error) {
    console.error('❌ Errore generale nel test:', error);
  }
}

// Esegui il test
testDatabaseStructure();
