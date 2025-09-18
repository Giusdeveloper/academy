-- PARTE 1: Correzione delle prime 5 lezioni
-- Rimozione dei riferimenti malformati e correzione della formattazione HTML

-- Lezione 1: La Seconda Rivoluzione Digitale
UPDATE "public"."lessons" 
SET "content" = '<h2>La Seconda Rivoluzione Digitale</h2>

<p>Questa lezione inaugura il percorso sull''innovazione tecnologica e sul ruolo delle startup nel ridisegnare mercati, modelli di business e società. Partendo dal concetto di <em>foresight</em> – la capacità di leggere in anticipo i segnali di trasformazione – esploreremo come l''avvento delle <strong>tecnologie esponenziali</strong> stia accelerando il cambiamento, dando vita alla &quot;seconda rivoluzione digitale&quot; e generando nuove opportunità imprenditoriali.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Comprendere perché parliamo di &quot;seconda&quot; rivoluzione digitale e quali discontinuità la distinguono dalla prima ondata degli anni ''90.</li>
  <li>Riconoscere le forze esogene (crowd, piattaforme, riduzione dei costi tecnologici) che permettono alle startup di crescere in modo esponenziale.</li>
  <li>Valutare l''impatto di tali cambiamenti sui modelli di business tradizionali e sui tempi di permanenza delle aziende nei mercati di riferimento.</li>
</ul>

<h3>Struttura del modulo</h3>
<p>La lezione è articolata in otto sezioni, ciascuna corredata da esempi e casi di studio:</p>
<ol>
  <li><strong>Introduzione</strong> – Scenari e driver del cambiamento.</li>
  <li><strong>Foresight</strong> – Metodi per anticipare i trend tecnologici.</li>
  <li><strong>Guardare al passato</strong> – Dalle rivoluzioni industriali al digitale.</li>
  <li><strong>Crescita esponenziale</strong> – Leggi di Moore e Kurzweil, time-to-market.</li>
  <li><strong>Forze esterne</strong> – Cloud, AI, stampa 3D, blockchain, ecc.</li>
  <li><strong>Sistemi complessi</strong> – V.U.C.A. e framework Cynefin.</li>
  <li><strong>Sempre più veloce</strong> – Unicorn in &lt; 2 anni, declino degli incumbent.</li>
  <li><strong>Business model</strong> – Come il digitale ridefinisce costi, ricavi e value proposition.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con grafici, timeline e case history (Tesla, Google, Amazon…).</li>
  <li>Discussione guidata: &quot;Quale tecnologia esponenziale impatterà di più il tuo settore nei prossimi 5 anni?&quot;.</li>
  <li>Quiz di autovalutazione a fine lezione.</li>
</ul>

<h3>Take-away</h3>
<p>Al termine sarai in grado di individuare i segnali deboli del mercato, stimare la velocità con cui un''innovazione può scalare e identificare le leve per rendere il tuo modello di business più resiliente nell''era esponenziale.</p>'
WHERE "id" = 'f398a275-2340-4663-8b94-624a4bccaeba';

-- Lezione 2: Finanziamento Aziendale
UPDATE "public"."lessons" 
SET "content" = '<h2>Finanziamento Aziendale: Debito, Equity e Capitale Circolante</h2>

<p>Ogni impresa ha bisogno di risorse per realizzare i propri progetti. Queste risorse possono provenire da <strong>debito</strong>, <strong>equity</strong> oppure dall''ottimizzazione del <strong>capitale circolante</strong>. In questa lezione approfondiremo le tre principali &quot;gambe&quot; del finanziamento aziendale, analizzandone logiche, strumenti tradizionali e alternativi, vantaggi e criticità.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Distinguere tra debito, equity e capitale circolante, comprendendone la funzione nel bilancio aziendale.</li>
  <li>Valutare pro e contro delle diverse forme di finanziamento, incluse quelle di finanza alternativa (mini-bond, crowdlending, SAFE, ecc.).</li>
  <li>Apprendere tecniche operative per liberare liquidità attraverso la gestione di magazzino, incassi e pagamenti.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Introduzione ai tre pilastri</strong> – Ruolo di debito, equity e working capital nel ciclo di vita dell''impresa.</li>
  <li><strong>Debito</strong>
    <ul>
      <li>Finanza tradizionale (mutui, anticipi, scoperti, factoring) e parametri di scelta.</li>
      <li>Finanza alternativa: mini-bond, direct lending, invoice trading, social lending.</li>
    </ul>
  </li>
  <li><strong>Equity</strong>
    <ul>
      <li>Costituzione e aumenti di capitale; strumenti ibridi (convertible notes, SAFE).</li>
      <li>Private equity e venture capital: quando e perché coinvolgerli.</li>
    </ul>
  </li>
  <li><strong>Capitale circolante</strong>
    <ul>
      <li>Definizione di Net Working Capital e indicatori chiave.</li>
      <li>Leve operative: inventario, politiche di credito e negoziazione con i fornitori.</li>
    </ul>
  </li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con schemi di stato patrimoniale e grafici sui volumi di crowdfunding.</li>
  <li>Esercitazione: calcola il fabbisogno di cassa di un caso reale e individua la migliore combinazione di fonti.</li>
  <li>Quiz di autovalutazione a fine modulo.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine della lezione saprai riconoscere la forma di finanziamento più adatta alla tua iniziativa, impostare un mix equilibrato tra capitale di rischio, debito e gestione del circolante, e preparare la documentazione necessaria per dialogare con banche, investitori o piattaforme di finanza alternativa.</p>'
