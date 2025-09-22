-- Script per aggiungere i quiz rimanenti con gli ID corretti delle lezioni

-- MODULO 6: DEBITO (Lezione 6)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'ccf19a43-91d9-429e-a3d0-8ef26d700501', -- ID reale della sesta lezione
  'Quiz - Debito',
  'Testa le tue conoscenze su gestione della liquidità aziendale e strumenti innovativi di finanziamento tramite debito',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Per distribuire più dividendi",
        "Per adempiere ai pagamenti ed evitare l''insolvenza",
        "Per ottenere rating più bassi",
        "Per ridurre il capitale proprio"
      ],
      "question": "Perché un''impresa deve preservare la sua liquidità, secondo il modulo?",
      "explanation": "La preservazione della liquidità è fondamentale per garantire la continuità aziendale, permettendo di onorare tutti i pagamenti ed evitare situazioni di insolvenza.",
      "correct_answer": 1
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Donazione senza obbligo di rimborso",
        "Prestito peer-to-peer erogato via piattaforme online in cambio di interessi",
        "Vendita di quote azionarie al pubblico",
        "Apertura di credito bancaria tradizionale"
      ],
      "question": "Il lending-based crowdfunding (social lending) è definito come...",
      "explanation": "Il lending-based crowdfunding è una forma innovativa di finanziamento che mette in contatto diretto prestatori e richiedenti tramite piattaforme digitali.",
      "correct_answer": 1
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Banche commerciali",
        "Fondi di investimento alternativi o altri soggetti non bancari",
        "Clienti dell''azienda",
        "Agenzie governative di rating"
      ],
      "question": "Il direct lending consiste in finanziamenti concessi direttamente da...",
      "explanation": "Il direct lending rappresenta un''alternativa al sistema bancario tradizionale, con fondi specializzati che prestano direttamente alle aziende.",
      "correct_answer": 1
    }
  ]'::jsonb,
  70,
  3,
  11
);

-- MODULO 7: CROWDFUNDING (Lezione 7)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '3483d444-65c6-4105-8151-110b1a79a419', -- ID reale della settima lezione
  'Quiz - Crowdfunding',
  'Testa le tue conoscenze sulle diverse tipologie di crowdfunding e i vantaggi rispetto al fundraising tradizionale',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Un processo collaborativo in cui molte persone finanziano progetti con piccole somme",
        "Un processo esclusivo per alcuni investitori selezionati",
        "Un tipo di prestito bancario non tradizionale",
        "Una piattaforma specializzata solo per donazioni online"
      ],
      "question": "Che cosa si intende per \"crowdfunding\"?",
      "explanation": "Il crowdfunding è un approccio democratico al finanziamento che permette a molte persone di contribuire con piccole somme per finanziare progetti o imprese.",
      "correct_answer": 0
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Garantisce finanziamenti soltanto da banche a tasso zero",
        "Elimina del tutto la necessità di attività di marketing",
        "Limita la raccolta fondi a un piccolo gruppo di investitori istituzionali",
        "Permette di coinvolgere una vasta comunità online, testare il prodotto e raccogliere fondi con costi e rischi quasi nulli"
      ],
      "question": "Secondo il modulo, qual è il principale vantaggio che il crowdfunding offre rispetto al fundraising tradizionale?",
      "explanation": "Il crowdfunding offre l''opportunità unica di validare il mercato, costruire una community e raccogliere capitale con costi e rischi minimi rispetto ai metodi tradizionali.",
      "correct_answer": 3
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Reward di vario tipo",
        "Quote di capitale dell''impresa",
        "Rimborso immediato",
        "Sconto fiscale automatico"
      ],
      "question": "Con l''equity-based crowdfunding l''investitore riceve...",
      "explanation": "Nell''equity-based crowdfunding, a differenza di altre forme, l''investitore diventa effettivamente socio dell''azienda ricevendo quote di capitale.",
      "correct_answer": 1
    }
  ]'::jsonb,
  70,
  3,
  9
);

