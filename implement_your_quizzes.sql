-- Script per implementare i quiz dell'utente con gli ID corretti delle lezioni
-- Prima puliamo i quiz esistenti
DELETE FROM quiz_attempts WHERE quiz_id IN (SELECT id FROM quizzes);
DELETE FROM quizzes;

-- MODULO 1: IL MONDO È CAMBIATO (Lezione 1)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'f398a275-2340-4663-8b94-624a4bccaeba', -- ID reale della prima lezione
  'Quiz - Il Mondo è Cambiato',
  'Testa le tue conoscenze sui cambiamenti del mondo moderno, foresight e tecnologie esponenziali',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Un''analisi retrospettiva dei dati di vendita",
        "Un processo sistematico di raccolta di informazioni e costruzione di scenari sul futuro a medio-lungo termine",
        "Un software che automatizza le e-mail",
        "Un programma di training fisico per i manager"
      ],
      "question": "Nel modulo, il foresight è descritto principalmente come...?",
      "explanation": "Il foresight è un processo sistematico che ci aiuta a prepararci per il futuro attraverso l''analisi e la costruzione di scenari.",
      "correct_answer": 1
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Tecnologie che crescono a una velocità costante e lineare",
        "Tecnologie che crescono a una velocità esponenziale, molto più rapida di quelle tradizionali lineari",
        "Tecnologie riservate esclusivamente al settore delle energie rinnovabili",
        "Tecnologie superate, rimpiazzate da innovazioni incrementali"
      ],
      "question": "Cosa si intende con \"tecnologie esponenziali\"?",
      "explanation": "Le tecnologie esponenziali si caratterizzano per una crescita accelerata che supera di gran lunga quella delle tecnologie tradizionali lineari.",
      "correct_answer": 1
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Unico, Veloce, Certo, Lineare",
        "Governato solo dall''economia",
        "Totalmente prevedibile con i big data",
        "Volatile, Incerto, Complesso e Ambiguo"
      ],
      "question": "L''acronimo V.U.C.A. usato nel modulo descrive un futuro...",
      "explanation": "V.U.C.A. (Volatile, Uncertain, Complex, Ambiguous) descrive la natura imprevedibile e complessa del mondo moderno.",
      "correct_answer": 3
    }
  ]'::jsonb,
  70,
  3,
  15
);

-- MODULO 2: FINANZIAMENTO AZIENDALE (Lezione 2)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '9d835faf-a677-4757-b771-443404e77d8b', -- ID reale della seconda lezione
  'Quiz - Finanziamento Aziendale',
  'Testa le tue conoscenze su debito, equity, capitale circolante e strumenti di finanziamento innovativi',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Attività correnti - Passività correnti",
        "Attività fisse - Passività a lungo termine",
        "Ricavi - Costi",
        "Debito - Equity"
      ],
      "question": "Qual è la formula del Capitale Circolante Netto (NWC)?",
      "explanation": "Il Capitale Circolante Netto si calcola sottraendo le passività correnti dalle attività correnti, rappresentando la liquidità operativa dell''azienda.",
      "correct_answer": 0
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Un debito bancario",
        "Capitale di rischio investito dai soci",
        "Patrimonio dei clienti",
        "Riserve di magazzino"
      ],
      "question": "Nel modulo, l''equity è descritta come...",
      "explanation": "L''equity rappresenta il capitale di rischio apportato dai soci, che diventa proprietà dell''azienda e comporta diritti di partecipazione agli utili.",
      "correct_answer": 1
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Garantisce un mutuo a tasso zero",
        "Concede capitali rapidi in cambio di diritti su equity futuri",
        "È un''assicurazione sulle esportazioni",
        "È un''obbligazione garantita"
      ],
      "question": "Il SAFE (Simple Agreement for Future Equity) è definito come uno strumento che...",
      "explanation": "Il SAFE è uno strumento di finanziamento innovativo che permette di ottenere capitale immediato in cambio di diritti su quote societarie future.",
      "correct_answer": 1
    }
  ]'::jsonb,
  70,
  3,
  12
);

