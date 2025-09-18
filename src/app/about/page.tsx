"use client";

import Image from "next/image";
import Link from "next/link";
import "./about.css";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a1833]">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Chi siamo</h1>
          <p className="hero-subtitle">
            Ti aiutiamo a creare, finanziare e gestire la tua startup. 
            Il team di Imment si compone di esperti nell&apos;area Amministrazione, 
            Finanza e Controllo, specializzati nei più innovativi strumenti finanziari alternativi.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2 className="section-title">La nostra missione</h2>
            <p className="mission-text">
              La nostra missione è supportare founder e investitori nel loro percorso di crescita, 
              offrendo strumenti innovativi e competenze specializzate per creare, finanziare e 
              gestire startup di successo. Crediamo nel potere dell&apos;innovazione e nella forza 
              dell&apos;imprenditorialità italiana.
            </p>
            <div className="mission-stats">
              <div className="stat-item">
                <div className="stat-number">300</div>
                <div className="stat-label">Founder supportati</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">190</div>
                <div className="stat-label">Investitori attivi</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">€3MLN</div>
                <div className="stat-label">Fondi raccolti</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title text-center">I nostri servizi</h2>
          <div className="values-grid">
            <a 
              href="https://www.imment.it/smart-startup?_gl=1*y6xr68*_up*MQ..*_ga*MTMwMDQ0MzU5OS4xNzU3NTg4NjA0*_ga_NBNK7QK2TQ*czE3NTc1ODg2MDMkbzEkZzAkdDE3NTc1ODg2MDMkajYwJGwwJGgw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="value-card service-card"
            >
              <div className="value-icon">🏗️</div>
              <h3 className="value-title">Smart Startup</h3>
              <p className="value-description">
                Un percorso guidato, semplice e intuitivo per creare la tua startup. 
                Oggetti sociali innovativi, statuti per finanza smart e iscrizione nella Sezione Speciale.
              </p>
              <div className="service-link">Scopri di più →</div>
            </a>
            <a 
              href="https://www.imment.it/smart-equity?_gl=1*tju8yw*_up*MQ..*_ga*MTMwMDQ0MzU5OS4xNzU3NTg4NjA0*_ga_NBNK7QK2TQ*czE3NTc1ODg2MDMkbzEkZzAkdDE3NTc1ODg5ODYkajYwJGwwJGgw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="value-card service-card"
            >
              <div className="value-icon">💰</div>
              <h3 className="value-title">Smart Equity</h3>
              <p className="value-description">
                Un modello per raccogliere fondi e adottare un processo di crescita sistemica. 
                Cap Table, LOI, SFP e equity crowdfunding per raccogliere fondi in modo semplice.
              </p>
              <div className="service-link">Scopri di più →</div>
            </a>
            <a 
              href="https://www.imment.it/nursery-afc?_gl=1*12hpi8a*_up*MQ..*_ga*MTMwMDQ0MzU5OS4xNzU3NTg4NjA0*_ga_NBNK7QK2TQ*czE3NTc1ODg2MDMkbzEkZzAkdDE3NTc1ODkwMDEkajQ1JGwwJGgw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="value-card service-card"
            >
              <div className="value-icon">📊</div>
              <h3 className="value-title">Nursery AFC</h3>
              <p className="value-description">
                Un sistema pensato per semplificare la gestione dei processi di Amministrazione, 
                Finanza e Controllo. Fatturazione, contabilità, cash flow e controllo di gestione.
              </p>
              <div className="service-link">Scopri di più →</div>
            </a>
            <a 
              href="https://www.imment.it/work-for-equity?_gl=1*17iiv67*_up*MQ..*_ga*MTMwMDQ0MzU5OS4xNzU3NTg4NjA0*_ga_NBNK7QK2TQ*czE3NTc1ODg2MDMkbzEkZzAkdDE3NTc1ODkwMTMkajMzJGwwJGgw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="value-card service-card"
            >
              <div className="value-icon">👥</div>
              <h3 className="value-title">Smart People</h3>
              <p className="value-description">
                Attira le migliori risorse con il work for equity.                 Piani di work for equity, 
                vesting e strumenti finanziari partecipativi per valorizzare l&apos;impegno.
              </p>
              <div className="service-link">Scopri di più →</div>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title text-center">I nostri risultati</h2>
          <p className="team-subtitle">
            Le voci di founder e investitori che hanno scelto di affidarsi alle competenze degli esperti Imment.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <Image
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&h=400&q=80"
                  alt="Valeria Martone - Founder"
                  width={400}
                  height={400}
                  className="member-img"
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">Valeria Martone</h3>
                <p className="member-role">26 anni, founder</p>
                <p className="member-bio">
                  &ldquo;Il servizio Smart Startup di Imment è stato fondamentale per la nostra startup di materiali sostenibili, 
                  offrendo supporto nella gestione amministrativa e contabile e permettendoci di concentrarci sull&apos;innovazione.&rdquo;
                </p>
              </div>
            </div>
            <div className="team-member">
              <div className="member-image">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80"
                  alt="Ernesto Cialdini - Investitore"
                  width={400}
                  height={400}
                  className="member-img"
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">Ernesto Cialdini</h3>
                <p className="member-role">62 anni, investitore</p>
                <p className="member-bio">
                  &ldquo;Grazie a Imment, ho trovato un partner ideale per individuare e valutare nuove prospettive d&apos;investimento. 
                  La piattaforma offre strumenti innovativi e supporto esperto.&rdquo;
                </p>
              </div>
            </div>
            <div className="team-member">
              <div className="member-image">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80"
                  alt="Roberto Pinerolo - Founder"
                  width={400}
                  height={400}
                  className="member-img"
                />
              </div>
              <div className="member-info">
                <h3 className="member-name">Roberto Pinerolo</h3>
                <p className="member-role">35 anni, founder</p>
                <p className="member-bio">
                  &ldquo;Imment è stato un partner eccezionale. Hanno semplificato tutto il processo di creazione della nostra startup, 
                  dall&apos;amministrazione alla gestione dei rapporti con gli investitori.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Contatta uno dei nostri esperti</h2>
            <p className="cta-subtitle">
              Il team di Imment si compone di esperti nell&apos;area Amministrazione, Finanza e Controllo, 
              specializzati nei più innovativi strumenti finanziari alternativi. Confrontati con noi.
            </p>
            <div className="cta-buttons">
              <Link href="/contacts" className="btn-primary">
                Contattaci
              </Link>
              <Link href="/courses" className="btn-secondary">
                Scopri i corsi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3 className="footer-title">Academy Imment</h3>
            <div className="footer-imment-logo">
              <Image 
                src="/Imment - logo - web_orizzontale - colori - chiaro.png"
                alt="Imment Logo"
                width={120}
                height={40}
                className="imment-logo"
              />
            </div>
          </div>
          
          <div className="footer-info">
            <p>Imment S.r.l.</p>
            <p>Partita Iva 12804470016</p>
            <p>Sede Operativa: Piazza Teresa Noce 17/D - 10155 Torino</p>
            <div className="footer-links">
              <Link href="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
