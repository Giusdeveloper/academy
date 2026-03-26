-- =============================================================================
-- MIGRAZIONE: CREAZIONE TABELLA SYSTEM_ERRORS
-- Data: 2026-03-25
-- Scopo: Tracciare errori tecnici della piattaforma per monitoraggio n8n
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.system_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    stack TEXT,
    url TEXT,
    user_id UUID, -- Riferimento opzionale all'utente
    user_email TEXT,
    severity TEXT DEFAULT 'error' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    metadata JSONB DEFAULT '{}'::jsonb,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Abilita RLS
ALTER TABLE public.system_errors ENABLE ROW LEVEL SECURITY;

-- Policy per permettere l'inserimento degli errori dal client
CREATE POLICY "Allow anonymous insert of system errors" ON public.system_errors
    FOR INSERT WITH CHECK (true);

-- Policy per permettere solo agli admin di vedere gli errori
CREATE POLICY "Only admins can view system errors" ON public.system_errors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = auth.uid() AND users.role = 'ADMIN'
        )
    );

-- Indice per performance su errori non risolti (quelli che interessano a n8n)
CREATE INDEX IF NOT EXISTS idx_system_errors_unresolved ON public.system_errors(created_at DESC) WHERE resolved = false;
