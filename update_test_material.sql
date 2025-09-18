-- Aggiorna un materiale di test per usare il video HTML5
-- Sostituisci [ID_MATERIALE] con l'ID del materiale che vuoi aggiornare

-- Prima, vedi tutti i materiali video disponibili
SELECT id, title, type, url, lesson_id 
FROM materials 
WHERE type = 'video' 
ORDER BY id;

-- Poi aggiorna il materiale che vuoi testare (sostituisci l'ID)
UPDATE materials 
SET 
  video_type = 'html5',
  html5_url = '/videos/La seconda rivoluzione digitale.mp4'
WHERE id = [ID_MATERIALE]; -- Sostituisci con l'ID reale

-- Verifica l'aggiornamento
SELECT id, title, type, video_type, html5_url, url 
FROM materials 
WHERE id = [ID_MATERIALE]; -- Sostituisci con l'ID reale
