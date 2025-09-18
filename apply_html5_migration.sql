-- Migrazione per supporto video HTML5
-- Esegui questo script nel SQL Editor di Supabase

-- Aggiungi i nuovi campi
ALTER TABLE materials ADD COLUMN IF NOT EXISTS video_type VARCHAR(20) DEFAULT 'iframe';
ALTER TABLE materials ADD COLUMN IF NOT EXISTS html5_url VARCHAR(500);

-- Aggiorna i materiali esistenti
UPDATE materials 
SET video_type = 'iframe' 
WHERE type = 'video' AND video_type IS NULL;

-- Crea gli indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_materials_video_type ON materials(video_type);
CREATE INDEX IF NOT EXISTS idx_materials_html5_url ON materials(html5_url);

-- Commenti per documentare i nuovi campi
COMMENT ON COLUMN materials.video_type IS 'Tipo di video: iframe (YouTube/Vimeo) o html5 (file locale)';
COMMENT ON COLUMN materials.html5_url IS 'URL del video HTML5 locale (es: /videos/lesson_1.mp4)';

-- Mostra i materiali video esistenti per riferimento
SELECT id, title, type, video_type, html5_url 
FROM materials 
WHERE type = 'video' 
LIMIT 5;
