-- =============================================================================
-- FIX: MIGRAZIONE PER CORREGGERE IL TRIGGER handle_new_user
-- Data: 2025-01-27
-- Scopo: Risolvere errore "Database error saving new user" durante registrazione
-- =============================================================================

-- Assicurati che tutti i campi necessari esistano nella tabella users
DO $$ 
BEGIN
  -- Aggiungi last_name se non esiste
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'last_name'
  ) THEN
    ALTER TABLE public.users ADD COLUMN last_name TEXT;
  END IF;

  -- Aggiungi email_verified se non esiste (potrebbe essere email_verified invece di email_verified)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE public.users ADD COLUMN email_verified TIMESTAMP WITH TIME ZONE;
  END IF;

  -- Assicurati che role esista
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    -- Crea enum se non esiste
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
      CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'MODERATOR');
    END IF;
    ALTER TABLE public.users ADD COLUMN role user_role DEFAULT 'USER' NOT NULL;
  END IF;
END $$;

-- Funzione handle_new_user migliorata con gestione errori
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  BEGIN
    INSERT INTO public.users (
      id,
      email,
      name,
      last_name,
      role,
      email_verified,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', NULL),
      COALESCE(NEW.raw_user_meta_data->>'last_name', NULL),
      COALESCE(
        CASE 
          WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'ADMIN'::user_role
          WHEN NEW.raw_user_meta_data->>'role' = 'moderator' THEN 'MODERATOR'::user_role
          ELSE 'USER'::user_role
        END,
        'USER'::user_role
      ),
      NEW.email_confirmed_at,
      COALESCE(NEW.created_at, NOW()),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.users.name),
      last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
      role = COALESCE(
        CASE 
          WHEN EXCLUDED.role::text = 'ADMIN' THEN 'ADMIN'::user_role
          WHEN EXCLUDED.role::text = 'MODERATOR' THEN 'MODERATOR'::user_role
          ELSE COALESCE(public.users.role, 'USER'::user_role)
        END,
        COALESCE(public.users.role, 'USER'::user_role)
      ),
      email_verified = EXCLUDED.email_verified,
      updated_at = NOW();
    
    RETURN NEW;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log dell'errore (visibile nei log di Supabase)
      RAISE WARNING 'Errore in handle_new_user per utente %: %', NEW.id, SQLERRM;
      -- Restituisci NEW comunque per non bloccare la creazione dell'utente in auth.users
      RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ricrea il trigger per assicurarsi che sia configurato correttamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Commento per documentazione
COMMENT ON FUNCTION public.handle_new_user() IS 'Trigger function per sincronizzare nuovi utenti da auth.users a public.users. Gestisce errori senza bloccare la creazione dell''utente.';
