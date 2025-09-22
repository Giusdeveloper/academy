-- Esempio di come aggiungere un'immagine a un corso esistente
-- Usa la stessa immagine di default utilizzata nel codice

-- Aggiorna il corso "Finanziamento Aziendale" con l'immagine di default ad alta risoluzione
UPDATE courses 
SET image_url = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=450&q=90'
WHERE slug = 'finanziamento-aziendale';

-- Oppure per tutti i corsi senza immagine, aggiungi l'immagine di default ad alta risoluzione
UPDATE courses 
SET image_url = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=450&q=90'
WHERE image_url IS NULL;

-- Verifica che l'aggiornamento sia stato applicato
SELECT id, title, slug, image_url 
FROM courses 
WHERE slug = 'finanziamento-aziendale';