WHERE "id" = '9d835faf-a677-4757-b771-443404e77d8b';

-- Lezione 3: Capitale di Ventura Early-Stage
UPDATE "public"."lessons" 
SET "content" = '<h2>Capitale di Ventura Early-Stage: FFF, Business Angel e Club Deal</h2>

<p>Il finanziamento early-stage è il carburante che permette alle startup di superare la &quot;valle della morte&quot; e di crescere fino ai round di venture capital. In questa lezione analizziamo le tre forme più diffuse di capitale di ventura nelle primissime fasi: <strong>Family, Friends &amp; Fools (FFF)</strong>, <strong>Business Angel</strong> – singoli o in network – e i <strong>Club Deal</strong> che raggruppano più investitori in un veicolo comune.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Comprendere ruolo, motivazioni e aspettative di FFF, Business Angel e Club Deal.</li>
  <li>Valutare rischi e ritorni del capitale di ventura early-stage e i principali metodi di valutazione delle startup.</li>
  <li>Conoscere il processo dall''identificazione del deal alla exit e le clausole chiave di tutela degli investitori.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Attori dell''early-stage</strong> – panoramica di dipendenti, imprenditori, advisor e investitori con focus su FFF e Angel (slide &quot;Comprendere gli attori&quot;).</li>
  <li><strong>Angel Investing</strong> – definizione, profilo degli angel, livelli di rischio elevati ma alto potenziale di rendimento.</li>
  <li><strong>Business Angel Group e Network</strong> – come si organizzano, servizi offerti e casi italiani (IAG, Club degli Investitori).</li>
  <li><strong>Club Deal &amp; Syndicate</strong> – modalità di sottoscrizione, ruoli (lead, co-investor) e pro/contro per gli investitori.</li>
  <li><strong>Valutare una startup</strong> – metodi pratici (Berkus, VC Method, Comparables) utilizzati quando mancano metriche storiche.</li>
  <li><strong>Due Diligence &amp; Term Sheet</strong> – tre pilastri della DD, clausole di protezione (tag along, drag along, liquidation preference, anti-dilution).</li>
  <li><strong>Dalla selezione all''exit</strong> – milestone, tranche di investimento, strategie di uscita (M&amp;A, IPO) e differenze fra investitore finanziario e industriale.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide infografiche su dimensione e distribuzione dei Business Angel in Italia.</li>
  <li>Esercitazione: applica il VC Method per stimare la pre-money di una startup e verificare l''impatto della diluizione.</li>
  <li>Role-play di negoziazione di un term-sheet con clausole tag/drag-along.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine della lezione saprai <strong>riconoscere la forma di capitale di ventura più adatta</strong> alla fase della tua startup, <strong>predisporre un processo di fundraising efficace</strong> (dalla due diligence alla firma del term-sheet) e <strong>negoziare un mix equilibrato tra valore pre-money, quota ceduta e clausole di tutela</strong> per favorire una exit di successo.</p>'
WHERE "id" = '15cb1013-736a-4050-81da-f63470fb631f';

-- Lezione 4: Venture Capital e Corporate VC
UPDATE "public"."lessons" 
SET "content" = '<h2>Venture Capital e Corporate Venture Capital</h2>

<p>Il <strong>venture capital (VC)</strong> è una forma di investimento in equity dedicata a imprese non quotate ad alto potenziale, con l''obiettivo di realizzare un importante guadagno in conto capitale al momento dell''exit (IPO o M&amp;A). Si tratta di <em>smart money</em>: oltre al capitale, porta competenze, network e governance.</p>