-- MODULO 8: SAFE E SFP (Lezione 8)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '09c71c80-db0c-4579-912c-24a96150a0e6', -- ID reale dell'ottava lezione
  'Quiz - SAFE e SFP',
  'Testa le tue conoscenze su strumenti di investimento innovativi: SAFE e SFP per startup in early stage',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Un contratto di leasing",
        "Simple Agreement for Future Equity (cioè un investimento iniziale che si converte in equity in seguito)",
        "Una tipologia non tradizionale di bond",
        "Una donazione da parte dell''investitore"
      ],
      "question": "Che cos''è un SAFE?",
      "explanation": "Il SAFE è uno strumento di finanziamento che permette di investire in startup senza definire immediatamente la valutazione, convertendosi in equity nei round successivi.",
      "correct_answer": 1
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Determinare la valuation iniziale della startup",
        "Trovare gli investitori più adatti",
        "Calcolare le imposte",
        "Assumere il personale"
      ],
      "question": "Quale problema principale il SAFE aiuta a risolvere in fase early stage?",
      "explanation": "Il SAFE risolve il problema della valutazione nelle fasi iniziali, quando è difficile determinare il valore preciso della startup.",
      "correct_answer": 0
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Ottenere interessi annuali",
        "Convertire l''investimento in equity a prezzo di favore nei round successivi",
        "Nessun rischio d''impresa",
        "Detenere la maggioranza delle quote"
      ],
      "question": "Qual è un vantaggio per gli investitori che usano un SAFE?",
      "explanation": "Il SAFE permette agli investitori di convertire il loro investimento in equity a condizioni vantaggiose nei round di finanziamento successivi.",
      "correct_answer": 1
    }
  ]'::jsonb,
  70,
  3,
  8
);

-- MODULO 9: DIGITAL FUNDRAISING (Lezione 9)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '1a1374f2-4b1a-4576-a428-275fd39c6b6e', -- ID reale della nona lezione
  'Quiz - Digital Fundraising',
  'Testa le tue conoscenze su marketing digitale, lead generation e strategie di fundraising online',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Software per trovare nuovi clienti",
        "Tipo di marketing applicabile solo alle donazioni",
        "Processo di marketing che stimola l''interesse e trasforma i contatti in lead qualificati",
        "Processo di marketing che avviene offline"
      ],
      "question": "Che cos''è la \"Lead Generation\" secondo il modulo?",
      "explanation": "La Lead Generation è un processo strategico di marketing che identifica e coltiva potenziali interessati, trasformandoli in contatti qualificati per il business.",
      "correct_answer": 2
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Pubblicità basata Google Ads e blog",
        "Tecnica di creazione di contenuti di valore per attrarre e acquisire un pubblico definito",
        "Pubblicare un ampio numero di contenuti sui social per ottenere più \"like\"",
        "Trasmettere spot televisivi costosi per sponsorizzare il prodotto"
      ],
      "question": "Che cos''è il Content Marketing secondo il modulo?",
      "explanation": "Il Content Marketing si basa sulla creazione e condivisione di contenuti di valore per attrarre, coinvolgere e acquisire un pubblico target chiaramente definito.",
      "correct_answer": 1
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Acquisire nuovi clienti",
        "Coltivare la relazione lungo la donor journey con contenuti di valore",
        "Aumentare le spese dedicate al marketing",
        "Acquistare banner pubblicitari"
      ],
      "question": "Il Lead Nurturing è definito come il processo di...",
      "explanation": "Il Lead Nurturing consiste nel coltivare e mantenere relazioni con i potenziali donatori attraverso contenuti di valore durante tutto il loro percorso decisionale.",
      "correct_answer": 1
    }
  ]'::jsonb,
  70,
  3,
  10
);

-- MODULO 10: M&A (Lezione 10)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '1b3b6e71-0188-414e-8514-48dc2c5973ac', -- ID reale della decima lezione
  'Quiz - M&A',
  'Testa le tue conoscenze su fusioni, acquisizioni, sinergie e processi di due diligence',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Quando due società creano un consorzio temporaneo",
        "Quando un''impresa assorbe attività e passività di un''altra mantenendo la propria identità",
        "Quando un fondo acquista le obbligazioni di un''azienda",
        "Quando una banca concede un prestito a un''azienda"
      ],
      "question": "Che cosa si intende per \"fusione\" secondo il modulo?",
      "explanation": "La fusione è un''operazione in cui un''impresa assorbe completamente attività e passività di un''altra società, mantenendo la propria identità giuridica.",
      "correct_answer": 1
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Si eliminano tutti i dipendenti duplicati",
        "Le società mantengono strutture separate",
        "Si crea una holding finanziaria passiva",
        "Le prestazioni aumentano e i costi diminuiscono combinando due imprese"
      ],
      "question": "Nel contesto di M&A, la parola \"sinergia\" implica principalmente che...",
      "explanation": "Le sinergie rappresentano il valore aggiunto creato dalla combinazione di due imprese, dove il risultato è maggiore della somma delle parti singole.",
      "correct_answer": 3
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Decidere le campagne marketing post-fusione",
        "Gestire la comunicazione interna ai dipendenti",
        "Approssimare i rischi nascosti parlando con i dipendenti dell''azienda da acquisire",
        "Verificare a fondo dati finanziari, legali e operativi per rettificare la valutazione e individuare rischi nascosti"
      ],
      "question": "Qual è lo scopo principale della \"due diligence\" in un''operazione di M&A?",
      "explanation": "La due diligence è un processo di verifica approfondita che esamina tutti gli aspetti dell''azienda target per confermare la valutazione e identificare potenziali rischi.",
      "correct_answer": 3
    }
  ]'::jsonb,
  70,
  3,
  13
);

