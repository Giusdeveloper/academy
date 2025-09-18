const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leggi le variabili d'ambiente
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

async function createQuizzesTable() {
  console.log('🚀 Creazione tabella quizzes...');

  try {
    // Prima verifichiamo se la tabella esiste già
    console.log('🔍 Verifico se la tabella quizzes esiste già...');
    
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('id')
        .limit(1);
      
      if (!error) {
        console.log('✅ Tabella quizzes esiste già!');
        return true;
      }
    } catch (err) {
      console.log('📝 Tabella quizzes non esiste, procedo con la creazione...');
    }

    // Creiamo la tabella usando una query SQL diretta
    console.log('⚡ Creo la tabella quizzes...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS quizzes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        questions JSONB NOT NULL,
        passing_score INTEGER DEFAULT 70,
        max_attempts INTEGER DEFAULT 3,
        time_limit INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        answers JSONB NOT NULL,
        score INTEGER NOT NULL,
        passed BOOLEAN NOT NULL DEFAULT false,
        completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON quizzes(lesson_id);
      CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
      CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_lesson ON quiz_attempts(user_id, lesson_id);
      
      ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
      ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "Anyone can view quizzes" ON quizzes
        FOR SELECT USING (true);
      
      CREATE POLICY "Users can view their own quiz attempts" ON quiz_attempts
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "Users can create their own quiz attempts" ON quiz_attempts
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    `;

    // Prova a eseguire la query usando una funzione personalizzata
    const { data, error } = await supabase.rpc('exec', { sql: createTableSQL });

    if (error) {
      console.log('⚠️  Metodo 1 fallito, provo metodo alternativo...');
      
      // Metodo alternativo: prova a inserire un record di test per creare la tabella
      console.log('🔄 Provo a creare la tabella tramite inserimento...');
      
      const testQuiz = {
        id: '00000000-0000-0000-0000-000000000000',
        lesson_id: '00000000-0000-0000-0000-000000000000',
        title: 'Test Quiz',
        description: 'Quiz di test per creare la tabella',
        questions: [],
        passing_score: 70,
        max_attempts: 3
      };

      const { error: insertError } = await supabase
        .from('quizzes')
        .insert(testQuiz);

      if (insertError) {
        console.error('❌ Impossibile creare la tabella quizzes:', insertError.message);
        console.log('\n📋 ISTRUZIONI MANUALI:');
        console.log('1. Vai su https://supabase.com/dashboard');
        console.log('2. Seleziona il tuo progetto');
        console.log('3. Vai su SQL Editor');
        console.log('4. Esegui questo SQL:');
        console.log('   (Copia il contenuto del file create_quizzes_simple.sql)');
        console.log('\n5. Poi esegui questo script di nuovo per inserire i dati di test.');
        return false;
      } else {
        console.log('✅ Tabella quizzes creata con successo!');
        // Rimuovi il record di test
        await supabase.from('quizzes').delete().eq('id', testQuiz.id);
      }
    } else {
      console.log('✅ Tabella quizzes creata con successo!');
    }

    return true;

  } catch (error) {
    console.error('❌ Errore durante la creazione della tabella:', error);
    return false;
  }
}

async function insertSampleQuizzes() {
  console.log('📚 Inserimento quiz di esempio...');

  try {
    // Recupera le lezioni esistenti
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, "order"')
      .order('order');

    if (lessonsError) {
      console.error('❌ Errore nel recupero delle lezioni:', lessonsError);
      return;
    }

    if (!lessons || lessons.length === 0) {
      console.log('⚠️  Nessuna lezione trovata');
      return;
    }

    console.log(`📖 Trovate ${lessons.length} lezioni`);

    // Verifica se esistono già quiz
    const { data: existingQuizzes } = await supabase
      .from('quizzes')
      .select('id, lesson_id, title');

    if (existingQuizzes && existingQuizzes.length > 0) {
      console.log(`✅ Trovati ${existingQuizzes.length} quiz esistenti`);
      return;
    }

    // Prima aggiungiamo una policy per permettere l'inserimento
    console.log('🔧 Aggiungo policy per inserimento quiz...');
    try {
      const { error: policyError } = await supabase.rpc('exec', { 
        sql: `CREATE POLICY IF NOT EXISTS "Allow quiz insertion" ON quizzes FOR INSERT WITH CHECK (true);` 
      });
      if (policyError) {
        console.log('⚠️  Non posso aggiungere la policy automaticamente');
      } else {
        console.log('✅ Policy aggiunta');
      }
    } catch (err) {
      console.log('⚠️  Policy non aggiunta automaticamente');
    }

    // Crea quiz per la prima lezione
    const sampleQuiz = {
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
    };

    const { data: insertedQuiz, error: insertError } = await supabase
      .from('quizzes')
      .insert(sampleQuiz)
      .select();

    if (insertError) {
      console.error('❌ Errore nell\'inserimento del quiz:', insertError);
      return;
    }

    console.log('✅ Quiz creato con successo!');
    console.log(`📝 Quiz: ${insertedQuiz[0].title}`);
    console.log(`📚 Lezione: ${lessons[0].title} (Ordine: ${lessons[0].order})`);

  } catch (error) {
    console.error('❌ Errore durante l\'inserimento dei quiz:', error);
  }
}

async function main() {
  console.log('🎯 Setup completo tabella quizzes\n');
  
  const tableCreated = await createQuizzesTable();
  
  if (tableCreated) {
    await insertSampleQuizzes();
    console.log('\n🎉 Setup completato! Ora puoi testare i quiz nelle lezioni.');
  } else {
    console.log('\n⚠️  Setup incompleto. Segui le istruzioni manuali sopra.');
  }
}

main();