-- MODULO 3: CAPITALE DI VENTURA (Lezione 3)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '7928aefa-ad6a-4e40-9669-dc3fac96b694', -- ID reale della terza lezione
  'Quiz - Capitale di Ventura',
  'Testa le tue conoscenze su venture capital, business angels e strategie di investimento in startup',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Per pagare le tasse a cui è soggetta la startup",
        "Per realizzare il ritorno sul capitale investito",
        "Per chiudere l''azienda",
        "Per assumere nuovo personale"
      ],
      "question": "Perché la exit è ritenuta necessaria dagli investitori di venture capital?",
      "explanation": "L''exit (vendita o quotazione) è fondamentale per i VC perché rappresenta il momento in cui possono realizzare i guadagni dall''investimento effettuato.",
      "correct_answer": 1
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Un dipendente pubblico che gestisce fondi statali",
        "Un''organizzazione che investe in nuove imprese ad alto potenziale",
        "Un individuo facoltoso che investe in nuove imprese ad alto potenziale",
        "Un ente governativo per lo sviluppo aziendale"
      ],
      "question": "Angel Investor è definito nel modulo come...",
      "explanation": "Gli Angel Investor sono individui con patrimonio personale che investono nelle fasi iniziali delle startup, spesso apportando anche competenze e network.",
      "correct_answer": 2
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Contenere la crescita delle imprese",
        "Fornire i ticket di investimento più alti in assoluto tra i vari tipi di investitori",
        "Impedire il crowdfunding",
        "Fornire conoscenza, mentorship e rete di contatti"
      ],
      "question": "Tra le motivazioni per cui gli Angels sono importanti, il modulo cita:",
      "explanation": "Gli Angel Investor sono preziosi non solo per il capitale ma soprattutto per l''esperienza, la mentorship e la rete di contatti che mettono a disposizione delle startup.",
      "correct_answer": 3
    }
  ]'::jsonb,
  70,
  3,
  10
);

-- MODULO 4: VENTURE CAPITAL (Lezione 4)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '83c7ece5-809c-462b-b01e-0251d8613c82', -- ID reale della quarta lezione
  'Quiz - Venture Capital',
  'Testa le tue conoscenze su venture capital, strategie di exit e obiettivi di rendimento',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Un prestito bancario a breve termine",
        "Un investimento di medio-lungo termine in imprese non quotate ad alto potenziale",
        "Una donazione senza obbligo di restituzione",
        "Un investimento a breve termine in imprese quotate ad alto potenziale"
      ],
      "question": "Che cos''è il venture capital secondo la definizione del modulo?",
      "explanation": "Il venture capital è caratterizzato da investimenti a medio-lungo termine in aziende non quotate con alto potenziale di crescita, accettando rischi elevati per rendimenti significativi.",
      "correct_answer": 1
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Vendita a un''altra società",
        "Buy-back da parte dei fondatori",
        "IPO",
        "Cessione a nuovi soci privati"
      ],
      "question": "Tra le modalità di exit elencate, quale comporta la quotazione in Borsa della partecipata?",
      "explanation": "L''IPO (Initial Public Offering) è il processo attraverso cui un''azienda privata diventa pubblica quotandosi in borsa, rappresentando una delle principali strategie di exit per i VC.",
      "correct_answer": 2
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "10%",
        "20%",
        "30%",
        "50%"
      ],
      "question": "Secondo il modulo, molti investitori in VC ambiscono a un IRR lordo intorno al _____ su investimenti di successo.",
      "explanation": "Un IRR (Internal Rate of Return) del 30% è l''obiettivo tipico dei fondi di venture capital per compensare gli alti rischi degli investimenti in startup.",
      "correct_answer": 2
    }
  ]'::jsonb,
  70,
  3,
  12
);

-- MODULO 5: PRIVATE EQUITY E BORSA (Lezione 5)
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'ef5b3e0a-e22d-4840-92dd-1b901d5f6284', -- ID reale della quinta lezione
  'Quiz - Private Equity e Borsa',
  'Testa le tue conoscenze su private equity, orizzonti temporali di investimento e rischi di illiquidità',
  '[
    {
      "id": "q1",
      "type": "multiple_choice",
      "options": [
        "Un investimento in imprese già quotate",
        "Capitale privato investito in imprese non quotate",
        "Un prestito bancario a breve termine",
        "Una donazione a fondo perduto"
      ],
      "question": "Che cos''è il Private Equity?",
      "explanation": "Il Private Equity consiste nell''investimento di capitale privato in società non quotate in borsa, con l''obiettivo di migliorarne le performance e realizzare plusvalenze.",
      "correct_answer": 1
    },
    {
      "id": "q2",
      "type": "multiple_choice",
      "options": [
        "Fino a 12 mesi",
        "1-3 anni",
        "5-10 anni o più",
        "Pochi mesi"
      ],
      "question": "Qual è l''orizzonte temporale tipico di un investimento di Private Equity?",
      "explanation": "Gli investimenti di Private Equity hanno orizzonti temporali molto lunghi (5-10 anni o più) per permettere la trasformazione e crescita delle aziende target.",
      "correct_answer": 2
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Volatilità giornaliera dei prezzi di mercato",
        "Illiquidità del capitale investito per anni",
        "Inflazione",
        "Volatilità giornaliera dei tassi di interesse"
      ],
      "question": "Quale rischio viene sottolineato per gli investimenti in Private Equity?",
      "explanation": "L''illiquidità è il rischio principale del Private Equity: il capitale rimane bloccato per anni senza possibilità di disinvestimento rapido.",
      "correct_answer": 1
    }
  ]'::jsonb,
  70,
  3,
  14
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
