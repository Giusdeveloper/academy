-- =============================================================================
-- TRIGGER PER SINCRONIZZARE auth.users CON public.users
-- =============================================================================
-- Questo trigger sincronizza automaticamente i dati quando un utente viene
-- creato o aggiornato in auth.users, copiando name, email e altri dati nella
-- tabella pubblica users.

-- Funzione per gestire la sincronizzazione quando un utente viene creato
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    name,
    last_name,
    email_verified,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NULL),
    NEW.email_confirmed_at,
    COALESCE(NEW.created_at, NOW()),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    email_verified = EXCLUDED.email_verified,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Funzione per gestire la sincronizzazione quando un utente viene aggiornato
CREATE OR REPLACE FUNCTION public.handle_updated_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = COALESCE(NEW.raw_user_meta_data->>'name', public.users.name),
    last_name = COALESCE(NEW.raw_user_meta_data->>'last_name', public.users.last_name),
    email_verified = NEW.email_confirmed_at,
    updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger per la creazione di nuovi utenti
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger per l'aggiornamento di utenti esistenti
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (
    OLD.email IS DISTINCT FROM NEW.email OR
    OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data OR
    OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at
  )
  EXECUTE FUNCTION public.handle_updated_user();

-- Sincronizza gli utenti esistenti (se ce ne sono già)
INSERT INTO public.users (
  id,
  email,
  name,
  last_name,
  email_verified,
  created_at,
  updated_at
)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', NULL) as name,
  COALESCE(au.raw_user_meta_data->>'last_name', NULL) as last_name,
  au.email_confirmed_at as email_verified,
  COALESCE(au.created_at, NOW()) as created_at,
  NOW() as updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = COALESCE(EXCLUDED.name, public.users.name),
  last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
  email_verified = EXCLUDED.email_verified,
  updated_at = NOW();

