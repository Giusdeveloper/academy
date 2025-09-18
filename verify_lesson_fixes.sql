-- Script per verificare se le correzioni delle lezioni sono state applicate
-- Esegui questo script nella console SQL di Supabase per verificare lo stato

-- 1. Controlla se ci sono ancora riferimenti malformati
SELECT 
    id, 
    title, 
    CASE 
        WHEN content LIKE '%:contentReference[oaicite:%' THEN '❌ Ha riferimenti malformati'
        ELSE '✅ Corretto'
    END as status,
    LENGTH(content) as content_length
FROM lessons 
ORDER BY "order";

-- 2. Conta le lezioni con problemi
SELECT 
    COUNT(*) as total_lessons,
    COUNT(CASE WHEN content LIKE '%:contentReference[oaicite:%' THEN 1 END) as malformed_lessons,
    COUNT(CASE WHEN content NOT LIKE '%:contentReference[oaicite:%' THEN 1 END) as corrected_lessons
FROM lessons;

-- 3. Mostra un esempio di contenuto corretto (prima lezione)
SELECT 
    title,
    LEFT(content, 200) || '...' as content_preview
FROM lessons 
WHERE "order" = 1;
