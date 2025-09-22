-- Script completo per implementare tutti i quiz con gli ID corretti delle lezioni
-- Prima puliamo i quiz esistenti
DELETE FROM quiz_attempts WHERE quiz_id IN (SELECT id FROM quizzes);
DELETE FROM quizzes;

-- QUIZ 1: La Seconda Rivoluzione Digitale
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'f398a275-2340-4663-8b94-624a4bccaeba', -- Lezione 1: La Seconda Rivoluzione Digitale
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

-- QUIZ 2: Finanziamento Aziendale
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '9d835faf-a677-4757-b771-443404e77d8b', -- Lezione 2: Finanziamento Aziendale
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

-- QUIZ 3: Capitale di Ventura Early-Stage
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '15cb1013-736a-4050-81da-f63470fb631f', -- Lezione 3: Capitale di Ventura Early-Stage
  'Quiz - Capitale di Ventura Early-Stage',
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

-- QUIZ 4: Venture Capital e Corporate VC
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '7928aefa-ad6a-4e40-9669-dc3fac96b694', -- Lezione 4: Venture Capital e Corporate VC
  'Quiz - Venture Capital e Corporate VC',
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

-- QUIZ 5: Private Equity e Quotazione in Borsa
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '83c7ece5-809c-462b-b01e-0251d8613c82', -- Lezione 5: Private Equity e Quotazione in Borsa
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

-- QUIZ 6: Debito: Strumenti bancari, Mini Bond e strumenti alternativi
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'ef5b3e0a-e22d-4840-92dd-1b901d5f6284', -- Lezione 6: Debito
  'Quiz - Debito e Strumenti Finanziari',
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

-- QUIZ 7: Crowdfunding: modelli, dinamiche e applicazioni
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'ccf19a43-91d9-429e-a3d0-8ef26d700501', -- Lezione 7: Crowdfunding
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

-- QUIZ 8: SAFE, SFP e Investor Relationship Management
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '3483d444-65c6-4105-8151-110b1a79a419', -- Lezione 8: SAFE, SFP e Investor Relationship Management
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

-- QUIZ 9: Digital Fundraising: metodologie e strategie
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '09c71c80-db0c-4579-912c-24a96150a0e6', -- Lezione 9: Digital Fundraising
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

-- QUIZ 10: Introduzione a Fusioni e Acquisizioni
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '1a1374f2-4b1a-4576-a428-275fd39c6b6e', -- Lezione 10: Introduzione a Fusioni e Acquisizioni
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

-- QUIZ 11: Fundraising tramite Criptovalute e Token Offering
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  '1b3b6e71-0188-414e-8514-48dc2c5973ac', -- Lezione 11: Fundraising tramite Criptovalute
  'Quiz - Criptovalute e Token Offering',
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

-- QUIZ 12: Metriche: Aziende tradizionali vs Startup
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'ba22a952-15fb-4e0e-a3d7-57445cae2598', -- Lezione 12: Metriche
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
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Solo per startup tech",
        "Solo per aziende tradizionali",
        "Per entrambi i tipi di aziende ma con focus diversi",
        "Nessuno dei due"
      ],
      "question": "Il Customer Acquisition Cost (CAC) è importante:",
      "explanation": "Il CAC è cruciale per entrambi i tipi di aziende, ma le startup lo monitorano più attentamente per sostenibilità del modello di business.",
      "correct_answer": 2
    }
  ]'::jsonb,
  70,
  3,
  10
);

-- QUIZ 13: Valutazione: Aziende tradizionali vs Startup
INSERT INTO quizzes (lesson_id, title, description, questions, passing_score, max_attempts, time_limit)
VALUES (
  'ed8d78a0-f492-4a1d-a361-dece5c39d95e', -- Lezione 13: Valutazione
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
    },
    {
      "id": "q3",
      "type": "multiple_choice",
      "options": [
        "Sempre più alta delle aziende tradizionali",
        "Sempre più bassa delle aziende tradizionali",
        "Dipende dalla fase di sviluppo e dal settore",
        "Sempre uguale indipendentemente dal settore"
      ],
      "question": "La volatilità della valutazione delle startup è:",
      "explanation": "La valutazione delle startup è altamente volatile e dipende dalla fase di sviluppo, dal settore e dalle condizioni di mercato.",
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
