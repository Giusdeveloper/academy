"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedEvents } from "@/lib/events";
import EventCard from "@/components/EventCard";
import "./workshops.css";

export default function WorkshopsPage() {
  const featuredEvents = getFeaturedEvents();

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
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="featured" />
              ))
            ) : (
              <div className="partner-event-card">
                <div className="partner-event-content">
                  <p className="partner-event-description">
                    Nessun evento disponibile al momento. Torna presto per scoprire i prossimi eventi!
                  </p>
                </div>
              </div>
            )}
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
