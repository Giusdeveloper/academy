-- Script per aggiungere i video alle 13 lezioni del corso "Finanziamento Aziendale"

-- PRIMA: Aggiungi la colonna html5_url alla tabella lessons (se non esiste)
ALTER TABLE "public"."lessons" 
ADD COLUMN IF NOT EXISTS "html5_url" TEXT;

-- Lezione 1: La Seconda Rivoluzione Digitale
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_f398a275-2340-4663-8b94-624a4bccaeba_1.mp4'
WHERE "id" = 'f398a275-2340-4663-8b94-624a4bccaeba';

-- Lezione 2: Finanziamento Aziendale
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_9d835faf-a677-4757-b771-443404e77d8b_2.mp4'
WHERE "id" = '9d835faf-a677-4757-b771-443404e77d8b';

-- Lezione 3: Capitale di Ventura Early-Stage
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_15cb1013-736a-4050-81da-f63470fb631f_3.mp4'
WHERE "id" = '15cb1013-736a-4050-81da-f63470fb631f';

-- Lezione 4: Venture Capital e Corporate VC
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_7928aefa-ad6a-4e40-9669-dc3fac96b694_4.mp4'
WHERE "id" = '7928aefa-ad6a-4e40-9669-dc3fac96b694';

-- Lezione 5: Private Equity e Quotazione in Borsa
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_83c7ece5-809c-462b-b01e-0251d8613c82_5.mp4'
WHERE "id" = '83c7ece5-809c-462b-b01e-0251d8613c82';

-- Lezione 6: Debito - Strumenti bancari, Mini Bond e strumenti alternativi
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_ef5b3e0a-e22d-4840-92dd-1b901d5f6284_6.mp4'
WHERE "id" = 'ef5b3e0a-e22d-4840-92dd-1b901d5f6284';

-- Lezione 7: Crowdfunding
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_ccf19a43-91d9-429e-a3d0-8ef26d700501_7.mp4'
WHERE "id" = 'ccf19a43-91d9-429e-a3d0-8ef26d700501';

-- Lezione 8: SAFE, SFP e Investor Relationship Management
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_3483d444-65c6-4105-8151-110b1a79a419_8.mp4'
WHERE "id" = '3483d444-65c6-4105-8151-110b1a79a419';

-- Lezione 9: Digital Fundraising
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_09c71c80-db0c-4579-912c-24a96150a0e6_9.mp4'
WHERE "id" = '09c71c80-db0c-4579-912c-24a96150a0e6';

-- Lezione 10: Fusioni e Acquisizioni
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_1a1374f2-4b1a-4576-a428-275fd39c6b6e_10.mp4'
WHERE "id" = '1a1374f2-4b1a-4576-a428-275fd39c6b6e';

-- Lezione 11: Fundraising tramite Criptovalute e Token Offering
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_1b3b6e71-0188-414e-8514-48dc2c5973ac_11.mp4'
WHERE "id" = '1b3b6e71-0188-414e-8514-48dc2c5973ac';

-- Lezione 12: Metriche - Aziende tradizionali vs Startup
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_ba22a952-15fb-4e0e-a3d7-57445cae2598_12.mp4'
WHERE "id" = 'ba22a952-15fb-4e0e-a3d7-57445cae2598';

-- Lezione 13: Valutazione - Aziende tradizionali vs Startup
UPDATE "public"."lessons" 
SET "html5_url" = '/videos/lesson_ed8d78a0-f492-4a1d-a361-dece5c39d95e_13.mp4'
WHERE "id" = 'ed8d78a0-f492-4a1d-a361-dece5c39d95e';

-- Verifica che i video siano stati aggiunti
SELECT 
    id,
    title,
    "order",
    html5_url,
    CASE 
        WHEN html5_url IS NOT NULL THEN '✅ Video presente'
        ELSE '❌ Video mancante'
    END as video_status
FROM "public"."lessons" 
WHERE course_id = (
    SELECT id FROM courses WHERE title ILIKE '%finanziamento%'
)
ORDER BY "order";
