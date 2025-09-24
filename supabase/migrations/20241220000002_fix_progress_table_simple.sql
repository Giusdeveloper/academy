-- =============================================================================
-- MIGRAZIONE SEMPLIFICATA: CORREZIONE TABELLA PROGRESS
-- Data: 2024-12-20
-- Scopo: Correggere la struttura della tabella progress passo per passo
-- =============================================================================

-- 1. VERIFICA STRUTTURA ATTUALE
-- =============================================================================
SELECT 'VERIFICA STRUTTURA ATTUALE' as step;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'progress' 
ORDER BY ordinal_position;

-- 2. AGGIUNGI COLONNE MANCANTI
-- =============================================================================
SELECT 'AGGIUNGI COLONNE MANCANTI' as step;

ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS video_watched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS video_watched_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS time_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 3. RIMUOVI VINCOLI ESISTENTI SE CI SONO CONFLITTI
-- =============================================================================
SELECT 'RIMUOVI VINCOLI ESISTENTI' as step;

ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_completion_logic;
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_unique_user_course_lesson;

-- 4. AGGIUNGI VINCOLO DI UNICITÀ
-- =============================================================================
SELECT 'AGGIUNGI VINCOLO DI UNICITÀ' as step;

ALTER TABLE progress 
ADD CONSTRAINT progress_unique_user_course_lesson 
UNIQUE (user_id, course_id, lesson_id);

-- 5. AGGIUNGI VINCOLO LOGICO
-- =============================================================================
SELECT 'AGGIUNGI VINCOLO LOGICO' as step;

ALTER TABLE progress 
ADD CONSTRAINT progress_completion_logic 
CHECK (
  (completed = false) OR 
  (completed = true AND (
    video_watched = true OR 
    quiz_completed = true
  ))
);

-- 6. RIMUOVI INDICI ESISTENTI SE CI SONO CONFLITTI
-- =============================================================================
SELECT 'RIMUOVI INDICI ESISTENTI' as step;

DROP INDEX IF EXISTS idx_progress_user_course;
DROP INDEX IF EXISTS idx_progress_user_lesson;
DROP INDEX IF EXISTS idx_progress_course_lesson;

-- 7. CREA INDICI OTTIMIZZATI
-- =============================================================================
SELECT 'CREA INDICI OTTIMIZZATI' as step;

CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_lesson ON progress(course_id, lesson_id);

-- 8. RIMUOVI POLICIES ESISTENTI SE CI SONO CONFLITTI
-- =============================================================================
SELECT 'RIMUOVI POLICIES ESISTENTI' as step;

DROP POLICY IF EXISTS "Users can view their own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON progress;

-- 9. CREA POLICIES AGGIORNATE
-- =============================================================================
SELECT 'CREA POLICIES AGGIORNATE' as step;

CREATE POLICY "Users can view their own progress" ON progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 10. VERIFICA FINALE
-- =============================================================================
SELECT 'VERIFICA FINALE' as step;

-- Verifica che tutte le colonne siano state aggiunte
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'progress' 
ORDER BY ordinal_position;

-- Verifica che i vincoli siano attivi
SELECT conname, contype, pg_get_constraintdef(oid) as definition
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

SELECT 'MIGRAZIONE COMPLETATA CON SUCCESSO!' as result;
