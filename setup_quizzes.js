const { createClient } = require('@supabase/supabase-js');

// Leggi le variabili d'ambiente dal file .env.local
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    lines.forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  }
}

loadEnvFile();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variabili d\'ambiente Supabase non configurate');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupQuizzes() {
  console.log('🚀 Inizializzazione tabella quiz...');

  try {
    // 1. Verifica se la tabella quizzes esiste
    console.log('📋 Verifico se la tabella quizzes esiste...');
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'quizzes');

    if (tableError) {
      console.log('⚠️  Non posso verificare le tabelle, procedo con l\'inserimento...');
    } else if (tables.length === 0) {
      console.log('❌ Tabella quizzes non trovata. Esegui prima le migrazioni SQL.');
      return;
    } else {
      console.log('✅ Tabella quizzes trovata');
    }

    // 2. Recupera le lezioni esistenti
    console.log('📚 Recupero le lezioni esistenti...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, "order", course_id')
      .order('order');

    if (lessonsError) {
      console.error('❌ Errore nel recupero delle lezioni:', lessonsError);
      return;
    }

    if (!lessons || lessons.length === 0) {
      console.log('⚠️  Nessuna lezione trovata. Crea prima delle lezioni.');
      return;
    }

    console.log(`📖 Trovate ${lessons.length} lezioni`);

    // 3. Verifica se esistono già quiz
    console.log('🔍 Verifico quiz esistenti...');
    const { data: existingQuizzes, error: quizError } = await supabase
      .from('quizzes')
      .select('id, lesson_id, title');

    if (quizError && !quizError.message.includes('does not exist')) {
      console.error('❌ Errore nel recupero dei quiz:', quizError);
      return;
    }

    if (existingQuizzes && existingQuizzes.length > 0) {
      console.log(`✅ Trovati ${existingQuizzes.length} quiz esistenti`);
      console.log('📝 Quiz esistenti:');
      existingQuizzes.forEach(quiz => {
        console.log(`   - ${quiz.title} (Lezione: ${quiz.lesson_id})`);
      });
      return;
    }

    // 4. Crea quiz di esempio per le prime 3 lezioni
    console.log('🎯 Creo quiz di esempio...');
    
    const sampleQuizzes = [
      {
        lesson_id: lessons[0].id,
        title: 'Quiz di Verifica - Introduzione',
        description: 'Testa le tue conoscenze sui concetti fondamentali appresi in questa lezione.',
        questions: [
          {
            id: 'q1',
            question: 'Qual è l\'obiettivo principale di questa lezione?',
            type: 'multiple_choice',
            options: [
              'Imparare le basi',
              'Diventare esperti', 
              'Completare il corso',
              'Superare l\'esame'
            ],
            correct_answer: 0,
            explanation: 'L\'obiettivo è imparare le basi fondamentali del tema trattato.'
          },
          {
            id: 'q2',
            question: 'Quanto tempo dovresti dedicare allo studio di questo argomento?',
            type: 'multiple_choice',
            options: [
              '5 minuti',
              '15-30 minuti',
              '1 ora', 
              'Tutto il giorno'
            ],
            correct_answer: 1,
            explanation: '15-30 minuti è il tempo ideale per assimilare i concetti di base.'
          },
          {
            id: 'q3',
            question: 'È importante praticare quello che si impara?',
            type: 'true_false',
            options: ['Vero', 'Falso'],
            correct_answer: 0,
            explanation: 'La pratica è fondamentale per consolidare l\'apprendimento.'
          }
        ],
        passing_score: 70,
        max_attempts: 3,
        time_limit: 10
      }
    ];

    // Aggiungi quiz per le altre lezioni se esistono
    if (lessons.length > 1) {
      sampleQuizzes.push({
        lesson_id: lessons[1].id,
        title: 'Quiz di Verifica - Concetti Avanzati',
        description: 'Verifica la tua comprensione dei concetti più avanzati.',
        questions: [
          {
            id: 'q1',
            question: 'Quale delle seguenti affermazioni è corretta?',
            type: 'multiple_choice',
            options: [
              'Tutti i concetti sono facili',
              'Alcuni concetti richiedono più attenzione',
              'Non serve studiare',
              'Tutto è opzionale'
            ],
            correct_answer: 1,
            explanation: 'Alcuni concetti sono più complessi e richiedono maggiore attenzione.'
          },
          {
            id: 'q2',
            question: 'La pratica costante migliora l\'apprendimento?',
            type: 'true_false',
            options: ['Vero', 'Falso'],
            correct_answer: 0,
            explanation: 'La pratica costante è la chiave per un apprendimento efficace.'
          }
        ],
        passing_score: 80,
        max_attempts: 2,
        time_limit: 15
      });
    }

    // 5. Inserisci i quiz
    const { data: insertedQuizzes, error: insertError } = await supabase
      .from('quizzes')
      .insert(sampleQuizzes)
      .select();

    if (insertError) {
      console.error('❌ Errore nell\'inserimento dei quiz:', insertError);
      return;
    }

    console.log('✅ Quiz creati con successo!');
    console.log('📝 Quiz inseriti:');
    insertedQuizzes.forEach(quiz => {
      const lesson = lessons.find(l => l.id === quiz.lesson_id);
      console.log(`   - ${quiz.title} (Lezione ${lesson?.order}: ${lesson?.title})`);
    });

    console.log('\n🎉 Setup completato! Ora puoi testare i quiz nelle lezioni.');

  } catch (error) {
    console.error('❌ Errore durante il setup:', error);
  }
}

// Esegui il setup
setupQuizzes();
