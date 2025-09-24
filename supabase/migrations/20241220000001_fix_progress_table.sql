-- =============================================================================
-- MIGRAZIONE: CORREZIONE TABELLA PROGRESS
-- Data: 2024-12-20
-- Scopo: Correggere la struttura della tabella progress per risolvere errori 406/409
-- =============================================================================

-- 1. VERIFICA STRUTTURA ATTUALE
-- =============================================================================
-- Prima verifichiamo la struttura attuale
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'progress' 
ORDER BY ordinal_position;

-- 2. AGGIUNGI COLONNE MANCANTI
-- =============================================================================
-- Aggiungi tutte le colonne necessarie con valori di default appropriati
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS video_watched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS video_watched_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS time_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 3. AGGIORNA VINCOLI E INDICI
-- =============================================================================

-- Rimuovi vincoli esistenti se ci sono conflitti
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_completion_logic;
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_unique_user_course_lesson;

-- Aggiungi vincolo di unicità per (user_id, course_id, lesson_id)
ALTER TABLE progress 
ADD CONSTRAINT progress_unique_user_course_lesson 
UNIQUE (user_id, course_id, lesson_id);

-- Aggiungi vincolo per garantire integrità logica
ALTER TABLE progress 
ADD CONSTRAINT progress_completion_logic 
CHECK (
  (completed = false) OR 
  (completed = true AND (
    video_watched = true OR 
    quiz_completed = true
  ))
);

-- 4. AGGIORNA INDICI PER PERFORMANCE
-- =============================================================================

-- Rimuovi indici esistenti se ci sono conflitti
DROP INDEX IF EXISTS idx_progress_user_course;
DROP INDEX IF EXISTS idx_progress_user_lesson;
DROP INDEX IF EXISTS idx_progress_unique_user_course_lesson;

-- Crea indici ottimizzati
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_lesson ON progress(course_id, lesson_id);

-- 5. AGGIORNA RLS POLICIES
-- =============================================================================

-- Rimuovi policies esistenti se ci sono conflitti
DROP POLICY IF EXISTS "Users can view their own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON progress;

-- Crea policies aggiornate
CREATE POLICY "Users can view their own progress" ON progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. VERIFICA FINALE
-- =============================================================================

-- Verifica che tutte le colonne siano state aggiunte
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'progress' 
ORDER BY ordinal_position;

-- Mostra un esempio di record per verificare la struttura
SELECT * FROM progress LIMIT 1;

-- Verifica che i vincoli siano attivi
SELECT conname, contype, consrc 
FROM pg_constraint 
WHERE conrelid = 'progress'::regclass;

-- Verifica che gli indici siano stati creati
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'progress';

-- Verifica che le policies siano attive
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'progress';
