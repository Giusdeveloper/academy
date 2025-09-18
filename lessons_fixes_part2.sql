-- PARTE 2: Correzione delle lezioni dalla 6 alla 10
-- Rimozione dei riferimenti malformati e correzione della formattazione HTML

-- Lezione 6: Debito - Strumenti bancari, Mini Bond e strumenti alternativi
UPDATE "public"."lessons" 
SET "content" = '<h2>Debito: Strumenti bancari, Mini Bond e strumenti alternativi</h2>

<p>In questo modulo esploreremo le diverse forme di debito aziendale, dai classici strumenti bancari (mutui, linee di credito, anticipazioni, factoring, leasing) alle soluzioni alternative di finanziamento (Mini Bond, crowdlending, invoice trading, direct lending), analizzando caratteristiche, costi, garanzie e modalità operative.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Comprendere le esigenze di capitale nelle varie fasi di vita dell''impresa e distinguere finanziamento interno ed esterno.</li>
  <li>Conoscere gli strumenti bancari tradizionali: mutui, crediti in conto corrente, anticipazioni su crediti e factoring.</li>
  <li>Analizzare strumenti a medio-lungo termine e di leasing, compresi i prestiti in pool di banche.</li>
  <li>Esplorare le principali forme di finanza alternativa: Mini Bond, crowdlending, invoice trading e direct lending.</li>
  <li>Valutare costi, rischi e garanzie associate a ciascun strumento.</li>
  <li>Applicare tecniche di riclassificazione di bilancio per misurare la posizione finanziaria netta e i rapporti di struttura e liquidità.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Fondamenti del debito aziendale</strong> – Esigenze di capitale, attività e passività, liquidità e redditività.</li>
  <li><strong>Strumenti bancari tradizionali</strong> – Mutui e modalità di ammortamento; apertura di credito e scoperti di conto; anticipazioni e smobilizzo crediti (sconto, SBF, anticipo su fatture, factoring); anticipazioni su pegno; finanziamento in valori mobiliari.</li>
  <li><strong>Finanziamenti a medio-lungo termine e leasing</strong> – Mutui a lungo termine, leasing operativo e finanziario, prestiti in pool bancari.</li>
  <li><strong>Finanza alternativa</strong> – Emissione di Mini Bond: normativa, caratteristiche, processo di emissione; crowdlending: modelli e piattaforme; invoice trading: funzionamento e portali; direct lending: definizione e soggetti.</li>
  <li><strong>Appendice</strong> – Riclassificazione di bilancio: patrimoniale e funzionale, indicatori di struttura e liquidità.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con schemi di stato patrimoniale, diagrammi di finanziamento e tabelle comparative dei costi.</li>
  <li>Esercitazioni pratiche: calcolo dell''effetto leverage, simulazione di emissione di Mini Bond e analisi di un piano di ammortamento.</li>
  <li>Case study: scelta della migliore forma di debito per un progetto aziendale specifico.</li>
  <li>Quiz di autovalutazione a fine modulo.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine del modulo sarai in grado di selezionare il mix di strumenti di debito più adatto alle esigenze della tua impresa, valutare costi e garanzie e interpretare i principali indicatori di posizione finanziaria netta e liquidità.</p>'
WHERE "id" = 'ef5b3e0a-e22d-4840-92dd-1b901d5f6284';

-- Lezione 7: Crowdfunding
UPDATE "public"."lessons" 
SET "content" = '<h2>Crowdfunding: modelli, dinamiche e applicazioni</h2>

