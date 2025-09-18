-- Aggiungi supporto per video HTML5
ALTER TABLE materials ADD COLUMN IF NOT EXISTS video_type VARCHAR(20) DEFAULT 'iframe';
ALTER TABLE materials ADD COLUMN IF NOT EXISTS html5_url VARCHAR(500);

-- Aggiorna i materiali esistenti per specificare il tipo
UPDATE materials 
SET video_type = 'iframe' 
WHERE type = 'video' AND video_type IS NULL;

-- Crea un indice per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_materials_video_type ON materials(video_type);
CREATE INDEX IF NOT EXISTS idx_materials_html5_url ON materials(html5_url);

-- Commenti per documentare i nuovi campi
COMMENT ON COLUMN materials.video_type IS 'Tipo di video: iframe (YouTube/Vimeo) o html5 (file locale)';
COMMENT ON COLUMN materials.html5_url IS 'URL del video HTML5 locale (es: /videos/lesson_1.mp4)';
