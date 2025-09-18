-- PARTE 3: Correzione delle ultime 3 lezioni (11-13)
-- Rimozione dei riferimenti malformati e correzione della formattazione HTML

-- Lezione 11: Fundraising tramite Criptovalute e Token Offering
UPDATE "public"."lessons" 
SET "content" = '<h2>Fundraising tramite Criptovalute e Token Offering</h2>

<p>In questa lezione esploreremo come le criptovalute e la tecnologia blockchain abbiano aperto nuovi modelli di raccolta fondi, dalle ICO (Initial Coin Offering) alle IEO, IDO e STO, fino alle opportunità offerte da DeFi e DAO per finanziare progetti innovativi. Analizzeremo i meccanismi di funzionamento, i vantaggi, i rischi e i casi di studio più rilevanti.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Capire i fondamenti di moneta, criptovalute e blockchain come infrastruttura per il fundraising.</li>
  <li>Distinguere tra i diversi metodi di raccolta fondi: ICO, IEO, IDO e Security Token Offering (STO).</li>
  <li>Conoscere il ruolo di smart contract, tokenomics e meccanismi di governance (DAO) nel garantire trasparenza e automazione.</li>
  <li>Valutare opportunità, rischi e vincoli normativi legati al fundraising cripto.</li>
  <li>Analizzare casi di successo come CryptoKitties e le principali piattaforme di launchpad.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Cos''è la moneta e la criptovaluta</strong> – definizione, proprietà e storia della moneta; evoluzione verso le valute digitali (pagg. 3–6).</li>
  <li><strong>Blockchain e smart contract</strong> – architettura distribuita, proof-of-work vs proof-of-stake, modello dei contratti auto-eseguiti (pagg. 15–17, 40–41).</li>
  <li><strong>Decentralized Finance (DeFi) e DAO</strong> – ecosistema DeFi, organizzazioni autonome decentralizzate, modelli di governance (pagg. 42–43).</li>
  <li><strong>Exchanges e wallet</strong> – differenza tra CEX/DEX, wallet custodial vs non-custodial, onboarding operativo (pagg. 27–29).</li>
  <li><strong>Token e tokenomics</strong> – tipologie di token (utility, security, stablecoin, governance), design di offerta e distribuzione (pagg. 45–48).</li>
  <li><strong>Metodi di raccolta fondi</strong> – strutture e differenze di ICO, IEO, IDO e STO; flussi operativi e piattaforme di launchpad (pagg. 49–51).</li>
  <li><strong>Casi di studio</strong> – CryptoKitties e altri esempi significativi di successo e insuccesso (pagg. 50–51).</li>
  <li><strong>Opportunità e rischi</strong> – analisi pro/contro: trasparenza, costi, scalabilità, regolamentazione e sicurezza (pagg. 36–39).</li>
  <li><strong>Applicazioni manageriali</strong> – settori di impiego della blockchain per fundraising (filiera, non-profit, arte, gaming, IoT) (pagg. 52–53).</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con diagrammi di tokenomics, workflow di smart contract e confronto PoW/PoS.</li>
  <li>Esercitazione: progettare il tokenomics di un progetto e simulare una ICO (cap, discount, lock-up).</li>
  <li>Laboratorio: configurazione di un wallet e simulazione di acquisto/vendita su un testnet DEX.</li>
  <li>Case study guidato sui fattori di successo di una IEO lanciata su un exchange centrale.</li>
  <li>Quiz di autovalutazione sui concetti chiave e sui meccanismi di fundraising cripto.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine della lezione sarai in grado di valutare se e come integrare le criptovalute nel tuo piano di raccolta fondi, scegliere il modello di emissione token più adatto, progettare la tokenomics e gestire i rischi operativi e normativi connessi a un''iniziativa di fundraising basata su blockchain.</p>'
WHERE "id" = '1b3b6e71-0188-414e-8514-48dc2c5973ac';

-- Lezione 12: Metriche - Aziende tradizionali vs Startup
UPDATE "public"."lessons" 
SET "content" = '<h2>Metriche: Aziende tradizionali vs Startup</h2>

<p>In questa lezione esamineremo le principali metriche utilizzate per valutare performance e sostenibilità finanziaria di aziende tradizionali e startup. Analizzeremo definizioni, indicatori chiave, differenze operative e come scegliere le metriche più adatte in base alla fase di crescita e al modello di business.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Comprendere le differenze fondamentali tra metriche aziendali tradizionali e metriche specifiche per startup</li>
  <li>Apprendere definizioni, formule e interpretazioni di metriche come EBITDA, ROI, Quick Ratio, MRR, CAC, LTV e altre</li>
  <li>Esplorare l''evoluzione delle metriche lungo il ciclo di vita di un''impresa e di una startup</li>
  <li>Imparare a selezionare e applicare le metriche più rilevanti per supportare decisioni strategiche e finanziarie</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Introduzione e definizioni</strong> – Differenze tra azienda tradizionale e startup; ciclo di vita e approcci metrici.</li>
  <li><strong>Metriche finanziarie per aziende tradizionali</strong> – Fatturato, EBITDA, EBIT, margine netto, ROI, OCF, Quick Ratio e Current Ratio.</li>
  <li><strong>Metriche chiave per startup</strong> – MRR, ARR, ARPA, CAC, LTV, churn rate, burn rate, TAM e metriche di engagement (DAU, MAU).</li>
  <li><strong>Confronto e casi pratici</strong> – Differenze di approccio tra azienda e startup e applicazioni reali.</li>
  <li><strong>Approfondimenti</strong> – Investment Readiness Level e sperimentazione di metriche tramite esperimenti di validazione.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con tavole riassuntive e tabelle comparative (pagg. 14–23, 33–38)</li>
  <li>Esercitazione: calcolo e interpretazione di metriche aziendali e startup su casi di studio reali</li>
  <li>Workshop: definizione di un esperimento di validazione di metriche per un progetto startup (landing page, funnel di acquisition e activation)</li>
  <li>Quiz finale di autovalutazione sulle metriche descritte</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine della lezione saprai selezionare e calcolare le metriche più adatte per il tuo modello di business, interpretare i risultati per guidare decisioni strategiche e applicare sperimentazioni pratiche per validare ipotesi metriche in contesti reali.</p>'