<p>Il crowdfunding è un processo collaborativo in cui una folla di persone contribuisce con piccole somme di denaro per finanziare progetti di imprese, startup, iniziative sociali o prodotti innovativi. Questa forma di micro-finanziamento dal basso si basa sull''aggregazione di contributi individuali, superando le barriere dei canali tradizionali e trasformando la folla in un vero e proprio stakeholder del progetto.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Definire il crowdfunding e distinguere le quattro principali tipologie: <strong>lending-based</strong>, <strong>equity-based</strong>, <strong>reward-based</strong> e <strong>donation-based</strong>.</li>
  <li>Analizzare i trend di crescita e le dimensioni del mercato globale e italiano, con dati aggiornati al 2022 e previsioni 2026.</li>
  <li>Illustrare il processo di una campagna di successo: dalla preparazione del pitch alle attività di coinvolgimento pre-lancio, lancio e post-lancio.</li>
  <li>Valutare vantaggi, criticità e opportunità per imprese, startup, enti non profit e corporate.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Introduzione e definizioni</strong> – Origini e significato del termine &quot;crowdfunding&quot;.</li>
  <li><strong>Tipologie di piattaforme</strong> – Lending, equity, reward, donation e modelli ibridi.</li>
  <li><strong>Trend di mercato</strong> – Dimensioni globali, ranking dei paesi più attivi e focus sul mercato italiano.</li>
  <li><strong>Processo di campagna</strong> – Preparazione, prime 48 ore, &quot;fuoco&quot; dei 26 giorni, ultime 48 ore.</li>
  <li><strong>Elementi chiave del pitch</strong> – Visione, gerarchia delle informazioni, video e FAQ.</li>
  <li><strong>Strategie di engagement</strong> – Backer missions, social rewards e gestione della community.</li>
  <li><strong>Casi di studio</strong> – Esempi internazionali (Coolest Cooler, Exploding Kittens) e best practice per il non-profit.</li>
  <li><strong>Ruolo delle aziende e opportunità di open innovation</strong> – Corporate VC, civic ed enterprise crowdfunding.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con infografiche sui modelli e i volumi di raccolta.</li>
  <li>Esercitazione di benchmarking: analisi di due campagne reward- e equity-based di successo.</li>
  <li>Laboratorio di progettazione del pitch video e della landing page di una campagna.</li>
  <li>Quiz finale per l''autovalutazione sulle diverse tipologie di crowdfunding.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine di questo modulo sarai in grado di selezionare il modello di crowdfunding più adatto al tuo progetto, progettare una campagna efficace, valutare i costi e i rischi associati e utilizzare la folla non solo come fonte di capitale, ma anche come network di validazione, marketing e open innovation.</p>'
WHERE "id" = 'ccf19a43-91d9-429e-a3d0-8ef26d700501';

-- Lezione 8: SAFE, SFP e Investor Relationship Management
UPDATE "public"."lessons" 
SET "content" = '<h2>SAFE, SFP e Investor Relationship Management</h2>

<p>In questa lezione esploreremo il <strong>SAFE agreement</strong> (Simple Agreement for Future Equity), gli <strong>Strumenti Finanziari Partecipativi</strong> (SFP) e il concetto di <strong>Investor Relationship Management</strong> (IRM). Analizzeremo natura, funzionamento, vantaggi e casi di utilizzo di SAFE e SFP, per poi introdurre le logiche e gli strumenti per segmentare, profilare e gestire efficacemente la relazione con gli investitori attraverso un sistema IRM.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Comprendere come funziona un <strong>SAFE agreement</strong> e come si differenzia da debito o equity.</li>
  <li>Conoscere i principali termini negoziali del SAFE (Valuation Cap, Floor, Discount) e il processo di conversione.</li>
  <li>Approfondire gli <strong>SFP</strong>: natura giuridica, disciplina normativa e modalità di emissione.</li>
  <li>Esplorare il modello <em>Smart Equity</em> per l''integrazione di SAFE, equity crowdfunding e SFP.</li>
  <li>Apprendere tecniche di <strong>segmentazione e profilazione degli investor</strong> e costruire un Investor Persona Map.</li>
  <li>Imparare i principi base dell''<strong>Investor Relationship Management</strong> e il flusso di acquisizione e gestione degli investor (funnel IRM).</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Introduzione al SAFE agreement</strong> – definizione, scopo e differenze rispetto a debito ed equity.</li>
  <li><strong>Termini negoziali del SAFE</strong> – Valuation Cap, Floor e Discount, rischi e benefici per startup e investor.</li>
  <li><strong>Strumenti Finanziari Partecipativi (SFP)</strong> – quadro normativo (art. 2346 c.c.), funzionamento e vantaggi.</li>
  <li><strong>Modello Smart Equity</strong> – integrazione di SAFE e equity crowdfunding per una raccolta phased e iterativa.</li>
  <li><strong>Segmentazione e Profilazione Investor</strong> – creazione di categorie e investor personas per ottimizzare la comunicazione.</li>
  <li><strong>Investor Relationship Management (IRM)</strong> – definizione, piattaforme logiche e best practice per engagement continuativo.</li>
  <li><strong>Modello Sistemico di Acquisizione di Investor</strong> – funnel di selezione, onboarding, IRM e growth &amp; funding.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con diagrammi del SAFE (pagine 6–8), modello Smart Equity (p. 22) e funnel IRM (p. 40).</li>
  <li>Esercitazione pratica: redazione di un SAFE agreement con cap, floor e discount su un caso di studio.</li>
  <li>Case study: progettazione di una campagna SFP per una startup innovativa.</li>
  <li>Laboratorio: definizione di investor personas e setup di un flusso IRM base.</li>
  <li>Quiz di autovalutazione sui concetti chiave di SAFE, SFP e IRM.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine sarai in grado di negoziare e strutturare un <strong>SAFE agreement</strong>, emettere <strong>SFP</strong> conformi alla normativa, segmentare e profilare gli investitori e implementare un primo <strong>sistema IRM</strong> per coltivare relazioni durature e facilitare futuri round di funding.</p>'
