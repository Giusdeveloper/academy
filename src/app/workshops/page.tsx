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
          <h1 className="hero-title">Workshop Live</h1>
          <p className="hero-subtitle">
            Partecipa ai nostri workshop interattivi e impara direttamente dagli esperti 
            di Imment. Sessioni pratiche e coinvolgenti per accelerare la tua crescita imprenditoriale.
          </p>
        </div>
      </section>

      {/* Workshop Features */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Perché scegliere i nostri workshop</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Contenuti Pratici</h3>
              <p className="feature-description">
                Workshop focalizzati su strumenti e strategie immediatamente applicabili 
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
                con altri imprenditori e investitori.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3 className="feature-title">Risultati Misurabili</h3>
              <p className="feature-description">
                Ogni workshop è progettato per fornire strumenti concreti che puoi 
                implementare subito per accelerare la crescita.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Workshops */}
      <section className="workshops-section">
        <div className="container">
          <h2 className="section-title text-center">Prossimi Workshop</h2>
          <div className="workshops-grid">
            <div className="workshop-card">
              <div className="workshop-image">
                <Image
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=250&q=80"
                  alt="Smart Startup Workshop"
                  width={400}
                  height={250}
                  className="workshop-img"
                />
                <div className="workshop-badge">Prossimamente</div>
              </div>
              <div className="workshop-content">
                <h3 className="workshop-title">Smart Startup: Crea la tua startup innovativa</h3>
                <p className="workshop-description">
                  Workshop completo per creare la tua startup con oggetti sociali innovativi, 
                  statuti ottimizzati e iscrizione nella Sezione Speciale.
                </p>
                <div className="workshop-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>15 Marzo 2024</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span>14:00 - 18:00</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>Online + Torino</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>Max 20 partecipanti</span>
                  </div>
                </div>
                <div className="workshop-price">
                  <span className="price">€299</span>
                  <span className="price-note">Early bird: €199</span>
                </div>
                <button className="workshop-btn">
                  Iscriviti al Workshop
                </button>
              </div>
            </div>

            <div className="workshop-card">
              <div className="workshop-image">
                <Image
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&h=250&q=80"
                  alt="Smart Equity Workshop"
                  width={400}
                  height={250}
                  className="workshop-img"
                />
                <div className="workshop-badge">Prossimamente</div>
              </div>
              <div className="workshop-content">
                <h3 className="workshop-title">Smart Equity: Raccogli fondi per la tua startup</h3>
                <p className="workshop-description">
                  Impara a utilizzare Cap Table, LOI, SFP e equity crowdfunding per raccogliere 
                  fondi in modo efficace e sistemico.
                </p>
                <div className="workshop-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>22 Marzo 2024</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span>14:00 - 18:00</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>Online + Torino</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>Max 20 partecipanti</span>
                  </div>
                </div>
                <div className="workshop-price">
                  <span className="price">€399</span>
                  <span className="price-note">Early bird: €299</span>
                </div>
                <button className="workshop-btn">
                  Iscriviti al Workshop
                </button>
              </div>
            </div>

            <div className="workshop-card">
              <div className="workshop-image">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&h=250&q=80"
                  alt="Investor Pitch Workshop"
                  width={400}
                  height={250}
                  className="workshop-img"
                />
                <div className="workshop-badge">Prossimamente</div>
              </div>
              <div className="workshop-content">
                <h3 className="workshop-title">Investor Pitch: Presenta la tua startup</h3>
                <p className="workshop-description">
                  Workshop intensivo per creare e perfezionare il tuo pitch agli investitori. 
                  Struttura, storytelling e tecniche di presentazione.
                </p>
                <div className="workshop-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>29 Marzo 2024</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏰</span>
                    <span>14:00 - 18:00</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>Online + Torino</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>Max 15 partecipanti</span>
                  </div>
                </div>
                <div className="workshop-price">
                  <span className="price">€249</span>
                  <span className="price-note">Early bird: €199</span>
                </div>
                <button className="workshop-btn">
                  Iscriviti al Workshop
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Format */}
      <section className="format-section">
        <div className="container">
          <div className="format-content">
            <h2 className="section-title">Formato dei Workshop</h2>
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
              Iscriviti ai nostri workshop e accelera la crescita della tua startup 
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
