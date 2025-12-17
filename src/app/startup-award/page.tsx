"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import "./startup-award.css";

export default function StartupAwardPage() {
  const router = useRouter();

  const handleActivate = () => {
    // Porta alla pagina di registrazione con parametro per identificare che viene da startup-award
    router.push("/register?from=startup-award");
  };

  return (
    <div className="startup-award-page">
      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Startup Award
          </h1>
          
          <p className="hero-subtitle">
            Hai ricevuto accesso a uno Startup Award progettato da Imment per supportare la crescita reale della tua startup.
            Un percorso strutturato che unisce strategia, formazione avanzata e confronto diretto con investitori.
          </p>
          
          <div className="button-group">
            <button
              className="btn-primary"
              onClick={handleActivate}
            >
              Inizia il percorso
            </button>
          </div>
          
          <p className="hero-microcopy">
            Accesso riservato alle startup selezionate.
          </p>
        </div>
      </header>

      {/* SEZIONE: Cos'è il percorso */}
      <section className="section about-section">
        <div className="about-content">
          <h2 className="about-title">Uno Startup Award strutturato in tre fasi</h2>
          <p className="about-text">
            Questo Startup Award non è un singolo corso, ma un percorso completo progettato da Imment per accompagnare le startup finaliste in una fase chiave del loro sviluppo.
          </p>
          <p className="about-text">
            Il premio è articolato in <strong>tre fasi progressive</strong>, pensate per aiutarti a:
          </p>
          <ul className="about-list">
            <li>strutturare la strategia</li>
            <li>rafforzare le competenze</li>
            <li>prepararti al confronto con investitori reali</li>
          </ul>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&h=400&q=80"
          alt="Startup Award - Percorso formativo per founder finalisti su strategia, finanza e crescita startup"
          width={600}
          height={400}
          className="about-image"
          priority
        />
      </section>

      {/* SEZIONE: Cosa include */}
      <section className="section section-large features-section">
        <h2 className="section-title">Cosa include</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <h3 className="feature-title">Corsi esclusivi</h3>
            <p className="feature-description">
              Un percorso formativo avanzato di <strong>25 ore</strong> su finanza, fundraising ed equity, che combina lezioni didattiche e contributi di investitori, founder e professionisti.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="feature-title">Mentorship</h3>
            <p className="feature-description">
              Sessioni dedicate con esperti Imment per lavorare sulla struttura strategica della startup e sulle scelte chiave di crescita.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.311-.06m8.07 8.07a14.9 14.9 0 01-3.664 1.386 14.94 14.94 0 01-1.386-3.664m8.07 8.07a6 6 0 01-7.38-5.84v-4.8m0 0c0 .24-.018.47-.051.7m.051-.7a6 6 0 017.38-5.84h4.8m-4.8 0a14.927 14.927 0 012.58-5.84m-2.699 2.7a14.926 14.926 0 00-5.841-2.58m0 0a14.94 14.94 0 00-1.386 3.664M9.75 9.75a14.9 14.9 0 00-3.664-1.386 14.94 14.94 0 00-1.386 3.664m8.07 8.07a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58" />
              </svg>
            </div>
            <h3 className="feature-title">Network</h3>
            <p className="feature-description">
              Confronto diretto con business angel e professionisti del settore, all&apos;interno di un contesto selezionato e qualificato.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="feature-title">Risorse esclusive</h3>
            <p className="feature-description">
              Materiali, strumenti e framework utilizzati nei percorsi Imment, riservati alle startup partecipanti allo Startup Award.
            </p>
          </div>
        </div>
      </section>

      {/* SEZIONE: Come funziona */}
      <section className="section section-large process-section">
        <h2 className="section-title">Come funziona</h2>
        
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <h3 className="step-title">Equity Design Session</h3>
            <p className="step-description">
              Il percorso inizia con una sessione strategica individuale con un esperto Imment, dedicata alla progettazione della strategia di equity e fundraising della tua startup.
            </p>
          </div>

          <div className="process-step">
            <div className="step-number">2</div>
            <h3 className="step-title">Masterclass in Finanza & Fundraising</h3>
            <p className="step-description">
              Accedi a un corso strutturato di <strong>25 ore</strong> che approfondisce i temi chiave della finanza startup e della raccolta di capitali, con un approccio pratico e orientato al mercato.
            </p>
          </div>

          <div className="process-step">
            <div className="step-number">3</div>
            <h3 className="step-title">Workshop con Business Angel</h3>
            <p className="step-description">
              Partecipa a un workshop di confronto diretto con business angel, focalizzato su strategia di mercato, pitch e preparazione al dialogo con investitori.
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="cta-section">
        <div className="section">
          <div className="cta-content">
            <h2 className="cta-title">Ora puoi attivare il tuo Startup Award</h2>
            <p className="cta-subtitle">
              Il premio è già tuo.
              Attivando il percorso potrai accedere a tutte le fasi previste e iniziare a lavorare concretamente sulla crescita della tua startup.
            </p>
            <div className="button-group">
              <button
                className="btn-primary btn-large"
                onClick={handleActivate}
              >
                Inizia il percorso
              </button>
            </div>
            <p className="cta-microcopy">
              Percorso strutturato • Premio Imment • Accesso riservato
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

