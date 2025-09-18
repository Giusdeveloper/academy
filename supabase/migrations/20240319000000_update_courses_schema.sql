-- Backup della tabella esistente
CREATE TABLE courses_backup AS SELECT * FROM courses;

-- Rimuoviamo le policy che dipendono dalla colonna published
DROP POLICY IF EXISTS "Anyone can view published courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view lessons of published courses" ON lessons;

-- Modifichiamo la tabella courses
ALTER TABLE courses
  -- Rimuoviamo le colonne che non ci servono più con CASCADE
  DROP COLUMN IF EXISTS published CASCADE,
  DROP COLUMN IF EXISTS author_id CASCADE,
  DROP COLUMN IF EXISTS updated_at CASCADE,
  
  -- Aggiungiamo le nuove colonne
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS level TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT,
  ADD COLUMN IF NOT EXISTS duration_hours INTEGER,
  ADD COLUMN IF NOT EXISTS ects_max INTEGER,
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Aggiorniamo i dati esistenti
UPDATE courses 
SET 
  slug = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]', '-', 'g')),
  image_url = image,
  category = 'Sviluppo Web',  -- Valore di default
  level = 'Intermedio',       -- Valore di default
  language = 'Italiano',      -- Valore di default
  duration_hours = 8,         -- Valore di default
  ects_max = 3;              -- Valore di default

-- Rimuoviamo la colonna image vecchia dato che ora usiamo image_url
ALTER TABLE courses DROP COLUMN IF EXISTS image;

-- Aggiorniamo i vincoli
ALTER TABLE courses 
  ALTER COLUMN slug SET NOT NULL;

-- Aggiorniamo gli indici
CREATE UNIQUE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);

-- Ricreiamo le policy aggiornate
CREATE POLICY "Anyone can view courses" ON courses
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view lessons" ON lessons
  FOR SELECT USING (true); 
  