<p>Quando invece è una grande azienda a investire direttamente in startup, parliamo di <strong>Corporate Venture Capital (CVC)</strong>, strumento chiave di open innovation per stimolare nuova crescita, presidiare tecnologie emergenti e creare nuove linee di business.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Differenziare Venture Capital, Private Equity e altre fonti di finanziamento.</li>
  <li>Comprendere la struttura di un fondo VC, il ciclo di investimento e le metriche di ritorno.</li>
  <li>Analizzare motivazioni, modelli operativi e timing di un programma di Corporate Venture Capital.</li>
  <li>Valutare rischi, leggi di potenza e strategie di exit tipiche degli investimenti early-stage.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Raccolta di capitale aziendale</strong> – Mercati di debito vs equity, struttura del capitale.</li>
  <li><strong>Dati e considerazioni</strong> – Trend globali e italiani del VC, settori più finanziati.</li>
  <li><strong>Startup VC-Backed</strong> – Caratteristiche, due-diligence e criteri di selezione.</li>
  <li><strong>Ciclo di investimento, rischio e ritorni</strong> – Fundraising, investimento, disinvestimento; legge di potenza.</li>
  <li><strong>Corporate Venture Capital</strong> – Obiettivi strategici vs finanziari, timeline di diffusione, esempi in Italia.</li>
  <li><strong>Startup Studio e Venture Builder</strong> – Nuove logiche per creare startup in portafoglio e ridurre il rischio.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con grafici su funding globale, numero di deal e settori in crescita.</li>
  <li>Case study interattivi: comparare un fondo VC indipendente con un CVC (es. A2A, Eni, TIM).</li>
  <li>Esercitazione: progettare un term-sheet sintetico con clausole di protezione e opzioni di exit.</li>
  <li>Quiz di autovalutazione al termine del modulo.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine imparerai a:<br>
– Valutare quando il VC è la scelta di finanziamento corretta per una startup.<br>
– Costruire un portafoglio bilanciato, consapevole del principio di Pareto e della necessità di <em>outlier</em> per generare ritorni.<br>
– Impostare o dialogare con un Corporate Venture Capital, integrandone gli obiettivi strategici nella roadmap di innovazione aziendale.</p>'
WHERE "id" = '7928aefa-ad6a-4e40-9669-dc3fac96b694';

-- Lezione 5: Private Equity e Quotazione in Borsa
UPDATE "public"."lessons" 
SET "content" = '<h2>Private Equity e Quotazione in Borsa</h2>

<p>In questa lezione esploreremo due canali fondamentali di finanziamento e crescita per le imprese: il <strong>Private Equity</strong>, cioè il capitale di rischio destinato a società non quotate, e la <strong>Borsa</strong>, il mercato regolamentato in cui le aziende possono emettere titoli per raccogliere capitale e offrire liquidità ai propri azionisti. Analizzeremo caratteristiche, fasi operative, attori coinvolti e i principali vantaggi e responsabilità legati alla quotazione.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Definire il Private Equity e distinguerlo dal Venture Capital e da altre forme di capitale di rischio.</li>
  <li>Comprendere le fasi del processo di investimento in Private Equity: ricerca, acquisizione, gestione attiva ed exit.</li>
  <li>Identificare i principali attori: fondi di private equity, investitori istituzionali e individui ad alto patrimonio netto.</li>
  <li>Spiegare il funzionamento della Borsa e i requisiti per la quotazione su mercati regolamentati (Euronext Milan, Growth, STAR).</li>
  <li>Valutare benefici, svantaggi e responsabilità per le aziende quotate.</li>
  <li>Descrivere il processo di IPO: due diligence, costruzione del prospectus, roadshow e collocamento.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Introduzione al Private Equity</strong> – Definizione, caratteristiche principali e contesto di utilizzo.</li>
  <li><strong>Fasi operative del PE</strong> – Ricerca e selezione delle target, acquisizione, gestione attiva e strategie di exit.</li>
  <li><strong>Attori e modelli di governance</strong> – Fondi di PE, gestori di fondi, investitori istituzionali e advisor.</li>
  <li><strong>Introduzione alla Borsa</strong> – Funzione economica, strumenti negoziati e meccanismi di formazione dei prezzi.</li>
  <li><strong>Mercati di quotazione</strong> – Panoramica di Euronext Milan, Growth e Access; requisiti sostanziali e formali.</li>
  <li><strong>Vantaggi e svantaggi</strong> – Liquidità, visibilità, costo del capitale e obblighi informativi.</li>
  <li><strong>Processo di IPO</strong> – Due diligence, redazione del documento di ammissione, roadshow, collocamento e post-quotazione.</li>
  <li><strong>Casi studio</strong> – Esempi di PMI italiane quotate e principali exit di successo.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide illustrative con diagrammi dei flussi di investimento e timeline del processo IPO.</li>
  <li>Esercitazione: preparare un mini–prospectus per la quotazione di una startup fittizia.</li>
  <li>Discussione di gruppo: valutazione comparativa tra un''operazione di PE e un''IPO.</li>
  <li>Quiz di autovalutazione finale.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine della lezione saprai:</p>
<ul>
  <li>Selezionare la forma di raccolta di capitale più adatta alla fase di sviluppo della tua impresa.</li>
  <li>Pianificare le attività chiave per un''operazione di Private Equity o di quotazione in Borsa.</li>
  <li>Bilanciare opportunità e vincoli normativi, informativi e di governance.</li>
  <li>Dialogare con investitori, advisor e autorità di mercato per realizzare con successo l''operazione.</li>
</ul>'
WHERE "id" = '83c7ece5-809c-462b-b01e-0251d8613c82'; 