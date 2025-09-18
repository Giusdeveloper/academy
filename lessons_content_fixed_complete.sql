-- Script per correggere il contenuto di tutte le lezioni
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