WHERE "id" = 'ba22a952-15fb-4e0e-a3d7-57445cae2598';

-- Lezione 13: Valutazione - Aziende tradizionali vs Startup
UPDATE "public"."lessons" 
SET "content" = '<h2>Valutazione: Aziende tradizionali vs Startup</h2>

<p>La valutazione è il processo di determinazione del valore economico di un''impresa, che assume forme differenti a seconda che si tratti di aziende consolidate o di startup in fase early-stage. In questa lezione esamineremo i principi, i metodi e i principali rischi della valuation, confrontando approcci basati su flussi di cassa e asset tangibili con tecniche fondate su crescita, traction e scenari multipli tipiche delle startup.</p>

<h3>Obiettivi della lezione</h3>
<ul>
  <li>Fornire una comprensione approfondita dei metodi di valutazione per aziende tradizionali (DCF, multipli, NAV, comparables) e per startup (VC Method, First Chicago, multipli di ricavi, Terminal Value, Berkus, Scorecard).</li>
  <li>Illustrare gli aspetti pratici necessari per stimare correttamente il valore di un''impresa, dalla proiezione dei flussi di cassa alla negoziazione del fair price.</li>
  <li>Evidenziare le differenze operative e i rischi associati alla valutazione di aziende mature rispetto a imprese ad alto potenziale ma caratterizzate da incertezza e asset intangibili.</li>
  <li>Analizzare le implicazioni per investitori e founder, incluse strategie di fundraising e exit planning.</li>
</ul>

<h3>Struttura del modulo</h3>
<ol>
  <li><strong>Introduzione e principi fondamentali</strong> – definizione della valuation, scopi, rischi e limiti dei metodi tradizionali.</li>
  <li><strong>Valutazione delle aziende tradizionali</strong>
    <ul>
      <li><em>Metodo DCF</em> – attualizzazione dei flussi di cassa futuri.</li>
      <li><em>Metodo dei Multipli di Mercato</em> – EV/EBITDA, P/E, EV/Vendite.</li>
      <li><em>Metodo NAV</em> – calcolo del valore netto degli asset.</li>
      <li><em>Metodo dei Comparables</em> – analisi comparativa con aziende simili.</li>
    </ul>
  </li>
  <li><strong>Valutazione delle startup</strong>
    <ul>
      <li><em>Metodo del Venture Capital</em> – valore all''exit e ROI target.</li>
      <li><em>Metodo First Chicago</em> – scenari multipli e valore atteso.</li>
      <li><em>Multipli di Ricavi</em> – applicazione a ricavi previsti.</li>
      <li><em>Terminal Value</em> – stima del valore residuo al termine del periodo esplicito.</li>
      <li><em>Metodo Berkus</em> – valutazione qualitativa per fattori chiave.</li>
      <li><em>Metodo Scorecard</em> – confronto ponderato con la startup media di settore.</li>
    </ul>
  </li>
  <li><strong>Confronto e considerazioni finali</strong> – differenze tra approcci tradizionali e startup, importanza della negoziazione del prezzo e del contesto di mercato.</li>
</ol>

<h3>Materiali e attività</h3>
<ul>
  <li>Slide con diagrammi dei vari metodi di valuation e infografiche comparative.</li>
  <li>Esercitazione pratica: calcolo di un DCF e di multipli di mercato su un caso aziendale.</li>
  <li>Workshop: applicare il VC Method e il First Chicago a uno scenario startup.</li>
  <li>Simulazione di una negoziazione di fair price tra founder e investitori.</li>
  <li>Quiz di autovalutazione su tutti i metodi trattati.</li>
</ul>

<h3>Conclusioni</h3>
<p>Al termine della lezione saprai:</p>
<ul>
  <li>Distinguere e applicare i principali metodi di valuation per aziende tradizionali e startup.</li>
  <li>Calcolare e interpretare valori tramite DCF, multipli, NAV, comparables, VC Method, First Chicago, multipli di ricavi, Terminal Value, Berkus e Scorecard.</li>
  <li>Analizzare punti di forza e limiti di ciascun approccio in relazione a contesto, dati disponibili e obiettivi di investimento o exit.</li>
  <li>Guidare con cognizione di causa la negoziazione di un fair price con stakeholder e investitori.</li>
</ul>'
WHERE "id" = 'ed8d78a0-f492-4a1d-a361-dece5c39d95e'; 