-- Creazione tabella pagamenti
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(255) UNIQUE NOT NULL,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    amount INTEGER NOT NULL, -- Importo in centesimi
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    order_id VARCHAR(255) UNIQUE NOT NULL,
    revolut_payment_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creazione tabella iscrizioni
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    payment_id VARCHAR(255) REFERENCES payments(revolut_payment_id),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, user_email)
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_payments_course_id ON payments(course_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_revolut_id ON payments(revolut_payment_id);

CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_email ON enrollments(user_email);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status);

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at 
    BEFORE UPDATE ON enrollments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) per payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Policy per payments - gli utenti possono vedere solo i propri pagamenti
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy per payments - solo il sistema può inserire/aggiornare pagamenti
CREATE POLICY "System can manage payments" ON payments
    FOR ALL USING (true);

-- RLS per enrollments
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Policy per enrollments - gli utenti possono vedere solo le proprie iscrizioni
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Policy per enrollments - solo il sistema può gestire le iscrizioni
CREATE POLICY "System can manage enrollments" ON enrollments
    FOR ALL USING (true);

-- Funzione per verificare se un utente è iscritto a un corso
CREATE OR REPLACE FUNCTION is_user_enrolled(course_uuid UUID, user_email_param VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM enrollments 
        WHERE course_id = course_uuid 
        AND user_email = user_email_param 
        AND status = 'ACTIVE'
    );
END;
$$ LANGUAGE plpgsql;

-- Funzione per ottenere le iscrizioni di un utente
CREATE OR REPLACE FUNCTION get_user_enrollments(user_email_param VARCHAR)
RETURNS TABLE (
    course_id UUID,
    course_title VARCHAR,
    enrolled_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.course_id,
        c.title as course_title,
        e.enrolled_at,
        e.status
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_email = user_email_param
    AND e.status = 'ACTIVE'
    ORDER BY e.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql;
