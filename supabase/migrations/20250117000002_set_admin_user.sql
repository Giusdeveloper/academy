-- =============================================================================
-- MIGRAZIONE: IMPOSTA UTENTE COME ADMIN
-- Data: 2025-01-17
-- Scopo: Script per impostare un utente come admin tramite email
-- =============================================================================

-- IMPORTANTE: Modifica l'email qui sotto con quella dell'utente che vuoi rendere admin
-- Puoi anche eseguire questo script direttamente nel SQL Editor di Supabase

-- Esempio 1: Imposta admin tramite email
-- UPDATE public.users 
-- SET role = 'admin'
-- WHERE email = 'info@imment.it';

-- Esempio 2: Imposta admin tramite ID utente
-- UPDATE public.users 
-- SET role = 'admin'
-- WHERE id = 'uuid-dell-utente';

-- Esempio 3: Imposta più utenti come admin (separati da virgola nella condizione OR)
-- UPDATE public.users 
-- SET role = 'admin'
-- WHERE email IN ('info@imment.it', 'alessandro.immobile@imment.it');

-- =============================================================================
-- FUNZIONE HELPER: Verifica se un utente è admin
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = user_id AND role = 'ADMIN'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- FUNZIONE HELPER: Imposta ruolo utente
-- =============================================================================

CREATE OR REPLACE FUNCTION public.set_user_role(
  user_email TEXT,
  new_role TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  normalized_role user_role;
BEGIN
  -- Normalizza il ruolo (accetta sia minuscolo che maiuscolo)
  CASE UPPER(new_role)
    WHEN 'ADMIN' THEN normalized_role := 'ADMIN'::user_role;
    WHEN 'MODERATOR' THEN normalized_role := 'MODERATOR'::user_role;
    WHEN 'USER' THEN normalized_role := 'USER'::user_role;
    ELSE
      RAISE EXCEPTION 'Ruolo non valido. Valori accettati: USER, ADMIN, MODERATOR';
  END CASE;

  -- Aggiorna il ruolo
  UPDATE public.users 
  SET role = normalized_role, updated_at = NOW()
  WHERE email = user_email;
  
  -- Verifica se l'aggiornamento ha avuto successo
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commenti sulle funzioni
COMMENT ON FUNCTION public.is_admin(UUID) IS 'Verifica se un utente è admin';
COMMENT ON FUNCTION public.set_user_role(TEXT, TEXT) IS 'Imposta il ruolo di un utente tramite email';

-- =============================================================================
-- ESEMPIO DI UTILIZZO DELLE FUNZIONI
-- =============================================================================

-- Verifica se un utente è admin:
-- SELECT public.is_admin('uuid-dell-utente');

-- Imposta un utente come admin:
-- SELECT public.set_user_role('info@imment.it', 'admin');

-- Imposta un utente come user normale:
-- SELECT public.set_user_role('info@imment.it', 'user');

