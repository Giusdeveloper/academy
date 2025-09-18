-- Inserimento manuale di un quiz di test
-- Esegui questo SQL nel Supabase SQL Editor dopo aver eseguito fix_quiz_policies.sql

-- Prima trova l'ID della prima lezione
-- (Sostituisci questo con l'ID reale della tua prima lezione)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz di Verifica - Introduzione',
  'Testa le tue conoscenze sui concetti fondamentali appresi in questa lezione.',
  '[
    {
      "id": "q1",
      "question": "Qual è l''obiettivo principale di questa lezione?",
      "type": "multiple_choice",
      "options": [
        "Imparare le basi",
        "Diventare esperti",
        "Completare il corso",
        "Superare l''esame"
      ],
      "correct_answer": 0,
      "explanation": "L''obiettivo è imparare le basi fondamentali del tema trattato."
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
      "explanation": "La pratica è fondamentale per consolidare l''apprendimento."
    }
  ]'::jsonb,
  70,
  3,
  10
FROM lessons l 
WHERE l."order" = 1 
LIMIT 1;

-- Verifica che il quiz sia stato inserito
SELECT q.id, q.title, q.lesson_id, l.title as lesson_title, l."order" as lesson_order
FROM quizzes q
JOIN lessons l ON l.id = q.lesson_id
ORDER BY l."order";