WHERE "id" = '3483d444-65c6-4105-8151-110b1a79a419';

-- Lezione 9: Digital Fundraising
UPDATE "public"."lessons" 
SET "content" = '<h2>Digital Fundraising: metodologie e strategie</h2>

<p>La rivoluzione digitale ha trasformato il modo in cui i donatori interagiscono con le organizzazioni non profit. In questa lezione analizzeremo l''evoluzione del processo di donazione, le tecniche di Lead Generation, l''applicazione dell''Inbound Marketing e la progettazione di un piano di Content Marketing per guidare il Donor''s Journey e massimizzare i risultati di raccolta fondi online.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Comprendere come il processo di donazione online sia cambiato nell''era digitale.</li>
  <li>Definire e segmentare il funnel di Lead Generation per il settore non profit.</li>
  <li>Apprendere la metodologia Inbound Marketing applicata al fundraising.</li>
  <li>Progettare un piano di Content Marketing lungo il Donor''s Journey.</li>
  <li>Implementare il modello Inbound Donation per ottimizzare le conversioni.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Il nuovo processo di donazione</strong> – evoluzione dal contatto fisico alla ricerca online e ai micro-momenti.</li>
  <li><strong>Lead Generation per il non profit</strong> – definizione di Lead, segmentazione e gestione del funnel.</li>
  <li><strong>Paradigma dell''abbondanza e best practice</strong> – attenzione, personalizzazione e &quot;WOW&quot; moments.</li>
  <li><strong>Inbound Marketing</strong> – framework ATTRACT, CONVERT, CLOSE, DELIGHT.</li>
  <li><strong>Analisi e segmentazione dei donatori</strong> – modello di donatore, raccolta dati e cluster.</li>
  <li><strong>Il Donor''s Journey</strong> – fasi Awareness, Consideration, Decision e micro-momenti.</li>
  <li><strong>Content Marketing</strong> – ZMOT, content strategy e strumenti di content curation.</li>
  <li><strong>Piano operativo di content marketing</strong> – template, KPI e tecniche di distribuzione.</li>
  <li><strong>Inbound Donation</strong> – adattamento del legacy fundraising al modello inbound.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con infografiche di Google sui micro-momenti e statistiche di donazione.</li>
  <li>Esercitazione: definizione del modello di donatore e mappatura del funnel.</li>
  <li>Workshop: progettazione di un content marketing plan per una campagna di raccolta fondi.</li>
  <li>Quiz finale per verificare la comprensione delle metodologie di digital fundraising.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine del modulo sarai in grado di progettare e implementare una strategia di Digital Fundraising integrata, capace di attrarre, convertire e fidelizzare donatori online, sfruttando le logiche dell''Inbound Marketing e del Content Marketing per massimizzare l''impatto delle tue campagne.</p>'
WHERE "id" = '09c71c80-db0c-4579-912c-24a96150a0e6';

