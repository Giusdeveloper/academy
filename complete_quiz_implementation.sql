-- Script per completare l'implementazione dei quiz
-- Aggiunge quiz per le 10 lezioni mancanti

-- Quiz per Lezione 4: Venture Capital e Corporate VC
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Venture Capital e Corporate VC',
  'Testa le tue conoscenze sui fondi di venture capital e corporate venture capital.',
  '[
    {
      "id": "q1",
      "question": "Cosa distingue un VC tradizionale da un Corporate VC?",
      "type": "multiple_choice",
      "options": [
        "Non ci sono differenze",
        "Il Corporate VC ha obiettivi strategici oltre al ritorno finanziario",
        "Il VC tradizionale investe solo in startup",
        "Il Corporate VC non cerca profitti"
      ],
      "correct_answer": 1,
      "explanation": "Il Corporate VC combina obiettivi finanziari con obiettivi strategici per la società madre."
    },
    {
      "id": "q2",
      "question": "In quale fase di crescita investono principalmente i VC?",
      "type": "multiple_choice",
      "options": [
        "Seed",
        "Early stage",
        "Growth stage",
        "Tutte le fasi"
      ],
      "correct_answer": 3,
      "explanation": "I VC investono in tutte le fasi, ma con focus diversi a seconda del fondo."
    }
  ]'::jsonb,
  70,
  3,
  10
FROM lessons l 
WHERE l."order" = 4 
LIMIT 1;

