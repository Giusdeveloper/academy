-- =============================================================================
-- AGGIUNTA CAMPO last_name ALLA TABELLA users
-- =============================================================================

-- Aggiungi il campo last_name alla tabella users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Commento per documentazione
COMMENT ON COLUMN public.users.last_name IS 'Cognome dell''utente';

