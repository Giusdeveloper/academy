-- =============================================================================
-- MIGRAZIONE: AGGIUNTA CAMPO ROLE ALLA TABELLA USERS
-- Data: 2025-01-17
-- Scopo: Aggiungere sistema di ruoli per distinguere utenti normali da admin
-- =============================================================================

-- Verifica se esiste già l'enum user_role
-- Se esiste, aggiungi 'MODERATOR' se non presente
DO $$ 
BEGIN
  -- Aggiungi 'MODERATOR' all'enum se non esiste già
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'MODERATOR' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
  ) THEN
    ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'MODERATOR';
  END IF;
END $$;

-- La colonna role esiste già come enum user_role, quindi non serve aggiungerla
-- Verifica solo che esista, altrimenti la aggiungi
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'USER' NOT NULL;
  END IF;
END $$;

-- Crea indice per migliorare le query per ruolo
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Commento sulla colonna
COMMENT ON COLUMN public.users.role IS 'Ruolo utente: user (default), admin, moderator';

-- =============================================================================
-- AGGIORNA TRIGGER DI SINCRONIZZAZIONE
-- =============================================================================
-- Aggiorna la funzione handle_new_user per includere il ruolo se presente nei metadata

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    last_name,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'ADMIN'::user_role
        WHEN NEW.raw_user_meta_data->>'role' = 'moderator' THEN 'MODERATOR'::user_role
        ELSE 'USER'::user_role
      END,
      'USER'::user_role
    ),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    last_name = EXCLUDED.last_name,
    role = COALESCE(
      CASE 
        WHEN EXCLUDED.role::text = 'admin' THEN 'ADMIN'::user_role
        WHEN EXCLUDED.role::text = 'moderator' THEN 'MODERATOR'::user_role
        ELSE public.users.role
      END,
      public.users.role
    ),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aggiorna la funzione handle_updated_user per includere il ruolo
CREATE OR REPLACE FUNCTION public.handle_updated_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', public.users.name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', public.users.last_name),
    role = COALESCE(
      CASE 
        WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'ADMIN'::user_role
        WHEN NEW.raw_user_meta_data->>'role' = 'moderator' THEN 'MODERATOR'::user_role
        ELSE public.users.role
      END,
      public.users.role
    ),
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

