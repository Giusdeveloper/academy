-- =============================================================================
-- MIGRAZIONE: TRACKING PERCORSO STARTUP AWARD
-- Data: 2025-01-01
-- Scopo: Tracciare iscrizione e completamento del corso per il percorso Startup Award
-- =============================================================================

-- Tabella per tracciare lo stato del percorso Startup Award
CREATE TABLE IF NOT EXISTS startup_award_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Fase 1: Iscrizione al corso
    phase1_enrolled_at TIMESTAMP WITH TIME ZONE,
    phase1_completed_at TIMESTAMP WITH TIME ZONE, -- Quando completa il corso
    
    -- Fase 2: Masterclass (da definire)
    phase2_enrolled_at TIMESTAMP WITH TIME ZONE,
    phase2_completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Fase 3: Workshop (da definire)
    phase3_enrolled_at TIMESTAMP WITH TIME ZONE,
    phase3_completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Stato generale
    current_phase INTEGER DEFAULT 1, -- 1, 2, o 3
    status VARCHAR(50) DEFAULT 'enrolled', -- enrolled, phase1_completed, phase2_completed, phase3_completed
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_email, course_id)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_startup_award_user_email ON startup_award_progress(user_email);
CREATE INDEX IF NOT EXISTS idx_startup_award_course_id ON startup_award_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_startup_award_status ON startup_award_progress(status);
CREATE INDEX IF NOT EXISTS idx_startup_award_current_phase ON startup_award_progress(current_phase);

-- Trigger per aggiornare updated_at
CREATE TRIGGER update_startup_award_progress_updated_at 
    BEFORE UPDATE ON startup_award_progress 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Funzione per verificare se un corso è completato
-- Usa user_id invece di email per evitare problemi di accesso a auth.users
CREATE OR REPLACE FUNCTION is_course_completed(
    course_uuid UUID,
    user_id_param UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    total_lessons INTEGER;
    completed_lessons INTEGER;
BEGIN
    -- Conta le lezioni totali del corso
    SELECT COUNT(*) INTO total_lessons
    FROM lessons
    WHERE course_id = course_uuid;
    
    -- Se non ci sono lezioni, ritorna false
    IF total_lessons = 0 THEN
        RETURN false;
    END IF;
    
    -- Conta le lezioni completate dall'utente
    SELECT COUNT(*) INTO completed_lessons
    FROM progress
    WHERE course_id = course_uuid
    AND user_id = user_id_param
    AND completed = true;
    
    -- Il corso è completato se tutte le lezioni sono completate
    RETURN completed_lessons = total_lessons;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funzione per ottenere lo stato del percorso Startup Award
CREATE OR REPLACE FUNCTION get_startup_award_status(
    user_email_param VARCHAR,
    course_uuid UUID
)
RETURNS TABLE (
    phase1_enrolled_at TIMESTAMP WITH TIME ZONE,
    phase1_completed_at TIMESTAMP WITH TIME ZONE,
    phase2_enrolled_at TIMESTAMP WITH TIME ZONE,
    phase2_completed_at TIMESTAMP WITH TIME ZONE,
    phase3_enrolled_at TIMESTAMP WITH TIME ZONE,
    phase3_completed_at TIMESTAMP WITH TIME ZONE,
    current_phase INTEGER,
    status VARCHAR,
    is_phase1_completed BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sap.phase1_enrolled_at,
        sap.phase1_completed_at,
        sap.phase2_enrolled_at,
        sap.phase2_completed_at,
        sap.phase3_enrolled_at,
        sap.phase3_completed_at,
        sap.current_phase,
        sap.status,
        (sap.phase1_completed_at IS NOT NULL) as is_phase1_completed
    FROM startup_award_progress sap
    WHERE sap.user_email = user_email_param
    AND sap.course_id = course_uuid;
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security)
ALTER TABLE startup_award_progress ENABLE ROW LEVEL SECURITY;

-- Policy: gli utenti possono vedere solo il proprio progresso
CREATE POLICY "Users can view their own startup award progress" ON startup_award_progress
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy: il sistema può gestire tutto
CREATE POLICY "System can manage startup award progress" ON startup_award_progress
    FOR ALL USING (true);

-- =============================================================================
-- FUNZIONE HELPER: Recupera user_id dall'email da auth.users
-- =============================================================================
CREATE OR REPLACE FUNCTION get_user_id_by_email(user_email_param VARCHAR(255))
RETURNS UUID AS $$
DECLARE
    user_id_result UUID;
BEGIN
    SELECT id INTO user_id_result
    FROM auth.users
    WHERE email = user_email_param
    LIMIT 1;
    
    RETURN user_id_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

