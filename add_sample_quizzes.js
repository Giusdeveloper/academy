const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://bvqrovzrvmdhuehonfcq.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cXJvdnpydm1kaHVlaG9uZmNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDA0MzksImV4cCI6MjA2MzU3NjQzOX0.g8XwaSE8-IYv2vyt1W3iL0IFAbUgEC_pMy_oxdaLbxs'
);

async function addSampleQuizzes() {
  try {
    console.log('🎯 Aggiungendo quiz di esempio...');
    
    // Recupera le lezioni
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, "order"')
      .order('order');
    
    if (lessonsError) {
      console.error('❌ Errore nel recupero delle lezioni:', lessonsError);
      return;
    }
    
    console.log(`📚 Trovate ${lessons.length} lezioni`);
    
    // Quiz di esempio per ogni lezione
    const sampleQuizzes = [
      {
        title: "Quiz: La Seconda Rivoluzione Digitale",
        description: "Testa le tue conoscenze sui concetti fondamentali della rivoluzione digitale.",
        questions: [
          {
            id: "q1",
            question: "Cosa caratterizza la seconda rivoluzione digitale?",
            type: "multiple_choice",
            options: [
              "L'invenzione del computer",
              "L'integrazione di tecnologie avanzate come AI e IoT",
              "La nascita di internet",
              "L'invenzione del telefono"
            ],
            correct_answer: 1,
            explanation: "La seconda rivoluzione digitale è caratterizzata dall'integrazione di tecnologie avanzate come l'intelligenza artificiale e l'Internet delle cose."
          },
          {
            id: "q2",
            question: "L'intelligenza artificiale è una tecnologia chiave della rivoluzione digitale attuale.",
            type: "true_false",
            options: ["Vero", "Falso"],
            correct_answer: 0,
            explanation: "Vero, l'AI è una delle tecnologie più importanti della rivoluzione digitale attuale."
          }
        ],
        passing_score: 70,
        max_attempts: 3
      },
      {
        title: "Quiz: Finanziamento Aziendale",
        description: "Verifica la tua comprensione dei concetti di finanziamento aziendale.",
        questions: [
          {
            id: "q1",
            question: "Qual è la differenza principale tra debito ed equity?",
            type: "multiple_choice",
            options: [
              "Non c'è differenza",
              "Il debito deve essere restituito, l'equity no",
              "L'equity è più costoso del debito",
              "Il debito è sempre preferibile"
            ],
            correct_answer: 1,
            explanation: "Il debito deve essere restituito con interessi, mentre l'equity rappresenta una partecipazione nella proprietà dell'azienda."
          }
        ],
        passing_score: 70,
        max_attempts: 3
      }
    ];
    
    // Aggiungi quiz per le prime lezioni
    for (let i = 0; i < Math.min(lessons.length, sampleQuizzes.length); i++) {
      const lesson = lessons[i];
      const quiz = sampleQuizzes[i];
      
      // Controlla se esiste già un quiz per questa lezione
      const { data: existingQuiz } = await supabase
        .from('quizzes')
        .select('id')
        .eq('lesson_id', lesson.id)
        .limit(1);
      
      if (existingQuiz && existingQuiz.length > 0) {
        console.log(`⚠️  Quiz già esistente per la lezione "${lesson.title}"`);
        continue;
      }
      
      // Aggiungi il quiz
      const { error: insertError } = await supabase
        .from('quizzes')
        .insert({
          lesson_id: lesson.id,
          title: quiz.title,
          description: quiz.description,
          questions: quiz.questions,
          passing_score: quiz.passing_score,
          max_attempts: quiz.max_attempts
        });
      
      if (insertError) {
        console.error(`❌ Errore nell'aggiunta del quiz per "${lesson.title}":`, insertError);
      } else {
        console.log(`✅ Quiz aggiunto alla lezione "${lesson.title}"`);
      }
    }
    
    console.log('🎉 Quiz di esempio aggiunti con successo!');
    
  } catch (error) {
    console.error('❌ Errore durante l\'aggiunta dei quiz:', error);
  }
}

addSampleQuizzes();