-- Lezione 10: Fusioni e Acquisizioni
UPDATE "public"."lessons" 
SET "content" = '<h2>Introduzione a Fusioni e Acquisizioni</h2>

<p>Merger &amp; Acquisition (M&amp;A) è il processo tramite il quale due imprese si uniscono volontariamente (fusioni) o una impresa acquisisce i beni e/o le azioni di un''altra (acquisizioni), con l''obiettivo di creare sinergie, aumentare la competitività e ottimizzare risorse. In questa lezione scopriremo definizioni, tipologie di fusioni e acquisizioni, le dinamiche di M&amp;A, i principali attori coinvolti e il percorso operativo dalla valutazione iniziale fino al closing e all''integrazione post-transaction.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Definire fusioni, acquisizioni e le differenze chiave tra le due operazioni.</li>
  <li>Conoscere le tipologie di fusioni (orizzontali, verticali, conglomerali, market/product extension) e acquisizioni (amichevoli, ostili, inverse, backflip).</li>
  <li>Comprendere il concetto di sinergia e i meccanismi per crearla (economie di scala, riduzione costi, aumento ricavi).</li>
  <li>Analizzare le metodologie di valutazione (asset based, utili storici/futuri, comparables, DCF) e le dinamiche di pricing (determinato, determinabile, variabile con earn-out).</li>
  <li>Esplorare il processo di M&amp;A: strategia, ricerca target, due diligence, negoziazione di LOI/term sheet, struttura del deal e documentazione contrattuale.</li>
  <li>Valutare i vantaggi e le criticità operative, legali e organizzative durante l''integrazione post-acquisizione.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Definizioni</strong> – Concetti base di fusione e acquisizione.</li>
  <li><strong>Fusioni</strong> – Tipologie e casi.</li>
  <li><strong>Acquisizioni</strong> – Modalità e varianti.</li>
  <li><strong>Fusioni vs Acquisizioni</strong> – Differenze operative e strategiche.</li>
  <li><strong>Sinergie</strong> – Creazione di valore e riduzione dei costi.</li>
  <li><strong>Valutazione</strong> – Metodi di pricing e clausole earn-out.</li>
  <li><strong>Processo di M&amp;A</strong> – Step dalla strategia al closing.</li>
  <li><strong>Strutturare il deal</strong> – Term sheet, LOI e documenti chiave.</li>
  <li><strong>Due diligence</strong> – Obiettivi e aree di verifica.</li>
  <li><strong>Contratto di acquisto/vendita</strong> – Elementi essenziali e clausole.</li>
  <li><strong>Attività e costi degli advisor</strong> – Modelli di fee e success fee.</li>
  <li><strong>Tipologie di acquirenti</strong> – Strategici vs finanziari.</li>
  <li><strong>Finanziamento del deal</strong> – Cash, equity, leveraged buyout.</li>
  <li><strong>Acquisto di azioni vs asset</strong> – Implicazioni legali e fiscali.</li>
  <li><strong>Approvazione e normative</strong> – Iter legale e governance.</li>
  <li><strong>Storia e case studies</strong> – Ondate di M&amp;A e esempi celebri.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con definizioni, diagrammi processuali, tabelle comparative e infografiche di fusioni e acquisizioni.</li>
  <li>Casi studio internazionali (Tata Steel–Corus, Vodafone–Hutchison Essar, Hindalco–Novelis, Ranbaxy–Daiichi Sankyo, ONGC–Imperial Energy).</li>
  <li>Esercitazione: redigere un LOI e un term sheet semplificato per un''operazione di M&amp;A.</li>
  <li>Role-play di negoziazione di clausole earn-out e garanzie contrattuali.</li>
  <li>Quiz di valutazione finale sulle diverse fasi e strumenti di M&amp;A.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine della lezione sarai in grado di descrivere e classificare fusioni e acquisizioni, valutare sinergie e modalità di pricing, pianificare il processo di M&amp;A, redigere term sheet e LOI, condurre una due diligence e gestire le principali criticità dell''integrazione post-transaction.</p>'
WHERE "id" = '1a1374f2-4b1a-4576-a428-275fd39c6b6e'; 