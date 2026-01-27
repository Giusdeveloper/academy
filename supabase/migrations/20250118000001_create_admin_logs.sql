-- =============================================================================
-- MIGRAZIONE: CREAZIONE TABELLA ADMIN_LOGS
-- Data: 2025-01-18
-- Scopo: Tracciare tutte le azioni amministrative per audit e sicurezza
-- =============================================================================

-- Crea enum per i tipi di azione
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_action_type') THEN
    CREATE TYPE admin_action_type AS ENUM (
      'CREATE',
      'UPDATE',
      'DELETE',
      'ACTIVATE',
      'DEACTIVATE',
      'TOGGLE_FEATURED',
      'TOGGLE_PREMIUM',
      'RESET_PROGRESS',
      'CHANGE_ROLE',
      'BULK_ACTION',
      'EXPORT',
      'OTHER'
    );
  END IF;
END $$;

-- Crea enum per le entità
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_entity_type') THEN
    CREATE TYPE admin_entity_type AS ENUM (
      'EVENT',
      'RESOURCE',
      'COURSE',
      'USER',
      'STARTUP_AWARD',
      'LESSON',
      'ORDER',
      'SYSTEM',
      'OTHER'
    );
  END IF;
END $$;

-- Crea tabella admin_logs
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Chi ha eseguito l'azione
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  admin_name TEXT,
  
  -- Cosa è stato fatto
  action_type admin_action_type NOT NULL,
  entity_type admin_entity_type NOT NULL,
  entity_id UUID, -- ID dell'entità modificata (può essere NULL per azioni bulk)
  
  -- Dettagli dell'azione
  description TEXT NOT NULL, -- Descrizione leggibile dell'azione
  details JSONB, -- Dettagli aggiuntivi in formato JSON (valori vecchi/nuovi, filtri, ecc.)
  
  -- Metadata
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indici per migliorare le performance delle query
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type ON public.admin_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_type ON public.admin_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_id ON public.admin_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_email ON public.admin_logs(admin_email);

-- Indice composito per query comuni
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_lookup ON public.admin_logs(entity_type, entity_id);

-- Commenti
COMMENT ON TABLE public.admin_logs IS 'Log di tutte le azioni amministrative per audit e sicurezza';
COMMENT ON COLUMN public.admin_logs.details IS 'Dettagli aggiuntivi in formato JSON (valori vecchi/nuovi, filtri bulk, ecc.)';
COMMENT ON COLUMN public.admin_logs.entity_id IS 'ID dell''entità modificata (NULL per azioni bulk o su più entità)';

-- Funzione per pulire log vecchi (opzionale, può essere eseguita manualmente)
CREATE OR REPLACE FUNCTION public.cleanup_old_admin_logs(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.admin_logs
  WHERE created_at < CURRENT_TIMESTAMP - (days_to_keep || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.cleanup_old_admin_logs IS 'Rimuove log più vecchi di N giorni (default: 90)';

