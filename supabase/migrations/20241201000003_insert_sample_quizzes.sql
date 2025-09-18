-- Inserimento di quiz di esempio per le lezioni

-- Quiz per la prima lezione (se esiste)
INSERT INTO quizzes (id, lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  l.id,
  'Quiz di Verifica - Introduzione',
  'Testa le tue conoscenze sui concetti fondamentali appresi in questa lezione.',
  '[
    {
      "id": "q1",
      "question": "Qual è l\'obiettivo principale di questa lezione?",
      "type": "multiple_choice",
      "options": [
        "Imparare le basi",
        "Diventare esperti",
        "Completare il corso",
        "Superare l\'esame"
      ],
      "correct_answer": 0,
      "explanation": "L\'obiettivo è imparare le basi fondamentali del tema trattato."
    },
    {
      "id": "q2", 
      "question": "Quanto tempo dovresti dedicare allo studio di questo argomento?",
      "type": "multiple_choice",
      "options": [
        "5 minuti",
        "15-30 minuti", 
        "1 ora",
        "Tutto il giorno"
      ],
      "correct_answer": 1,
      "explanation": "15-30 minuti è il tempo ideale per assimilare i concetti di base."
    },
    {
      "id": "q3",
      "question": "È importante praticare quello che si impara?",
      "type": "true_false",
      "options": ["Vero", "Falso"],
      "correct_answer": 0,
      "explanation": "La pratica è fondamentale per consolidare l\'apprendimento."
    }
  ]'::jsonb,
  70,
  3,
  10
FROM lessons l 
WHERE l."order" = 1 
LIMIT 1;

-- Quiz per la seconda lezione (se esiste)
INSERT INTO quizzes (id, lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  l.id,
  'Quiz di Verifica - Concetti Avanzati',
  'Verifica la tua comprensione dei concetti più avanzati.',
  '[
    {
      "id": "q1",
      "question": "Quale delle seguenti affermazioni è corretta?",
      "type": "multiple_choice",
      "options": [
        "Tutti i concetti sono facili",
        "Alcuni concetti richiedono più attenzione",
        "Non serve studiare",
        "Tutto è opzionale"
      ],
      "correct_answer": 1,
      "explanation": "Alcuni concetti sono più complessi e richiedono maggiore attenzione."
    },
    {
      "id": "q2",
      "question": "La pratica costante migliora l\'apprendimento?",
      "type": "true_false", 
      "options": ["Vero", "Falso"],
      "correct_answer": 0,
      "explanation": "La pratica costante è la chiave per un apprendimento efficace."
    }
  ]'::jsonb,
  80,
  2,
  15
FROM lessons l 
WHERE l."order" = 2 
LIMIT 1;

-- Quiz per la terza lezione (se esiste)
INSERT INTO quizzes (id, lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  l.id,
  'Quiz Finale - Consolidamento',
  'Test finale per verificare la padronanza dell\'argomento.',
  '[
    {
      "id": "q1",
      "question": "Qual è il passo successivo dopo aver completato questa lezione?",
      "type": "multiple_choice",
      "options": [
        "Ripetere tutto da capo",
        "Passare alla lezione successiva",
        "Fermarsi qui",
        "Cambiare corso"
      ],
      "correct_answer": 1,
      "explanation": "Dopo aver completato una lezione, il passo logico è passare alla successiva."
    },
    {
      "id": "q2",
      "question": "Hai compreso i concetti principali di questa lezione?",
      "type": "true_false",
      "options": ["Sì", "No"],
      "correct_answer": 0,
      "explanation": "Se hai seguito attentamente, dovresti aver compreso i concetti principali."
    },
    {
      "id": "q3",
      "question": "Quanto tempo hai impiegato per completare questa lezione?",
      "type": "multiple_choice",
      "options": [
        "Meno di 10 minuti",
        "10-20 minuti",
        "20-30 minuti", 
        "Più di 30 minuti"
      ],
      "correct_answer": 2,
      "explanation": "20-30 minuti è un tempo ragionevole per assimilare i contenuti."
    }
  ]'::jsonb,
  75,
  3,
  20
FROM lessons l 
WHERE l."order" = 3 
LIMIT 1;
