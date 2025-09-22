-- =============================================================================
-- MIGRAZIONE: MIGLIORAMENTO STRUTTURA DATABASE
-- Data: 2024-12-15
-- Scopo: Migliorare la struttura del database per tracking più robusto e scalabile
-- =============================================================================

-- 1. MIGLIORAMENTO TABELLA PROGRESS
-- =============================================================================

-- Aggiungi colonne mancanti con valori di default appropriati
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS video_watched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS video_watched_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS quiz_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS time_spent INTEGER DEFAULT 0, -- Tempo in secondi
ADD COLUMN IF NOT EXISTS last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Aggiungi vincoli per garantire integrità
ALTER TABLE progress 
ADD CONSTRAINT progress_completion_logic 
CHECK (
  (completed = false) OR 
  (completed = true AND (
    video_watched = true OR 
    quiz_completed = true
  ))
);

-- 2. NUOVA TABELLA: LESSON_SESSIONS
-- =============================================================================
-- Per tracciare sessioni dettagliate degli utenti

CREATE TABLE IF NOT EXISTS lesson_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Dettagli sessione
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_end TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0, -- Tempo in secondi
  video_time_watched INTEGER DEFAULT 0, -- Tempo video guardato in secondi
  
  -- Stato della sessione
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  
  -- Metadata
  user_agent TEXT,
  ip_address INET,
  device_type VARCHAR(50), -- mobile, desktop, tablet
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. NUOVA TABELLA: VIDEO_WATCH_EVENTS
-- =============================================================================
-- Per tracciare eventi dettagliati della visione video

CREATE TABLE IF NOT EXISTS video_watch_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  session_id UUID REFERENCES lesson_sessions(id) ON DELETE CASCADE,
  
  -- Eventi video
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
    'play', 'pause', 'seek', 'ended', 'time_update', 'error'
  )),
  current_time DECIMAL(10,2) NOT NULL, -- Tempo corrente in secondi
  duration DECIMAL(10,2), -- Durata totale del video
  progress_percentage DECIMAL(5,2), -- Percentuale di completamento
  
  -- Metadata
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  ip_address INET
);

-- 4. MIGLIORAMENTO TABELLA QUIZ_ATTEMPTS
-- =============================================================================

-- Aggiungi colonne per tracking più dettagliato
ALTER TABLE quiz_attempts 
ADD COLUMN IF NOT EXISTS time_spent INTEGER, -- Tempo impiegato in secondi
ADD COLUMN IF NOT EXISTS started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES lesson_sessions(id);

-- Migliora il vincolo per il punteggio
ALTER TABLE quiz_attempts 
ADD CONSTRAINT quiz_attempts_score_check 
CHECK (score >= 0 AND score <= 100);

-- 5. NUOVA TABELLA: USER_COURSE_STATS
-- =============================================================================
-- Statistiche aggregate per utente e corso

