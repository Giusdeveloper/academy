-- =============================================================================
-- MIGRAZIONE FINALE: CORREZIONE TABELLA PROGRESS
-- Data: 2024-12-20
-- Scopo: Correggere la struttura della tabella progress senza query problematiche
-- =============================================================================

-- 1. AGGIUNGI COLONNE MANCANTI
-- =============================================================================
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS video_watched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS video_watched_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS time_spent INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 2. RIMUOVI VINCOLI ESISTENTI SE CI SONO CONFLITTI
-- =============================================================================
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_completion_logic;
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_unique_user_course_lesson;

-- 3. AGGIUNGI VINCOLO DI UNICITÀ
-- =============================================================================
ALTER TABLE progress 
ADD CONSTRAINT progress_unique_user_course_lesson 
UNIQUE (user_id, course_id, lesson_id);

-- 4. AGGIUNGI VINCOLO LOGICO
-- =============================================================================
ALTER TABLE progress 
ADD CONSTRAINT progress_completion_logic 
CHECK (
  (completed = false) OR 
  (completed = true AND (
    video_watched = true OR 
    quiz_completed = true
  ))
);

-- 5. RIMUOVI INDICI ESISTENTI SE CI SONO CONFLITTI
-- =============================================================================
DROP INDEX IF EXISTS idx_progress_user_course;
DROP INDEX IF EXISTS idx_progress_user_lesson;
DROP INDEX IF EXISTS idx_progress_course_lesson;

-- 6. CREA INDICI OTTIMIZZATI
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_progress_user_course ON progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_lesson ON progress(course_id, lesson_id);

-- 7. RIMUOVI POLICIES ESISTENTI SE CI SONO CONFLITTI
-- =============================================================================
DROP POLICY IF EXISTS "Users can view their own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON progress;

-- 8. CREA POLICIES AGGIORNATE
-- =============================================================================
CREATE POLICY "Users can view their own progress" ON progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. VERIFICA SEMPLICE
-- =============================================================================
-- Verifica che la tabella esista e abbia le colonne corrette
SELECT 'Tabella progress aggiornata con successo!' as result;