-- MODULO 11: CRIPTOVALUTE (Lezione 11)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'ba22a952-15fb-4e0e-a3d7-57445cae2598', -- ID reale dell'undicesima lezione
  'Quiz - Criptovalute',
  'Testa le tue conoscenze su Bitcoin, blockchain e tecnologie crittografiche decentralizzate',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Garantito dallo Stato, cartaceo, stabile",
        "Centralizzato, inflazionistico, obbligatorio",
        "Volatile, anonimo, illegale",
        "Decentrato, distribuito, volontario"
      ],
      "question": "Quale trio di aggettivi, indicato nel modulo, rende i Bitcoin \"diversi\" rispetto alle valute tradizionali?",
      "explanation": "Il Bitcoin si distingue dalle valute tradizionali per essere decentrato (nessuna autorità centrale), distribuito (rete peer-to-peer) e volontario (adozione spontanea).",
      "correct_answer": 3
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Un server centralizzato gestito da una banca",
        "Un database crittografato distribuito in cui si possono solo aggiungere dati",
        "Un software di posta elettronica peer-to-peer",
        "Un file di calcolo condiviso via USB"
      ],
      "question": "Che cos''è una blockchain secondo la definizione fornita?",
      "explanation": "La blockchain è un database distribuito e crittografato che funziona come un registro immutabile dove è possibile solo aggiungere nuovi dati, mai modificare quelli esistenti.",
      "correct_answer": 1
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Incertezza regolatoria",
        "Consumo energetico elevato",
        "Eliminazione degli intermediari con riduzione dei costi di transazione",
        "Complessità che limita l''adozione"
      ],
      "question": "Quale dei seguenti è indicato come un vantaggio della tecnologia blockchain?",
      "explanation": "Uno dei principali vantaggi della blockchain è la possibilità di eliminare intermediari tradizionali, riducendo così i costi di transazione e aumentando l''efficienza.",
      "correct_answer": 2
    }
  ]'::jsonb,
  70,
  3,
  11
);

-- MODULO 12: METRICHE AZIENDA VS STARTUP (Lezione 12)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'ed8d78a0-f492-4a1d-a361-dece5c39d95e', -- ID reale della dodicesima lezione
  'Quiz - Metriche Azienda vs Startup',
  'Testa le tue conoscenze sulle differenze tra metriche tradizionali aziendali e metriche specifiche per startup',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Minimum Required Return",
        "Marginal Return Rate",
        "Marketing Reach Ratio",
        "Monthly Recurring Revenue"
      ],
      "question": "L''acronimo MRR, usato per le startup, indica...",
      "explanation": "MRR (Monthly Recurring Revenue) è una metrica fondamentale per startup con modelli di business ricorrenti, che misura i ricavi mensili prevedibili.",
      "correct_answer": 3
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Gross Profit",
        "ROI",
        "EBITDA",
        "ARPA"
      ],
      "question": "Quale metrica tradizionale misura la redditività operativa prima di interessi, imposte, svalutazioni e ammortamenti?",
      "explanation": "EBITDA (Earnings Before Interest, Taxes, Depreciation and Amortization) è una metrica chiave per valutare la performance operativa di un''azienda.",
      "correct_answer": 2
    }
  ]'::jsonb,
  70,
  3,
  10
);

-- MODULO 13: VALUTAZIONE AZIENDA VS STARTUP (Lezione 13)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '15cb1013-736a-4050-81da-f63470fb631f', -- ID reale della tredicesima lezione
  'Quiz - Valutazione Azienda vs Startup',
  'Testa le tue conoscenze sui metodi di valutazione per aziende tradizionali e startup',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "DCF tradizionale",
        "Comparables",
        "Venture Capital Method",
        "Asset-based"
      ],
      "question": "Quale metodo è più adatto per valutare le startup?",
      "explanation": "Il Venture Capital Method è specificamente progettato per valutare startup con poco storico finanziario.",
      "correct_answer": 2
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Solo crescita degli utenti",
        "Solo profitti",
        "Crescita, profitti, mercato e team",
        "Solo fatturato"
      ],
      "question": "Per le startup, la valutazione considera principalmente:",
      "explanation": "Le startup vengono valutate considerando crescita, profitti potenziali, dimensioni del mercato e qualità del team.",
      "correct_answer": 2
    }
  ]'::jsonb,
  70,
  3,
  10
);

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