CREATE TABLE IF NOT EXISTS user_course_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  
  -- Statistiche aggregate
  total_time_spent INTEGER DEFAULT 0, -- Tempo totale in secondi
  total_lessons_completed INTEGER DEFAULT 0,
  total_quizzes_passed INTEGER DEFAULT 0,
  total_quizzes_failed INTEGER DEFAULT 0,
  average_quiz_score DECIMAL(5,2),
  
  -- Date
  first_access TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_access TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Vincolo unico per user-course
  UNIQUE(user_id, course_id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. INDICI PER PERFORMANCE
-- =============================================================================

-- Indici per progress
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_completed ON progress(course_id, completed);
CREATE INDEX IF NOT EXISTS idx_progress_video_watched ON progress(video_watched);
CREATE INDEX IF NOT EXISTS idx_progress_quiz_completed ON progress(quiz_completed);

-- Indici per lesson_sessions
CREATE INDEX IF NOT EXISTS idx_lesson_sessions_user_lesson ON lesson_sessions(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_sessions_course ON lesson_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_sessions_status ON lesson_sessions(status);
CREATE INDEX IF NOT EXISTS idx_lesson_sessions_start ON lesson_sessions(session_start);

-- Indici per video_watch_events
CREATE INDEX IF NOT EXISTS idx_video_events_user_lesson ON video_watch_events(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_video_events_session ON video_watch_events(session_id);
CREATE INDEX IF NOT EXISTS idx_video_events_type ON video_watch_events(event_type);
CREATE INDEX IF NOT EXISTS idx_video_events_timestamp ON video_watch_events(timestamp);

-- Indici per user_course_stats
CREATE INDEX IF NOT EXISTS idx_user_course_stats_user ON user_course_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_course_stats_course ON user_course_stats(course_id);
CREATE INDEX IF NOT EXISTS idx_user_course_stats_completed ON user_course_stats(completed_at);

-- Indici per quiz_attempts (miglioramenti)
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_session ON quiz_attempts(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_started_at ON quiz_attempts(started_at);

-- 7. TRIGGER E FUNZIONI
-- =============================================================================

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Applica trigger a tutte le tabelle
CREATE TRIGGER IF NOT EXISTS update_lesson_sessions_updated_at
  BEFORE UPDATE ON lesson_sessions
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_user_course_stats_updated_at
  BEFORE UPDATE ON user_course_stats
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Funzione per aggiornare le statistiche utente
CREATE OR REPLACE FUNCTION update_user_course_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Aggiorna le statistiche quando cambia il progresso
  INSERT INTO user_course_stats (user_id, course_id)
  VALUES (NEW.user_id, NEW.course_id)
  ON CONFLICT (user_id, course_id) 
  DO UPDATE SET
    total_lessons_completed = (
      SELECT COUNT(*) FROM progress 
      WHERE user_id = NEW.user_id 
      AND course_id = NEW.course_id 
      AND completed = true
    ),
    last_access = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger per aggiornare statistiche quando cambia il progresso
CREATE TRIGGER IF NOT EXISTS trigger_update_user_course_stats
  AFTER INSERT OR UPDATE ON progress
  FOR EACH ROW
  EXECUTE PROCEDURE update_user_course_stats();

-- 8. RLS POLICIES
-- =============================================================================

-- Abilita RLS per le nuove tabelle
ALTER TABLE lesson_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_watch_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_stats ENABLE ROW LEVEL SECURITY;

-- Policies per lesson_sessions
CREATE POLICY "Users can view their own lesson sessions" ON lesson_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson sessions" ON lesson_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson sessions" ON lesson_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies per video_watch_events
CREATE POLICY "Users can view their own video events" ON video_watch_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own video events" ON video_watch_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies per user_course_stats
CREATE POLICY "Users can view their own course stats" ON user_course_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own course stats" ON user_course_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- 9. VISTE UTILI
-- =============================================================================

-- Vista per progresso dettagliato dell'utente
CREATE OR REPLACE VIEW user_lesson_progress AS
SELECT 
  p.user_id,
  p.course_id,
  p.lesson_id,
  l.title as lesson_title,
  l."order" as lesson_order,
  c.title as course_title,
  p.video_watched,
  p.quiz_completed,
  p.completed,
  p.completed_at,
  p.video_watched_at,
  p.quiz_completed_at,
  p.time_spent,
  p.last_accessed_at,
  q.id as quiz_id,
  q.title as quiz_title,
  q.passing_score,
  -- Statistiche quiz
  (SELECT COUNT(*) FROM quiz_attempts qa WHERE qa.lesson_id = p.lesson_id AND qa.user_id = p.user_id) as quiz_attempts_count,
  (SELECT MAX(score) FROM quiz_attempts qa WHERE qa.lesson_id = p.lesson_id AND qa.user_id = p.user_id AND qa.passed = true) as best_quiz_score
FROM progress p
JOIN lessons l ON p.lesson_id = l.id
JOIN courses c ON p.course_id = c.id
LEFT JOIN quizzes q ON q.lesson_id = l.id;

-- Vista per statistiche corso
CREATE OR REPLACE VIEW course_completion_stats AS
SELECT 
  c.id as course_id,
  c.title as course_title,
  COUNT(DISTINCT l.id) as total_lessons,
  COUNT(DISTINCT p.lesson_id) as lessons_with_progress,
  COUNT(DISTINCT CASE WHEN p.completed = true THEN p.lesson_id END) as completed_lessons,
  COUNT(DISTINCT p.user_id) as enrolled_users,
  COUNT(DISTINCT CASE WHEN p.completed = true THEN p.user_id END) as completed_users,
  ROUND(
    COUNT(DISTINCT CASE WHEN p.completed = true THEN p.user_id END)::decimal / 
    NULLIF(COUNT(DISTINCT p.user_id), 0) * 100, 2
  ) as completion_rate
FROM courses c
LEFT JOIN lessons l ON c.id = l.course_id
LEFT JOIN progress p ON l.id = p.lesson_id
GROUP BY c.id, c.title;

-- 10. COMMENTI E DOCUMENTAZIONE
-- =============================================================================

COMMENT ON TABLE lesson_sessions IS 'Traccia sessioni dettagliate degli utenti per ogni lezione';
COMMENT ON TABLE video_watch_events IS 'Traccia eventi dettagliati della visione video';
COMMENT ON TABLE user_course_stats IS 'Statistiche aggregate per utente e corso';

COMMENT ON COLUMN progress.video_watched_at IS 'Timestamp quando il video è stato completato';
COMMENT ON COLUMN progress.quiz_completed_at IS 'Timestamp quando il quiz è stato completato';
COMMENT ON COLUMN progress.time_spent IS 'Tempo totale speso sulla lezione in secondi';
COMMENT ON COLUMN progress.last_accessed_at IS 'Ultima volta che l''utente ha acceduto alla lezione';

COMMENT ON COLUMN lesson_sessions.time_spent IS 'Tempo totale della sessione in secondi';
COMMENT ON COLUMN lesson_sessions.video_time_watched IS 'Tempo video effettivamente guardato in secondi';

COMMENT ON COLUMN video_watch_events.current_time IS 'Tempo corrente del video in secondi';
COMMENT ON COLUMN video_watch_events.progress_percentage IS 'Percentuale di completamento del video';

-- =============================================================================
-- FINE MIGRAZIONE
-- =============================================================================