-- Quiz per Lezione 5: Private Equity e Quotazione in Borsa
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Private Equity e Quotazione in Borsa',
  'Verifica la tua comprensione del private equity e del processo di IPO.',
  '[
    {
      "id": "q1",
      "question": "Qual è la principale differenza tra Private Equity e Venture Capital?",
      "type": "multiple_choice",
      "options": [
        "Il PE investe in aziende mature, il VC in startup",
        "Non ci sono differenze",
        "Il PE è più rischioso del VC",
        "Il VC investe solo in tecnologia"
      ],
      "correct_answer": 0,
      "explanation": "Il Private Equity investe in aziende mature e consolidate, mentre il VC si concentra su startup in crescita."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 5 
LIMIT 1;

-- Quiz per Lezione 6: Debito - Strumenti bancari e alternativi
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Strumenti di Debito',
  'Testa le tue conoscenze sugli strumenti di debito per aziende.',
  '[
    {
      "id": "q1",
      "question": "Cosa sono i Mini Bond?",
      "type": "multiple_choice",
      "options": [
        "Obbligazioni molto piccole",
        "Strumenti di debito per PMI non quotate",
        "Titoli di stato",
        "Azioni privilegiate"
      ],
      "correct_answer": 1,
      "explanation": "I Mini Bond sono strumenti di debito emessi da PMI non quotate per raccogliere capitale."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 6 
LIMIT 1;

-- Quiz per Lezione 7: Crowdfunding
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Crowdfunding',
  'Verifica la tua comprensione dei modelli di crowdfunding.',
  '[
    {
      "id": "q1",
      "question": "Quali sono i principali modelli di crowdfunding?",
      "type": "multiple_choice",
      "options": [
        "Reward, Equity, Lending, Donation",
        "Solo Equity",
        "Solo Reward",
        "Solo Lending"
      ],
      "correct_answer": 0,
      "explanation": "I principali modelli sono: Reward (ricompense), Equity (partecipazione), Lending (prestiti), Donation (donazioni)."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 7 
LIMIT 1;

-- Quiz per Lezione 8: SAFE e Investor Relationship Management
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - SAFE e Investor Relations',
  'Testa le tue conoscenze sui SAFE e la gestione degli investitori.',
  '[
    {
      "id": "q1",
      "question": "Cosa significa SAFE?",
      "type": "multiple_choice",
      "options": [
        "Simple Agreement for Future Equity",
        "Safe Agreement for Financial Equity",
        "Standard Agreement for Future Exchange",
        "Secure Agreement for Financial Exchange"
      ],
      "correct_answer": 0,
      "explanation": "SAFE sta per Simple Agreement for Future Equity, uno strumento di investimento semplificato."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 8 
LIMIT 1;

-- Quiz per Lezione 9: Digital Fundraising
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Digital Fundraising',
  'Verifica la tua comprensione delle strategie di digital fundraising.',
  '[
    {
      "id": "q1",
      "question": "Quali sono i vantaggi del digital fundraising?",
      "type": "multiple_choice",
      "options": [
        "Solo costi più bassi",
        "Raggiungere più investitori, processi più veloci, maggiore trasparenza",
        "Solo maggiore trasparenza",
        "Solo processi più veloci"
      ],
      "correct_answer": 1,
      "explanation": "Il digital fundraising offre accesso a più investitori, processi più veloci e maggiore trasparenza."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 9 
LIMIT 1;

-- Quiz per Lezione 10: Fusioni e Acquisizioni
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Fusioni e Acquisizioni',
  'Testa le tue conoscenze sui processi di M&A.',
  '[
    {
      "id": "q1",
      "question": "Qual è la differenza tra fusione e acquisizione?",
      "type": "multiple_choice",
      "options": [
        "Non c\'è differenza",
        "La fusione crea una nuova entità, l\'acquisizione no",
        "L\'acquisizione è sempre più costosa",
        "La fusione è sempre più veloce"
      ],
      "correct_answer": 1,
      "explanation": "Nella fusione si crea una nuova entità, nell\'acquisizione una società compra l\'altra."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 10 
LIMIT 1;

-- Quiz per Lezione 11: Criptovalute e Token Offering
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Criptovalute e Token',
  'Verifica la tua comprensione del fundraising tramite criptovalute.',
  '[
    {
      "id": "q1",
      "question": "Cosa significa ICO?",
      "type": "multiple_choice",
      "options": [
        "Initial Coin Offering",
        "International Crypto Organization",
        "Investment Crypto Option",
        "Initial Crypto Operation"
      ],
      "correct_answer": 0,
      "explanation": "ICO sta per Initial Coin Offering, una forma di fundraising tramite emissione di token."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 11 
LIMIT 1;

-- Quiz per Lezione 12: Metriche Aziende vs Startup
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Metriche Aziende vs Startup',
  'Testa le tue conoscenze sulle metriche per aziende tradizionali e startup.',
  '[
    {
      "id": "q1",
      "question": "Quale metrica è più importante per le startup?",
      "type": "multiple_choice",
      "options": [
        "Profitto immediato",
        "Crescita degli utenti",
        "ROI tradizionale",
        "Dividendi"
      ],
      "correct_answer": 1,
      "explanation": "Le startup si concentrano sulla crescita degli utenti più che sul profitto immediato."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 12 
LIMIT 1;

-- Quiz per Lezione 13: Valutazione Aziende vs Startup
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
SELECT 
  l.id,
  'Quiz - Valutazione Aziende vs Startup',
  'Verifica la tua comprensione dei metodi di valutazione.',
  '[
    {
      "id": "q1",
      "question": "Quale metodo è più adatto per valutare le startup?",
      "type": "multiple_choice",
      "options": [
        "DCF tradizionale",
        "Comparables",
        "Venture Capital Method",
        "Asset-based"
      ],
      "correct_answer": 2,
      "explanation": "Il Venture Capital Method è specificamente progettato per valutare startup con poco storico finanziario."
    }
  ]'::jsonb,
  70,
  3,
  8
FROM lessons l 
WHERE l."order" = 13 
LIMIT 1;

-- Verifica finale
SELECT 
  q.title,
  l.title as lesson_title,
  l."order" as lesson_order,
  jsonb_array_length(q.questions) as num_questions,
  q.passing_score,
  q.time_limit
FROM quizzes q
JOIN lessons l ON l.id = q.lesson_id
ORDER BY l."order";
