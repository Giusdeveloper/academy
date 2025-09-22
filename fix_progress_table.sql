-- Script per verificare e correggere la tabella progress
-- Esegui questo script nel database Supabase per assicurarti che tutte le colonne esistano

-- Verifica la struttura attuale della tabella progress
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'progress' 
ORDER BY ordinal_position;

-- Aggiungi le colonne mancanti se non esistono
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS quiz_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS video_watched BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Verifica che le colonne siano state aggiunte
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'progress' 
ORDER BY ordinal_position;

-- Mostra un esempio di record per verificare la struttura
SELECT * FROM progress LIMIT 1;
