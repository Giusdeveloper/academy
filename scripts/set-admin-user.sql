-- =============================================================================
-- SCRIPT: IMPOSTA UTENTE COME ADMIN
-- =============================================================================
-- 
-- ISTRUZIONI:
-- 1. Apri il SQL Editor in Supabase Dashboard
-- 2. Copia e incolla questo script
-- 3. Modifica l'email nella riga UPDATE con quella dell'utente che vuoi rendere admin
-- 4. Esegui lo script
--
-- =============================================================================

-- Opzione 1: Imposta admin tramite EMAIL (consigliato)
-- Sostituisci 'info@imment.it' con l'email dell'utente che vuoi rendere admin
UPDATE public.users 
SET role = 'ADMIN'::user_role, updated_at = NOW()
WHERE email = 'admin@imment.it';

-- Verifica che l'aggiornamento sia andato a buon fine
SELECT 
  id,
  email,
  name,
  role,
  updated_at
FROM public.users 
WHERE email = 'admin@imment.it';

-- =============================================================================
-- Opzione 2: Imposta admin tramite ID UTENTE
-- =============================================================================
-- Se conosci l'ID dell'utente, puoi usare questo invece:
--
-- UPDATE public.users 
-- SET role = 'admin', updated_at = NOW()
-- WHERE id = 'uuid-dell-utente-qui';
--
-- SELECT 
--   id,
--   email,
--   name,
--   role,
--   updated_at
-- FROM public.users 
-- WHERE id = 'uuid-dell-utente-qui';

-- =============================================================================
-- Opzione 3: Imposta più utenti come admin
-- =============================================================================
-- Per impostare più utenti contemporaneamente:
--
-- UPDATE public.users 
-- SET role = 'admin', updated_at = NOW()
-- WHERE email IN ('info@imment.it', 'alessandro.immobile@imment.it');
--
-- SELECT 
--   id,
--   email,
--   name,
--   role,
--   updated_at
-- FROM public.users 
-- WHERE email IN ('info@imment.it', 'alessandro.immobile@imment.it');

-- =============================================================================
-- Opzione 4: Usa la funzione helper (se la migration è stata eseguita)
-- =============================================================================
-- SELECT public.set_user_role('info@imment.it', 'admin');

