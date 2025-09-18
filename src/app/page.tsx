"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import "./homepage.css";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="homepage">
      {/* HERO SECTION */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Academy Imment
          </h1>
          
          <p className="hero-subtitle">
            Accendi la tua carriera imprenditoriale
          </p>
          
          <div className="button-group">
            <button
              className="btn-primary"
              onClick={() => router.push("/courses")}
            >
              Scopri i percorsi
            </button>
          </div>
        </div>
      </header>

      {/* CHI SIAMO */}
      <section className="section about-section">
        <div className="about-content">
          <h2 className="about-title">Chi siamo</h2>
          <p className="about-text">
            Academy Imment forma la nuova generazione di imprenditori e investitori con percorsi agili, pratici e verticali.
          </p>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&h=400&q=80"
          alt="Team Academy Imment - Professionisti che lavorano insieme"
          width={600}
          height={400}
          className="about-image"
          priority
        />
      </section>

      {/* I NOSTRI PERCORSI */}
      <section className="section section-large courses-section">
        <h2 className="section-title">I nostri percorsi</h2>
        <div className="courses-grid">
          <div className="course-card">
            <div className="course-image-container">
              <Image
                src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=192&q=80"
                alt="Corso di esempio"
                width={400}
                height={192}
                className="course-image"
                style={{ width: 'auto', height: 'auto' }}
              />
              <div className="course-image-overlay"></div>
            </div>
            <div className="course-content">
              <div className="course-icon">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="course-title">Corso di Test</h3>
              <p className="course-description">
                Questo è un corso di test per verificare che il sito funzioni correttamente.
              </p>
              <div className="course-meta">
                <div className="course-meta-item">
                  <svg className="course-meta-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  10 ore
                </div>
                <div className="course-meta-item">
                  <svg className="course-meta-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Principiante
                </div>
              </div>
              <div className="course-footer">
                <span className="course-price">€99</span>
                <button 
                  className="btn-course"
                  onClick={() => router.push("/courses")}
                >
                  Scopri di più
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKSHOP LIVE */}
      <section className="section section-large workshop-section">
        <h2 className="section-title">Workshop live</h2>
        <div className="workshop-grid">
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
              <button 
                className="workshop-btn"
                onClick={() => router.push("/workshops")}
              >
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
              <button 
                className="workshop-btn"
                onClick={() => router.push("/workshops")}
              >
                Iscriviti al Workshop
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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