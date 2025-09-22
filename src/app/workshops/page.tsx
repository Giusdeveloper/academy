"use client";

import Link from "next/link";
import Image from "next/image";
import "./workshops.css";

export default function WorkshopsPage() {
  return (
    <div className="min-h-screen bg-[#0a1833]">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Workshop & Eventi</h1>
          <p className="hero-subtitle">
            Partecipa agli eventi partner più importanti del settore tech. 
            Impara direttamente dagli esperti e connettiti con la community.
          </p>
          <div className="hero-badges">
            <div className="hero-badge">
              <span className="badge-icon">🤝</span>
              <span>Eventi Partner</span>
            </div>
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <span>Networking</span>
            </div>
            <div className="hero-badge">
              <span className="badge-icon">🎯</span>
              <span>Tech Community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Perché partecipare ai nostri eventi</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Contenuti Pratici</h3>
              <p className="feature-description">
                Eventi focalizzati su strumenti e strategie immediatamente applicabili 
                nel tuo business quotidiano.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Esperti del Settore</h3>
              <p className="feature-description">
                Impara direttamente da professionisti con anni di esperienza nel mondo 
                delle startup e degli investimenti.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3 className="feature-title">Interattività</h3>
              <p className="feature-description">
                Sessioni coinvolgenti con Q&A, esercizi pratici e networking 
                con altri imprenditori e investitori della community tech.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Risultati Misurabili</h3>
              <p className="feature-description">
                Ogni evento è progettato per fornire strumenti concreti che puoi 
                implementare subito per accelerare la crescita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Events Section */}
      <section className="partner-events-section">
        <div className="container">
          <h2 className="section-title text-center">Eventi Partner</h2>
          <p className="section-subtitle text-center">
            Collaboriamo con le migliori community tech italiane per portarti eventi di altissimo livello
          </p>
          
          <div className="partner-event-featured">
            <div className="partner-event-card">
              <div className="partner-logo">
                <div className="logo-container">
                  <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>
              <div className="partner-event-content">
                <div className="partner-tag">Google Developer Groups Napoli</div>
                <h3 className="partner-event-title">Napoli DevFest 2025</h3>
                <p className="partner-event-description">
                  Il più grande evento tech di Napoli. Una giornata intera dedicata a intelligenza artificiale, 
                  gaming, robotica, startup e networking con ospiti internazionali e Alberto Giusti nella Startup Alley.
                </p>
                <div className="partner-event-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Data:</span>
                    <span className="detail-value">11 Ottobre 2025</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📍 Luogo:</span>
                    <span className="detail-value">Città della Scienza, Napoli</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🎫 Biglietti:</span>
                    <span className="detail-value">€10 - €50 (limitati)</span>
                  </div>
                </div>
                <a 
                  href="https://www.eventbrite.it/e/napoli-devfest-2025-by-google-developer-groups-napoli-tickets-1322454008539"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="partner-event-btn"
                >
                  Acquista Biglietti
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Imment Section - Hidden for now */}
      {/* 
      <section className="workshops-section">
        <div className="container">
          <h2 className="section-title text-center">Workshop Imment</h2>
          <p className="section-subtitle text-center">
            I nostri workshop esclusivi per accelerare la crescita della tua startup
          </p>
          <div className="workshops-grid">
            Workshop content hidden for now
          </div>
        </div>
      </section>
      */}

      {/* Workshop Format */}
      <section className="format-section">
        <div className="container">
          <div className="format-content">
            <h2 className="section-title">Formato degli Eventi</h2>
            <div className="format-grid">
              <div className="format-step">
                <div className="step-number">1</div>
                <h3 className="step-title">Teoria e Fondamenti</h3>
                <p className="step-description">
                  Introduzione ai concetti chiave e alle best practices del settore 
                  con esempi pratici e case study reali.
                </p>
              </div>
              <div className="format-step">
                <div className="step-number">2</div>
                <h3 className="step-title">Esercizi Pratici</h3>
                <p className="step-description">
                  Sessioni hands-on dove applichi immediatamente i concetti appresi 
                  al tuo progetto o business.
                </p>
              </div>
              <div className="format-step">
                <div className="step-number">3</div>
                <h3 className="step-title">Q&A e Networking</h3>
                <p className="step-description">
                  Momenti di confronto diretto con gli esperti e networking 
                  con altri partecipanti per scambiare esperienze.
                </p>
              </div>
              <div className="format-step">
                <div className="step-number">4</div>
                <h3 className="step-title">Follow-up e Supporto</h3>
                <p className="step-description">
                  Accesso a materiali aggiuntivi e supporto post-workshop 
                  per implementare quanto appreso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title text-center">Cosa dicono i partecipanti</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  &ldquo;Il workshop Smart Startup è stato illuminante. Ho finalmente capito 
                  come strutturare correttamente la mia startup e quali sono i passaggi 
                  per l&apos;iscrizione nella Sezione Speciale.&rdquo;
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4 className="author-name">Marco Rossi</h4>
                  <p className="author-role">Founder, TechStart</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  &ldquo;Workshop Smart Equity fantastico! Ho imparato a creare una Cap Table 
                  professionale e ora so esattamente come approcciare gli investitori. 
                  Consigliatissimo!&rdquo;
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4 className="author-name">Sofia Bianchi</h4>
                  <p className="author-role">CEO, InnovateLab</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  &ldquo;L&apos;Investor Pitch Workshop mi ha dato la sicurezza per presentare 
                  la mia startup. Il feedback degli esperti è stato preziosissimo 
                  per perfezionare il mio pitch.&rdquo;
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4 className="author-name">Alessandro Verdi</h4>
                  <p className="author-role">Founder, GreenTech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Pronto a partecipare?</h2>
            <p className="cta-subtitle">
              Partecipa ai nostri eventi partner e accelera la crescita della tua startup 
              con strumenti pratici e il supporto di esperti del settore.
            </p>
            <div className="cta-buttons">
              <Link href="/contacts" className="btn-primary">
                Contattaci per info
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
