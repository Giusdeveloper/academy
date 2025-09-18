-- Fix per le policy dei quiz
-- Esegui questo SQL nel Supabase SQL Editor per permettere l'inserimento dei quiz

-- Rimuovi le policy esistenti se esistono
DROP POLICY IF EXISTS "Anyone can view quizzes" ON quizzes;
DROP POLICY IF EXISTS "Allow quiz insertion" ON quizzes;

-- Ricrea le policy corrette
CREATE POLICY "Anyone can view quizzes" ON quizzes
  FOR SELECT USING (true);

CREATE POLICY "Allow quiz insertion" ON quizzes
  FOR INSERT WITH CHECK (true);

-- Verifica che le policy siano state create
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'quizzes';
