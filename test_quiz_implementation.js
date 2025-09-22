import { createClient } from '@supabase/supabase-js';

// Configurazione Supabase
const supabaseUrl = 'https://bvqrovzrvmdhuehonfcq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuizImplementation() {
  console.log('🧪 Test Implementazione Quiz');
  console.log('============================\n');

  try {
    // 1. Verifica che tutti i quiz siano stati creati
    console.log('1️⃣ Verifica quiz creati...');
    const { data: quizzes, error: quizError } = await supabase
      .from('quizzes')
      .select('id, lesson_id, title, questions, passing_score, time_limit');

    if (quizError) {
      console.error('❌ Errore nel recupero dei quiz:', quizError);
      return;
    }

    console.log(`✅ Trovati ${quizzes.length} quiz nel database\n`);

    // 2. Verifica che tutti i quiz siano collegati alle lezioni corrette
    console.log('2️⃣ Verifica collegamento quiz-lezioni...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, "order"')
      .order('order');

    if (lessonsError) {
      console.error('❌ Errore nel recupero delle lezioni:', lessonsError);
      return;
    }

    console.log(`✅ Trovate ${lessons.length} lezioni nel database\n`);

    // 3. Verifica che ogni lezione abbia un quiz
    console.log('3️⃣ Verifica copertura quiz...');
    console.log('================================');
    
    let lessonsWithQuiz = 0;
    const missingQuizzes = [];

    for (const lesson of lessons) {
      const quiz = quizzes.find(q => q.lesson_id === lesson.id);
      if (quiz) {
        lessonsWithQuiz++;
        console.log(`✅ Lezione ${lesson.order}: ${lesson.title}`);
        console.log(`   📝 Quiz: ${quiz.title}`);
        console.log(`   🎯 Domande: ${JSON.parse(quiz.questions).length}`);
        console.log(`   ⏱️  Tempo: ${quiz.time_limit} min`);
        console.log('---');
      } else {
        missingQuizzes.push(lesson);
        console.log(`❌ Lezione ${lesson.order}: ${lesson.title} - NESSUN QUIZ`);
        console.log('---');
      }
    }

    console.log('\n📊 Statistiche:');
    console.log('===============');
    console.log(`✅ Lezioni con quiz: ${lessonsWithQuiz}/${lessons.length}`);
    console.log(`❌ Lezioni senza quiz: ${missingQuizzes.length}`);
    console.log(`📈 Copertura: ${((lessonsWithQuiz / lessons.length) * 100).toFixed(0)}%`);

    if (missingQuizzes.length > 0) {
      console.log('\n⚠️ Lezioni senza quiz:');
      missingQuizzes.forEach(lesson => {
        console.log(`   - ${lesson.order}. ${lesson.title}`);
      });
    }

    // 4. Verifica formato delle domande
    console.log('\n4️⃣ Verifica formato domande...');
    let validQuizzes = 0;
    let invalidQuizzes = 0;

    for (const quiz of quizzes) {
      try {
        const questions = JSON.parse(quiz.questions);
        if (Array.isArray(questions) && questions.length > 0) {
          // Verifica struttura domande
          const validQuestions = questions.filter(q => 
            q.id && q.question && q.type && q.options && 
            Array.isArray(q.options) && q.correct_answer !== undefined
          );
          
          if (validQuestions.length === questions.length) {
            validQuizzes++;
          } else {
            console.log(`⚠️ Quiz "${quiz.title}" ha domande malformate`);
            invalidQuizzes++;
          }
        } else {
          console.log(`❌ Quiz "${quiz.title}" ha formato domande non valido`);
          invalidQuizzes++;
        }
      } catch (err) {
        console.log(`❌ Quiz "${quiz.title}" ha JSON non valido: ${err.message}`);
        invalidQuizzes++;
      }
    }

    console.log(`✅ Quiz con formato valido: ${validQuizzes}`);
    console.log(`❌ Quiz con problemi: ${invalidQuizzes}`);

    // 5. Test di un quiz specifico
    if (quizzes.length > 0) {
      console.log('\n5️⃣ Test quiz specifico...');
      const testQuiz = quizzes[0];
      console.log(`🧪 Testando quiz: "${testQuiz.title}"`);
      
      try {
        const questions = JSON.parse(testQuiz.questions);
        console.log(`   📝 Domande: ${questions.length}`);
        console.log(`   🎯 Punteggio minimo: ${testQuiz.passing_score}%`);
        console.log(`   ⏱️  Tempo limite: ${testQuiz.time_limit} minuti`);
        
        // Simula una risposta corretta
        let correctAnswers = 0;
        questions.forEach((q, index) => {
          if (q.correct_answer !== undefined) {
            correctAnswers++;
          }
        });
        
        const score = (correctAnswers / questions.length) * 100;
        const passed = score >= testQuiz.passing_score;
        
        console.log(`   📊 Punteggio simulato: ${score.toFixed(0)}%`);
        console.log(`   ✅ Risultato: ${passed ? 'PASSATO' : 'NON PASSATO'}`);
        
      } catch (err) {
        console.log(`   ❌ Errore nel test: ${err.message}`);
      }
    }

    console.log('\n🎉 Test completato!');
    
    if (lessonsWithQuiz === lessons.length && invalidQuizzes === 0) {
      console.log('✅ Tutto perfetto! Il sistema quiz è pronto per l\'uso.');
    } else {
      console.log('⚠️ Alcuni problemi da risolvere. Controlla i dettagli sopra.');
    }

  } catch (error) {
    console.error('❌ Errore generale durante il test:', error);
  }
}

testQuizImplementation();
