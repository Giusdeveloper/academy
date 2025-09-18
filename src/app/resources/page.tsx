'use client';

import Link from 'next/link';
import Image from 'next/image';
import './resources.css';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#0a1833]">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Risorse</h1>
          <p className="hero-subtitle">
            Accedi a documenti, guide, template e materiali utili per il tuo percorso di crescita imprenditoriale
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Categorie di Risorse</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>Documenti e Guide</h3>
              <p>Business plan, pitch deck, modelli finanziari e guide pratiche</p>
              <span className="resource-count">12 risorse</span>
            </div>

            <div className="category-card">
              <div className="category-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3>Template e Modelli</h3>
              <p>Strumenti pronti all&apos;uso per accelerare il tuo business</p>
              <span className="resource-count">8 risorse</span>
            </div>

            <div className="category-card">
              <div className="category-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Video e Webinar</h3>
              <p>Contenuti video formativi e registrazioni di webinar</p>
              <span className="resource-count">15 risorse</span>
            </div>

            <div className="category-card">
              <div className="category-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3>Analisi e Report</h3>
              <p>Studi di mercato, analisi settoriali e report di settore</p>
              <span className="resource-count">6 risorse</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Risorse in Evidenza</h2>
          <div className="featured-grid">
            <div className="featured-card">
              <div className="featured-image">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&q=80"
                  alt="Business Plan Template"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover"
                />
                <div className="featured-badge">Più Scaricato</div>
              </div>
              <div className="featured-content">
                <h3>Template Business Plan Completo</h3>
                <p>Modello professionale per creare il tuo business plan in modo strutturato e convincente</p>
                <div className="featured-meta">
                  <span className="resource-type">PDF</span>
                  <span className="resource-size">2.3 MB</span>
                  <span className="downloads">1,247 download</span>
                </div>
                <button className="download-btn">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Scarica Gratis
                </button>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image">
                <Image
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop&q=80"
                  alt="Pitch Deck Template"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover"
                />
                <div className="featured-badge">Nuovo</div>
              </div>
              <div className="featured-content">
                <h3>Pitch Deck per Startup</h3>
                <p>Template PowerPoint per presentazioni efficaci a investitori e partner</p>
                <div className="featured-meta">
                  <span className="resource-type">PPTX</span>
                  <span className="resource-size">5.1 MB</span>
                  <span className="downloads">892 download</span>
                </div>
                <button className="download-btn">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Scarica Gratis
                </button>
              </div>
            </div>

            <div className="featured-card">
              <div className="featured-image">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&q=80"
                  alt="Financial Model"
                  width={400}
                  height={250}
                  className="w-full h-full object-cover"
                />
                <div className="featured-badge">Premium</div>
              </div>
              <div className="featured-content">
                <h3>Modello Finanziario Excel</h3>
                <p>Foglio di calcolo completo per proiezioni finanziarie e analisi di sostenibilità</p>
                <div className="featured-meta">
                  <span className="resource-type">XLSX</span>
                  <span className="resource-size">1.8 MB</span>
                  <span className="downloads">654 download</span>
                </div>
                <button className="download-btn premium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Scarica Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All Resources */}
      <section className="all-resources-section">
        <div className="container">
          <div className="resources-header">
            <h2 className="section-title">Tutte le Risorse</h2>
            <div className="filter-tabs">
              <button className="filter-tab active">Tutte</button>
              <button className="filter-tab">Documenti</button>
              <button className="filter-tab">Template</button>
              <button className="filter-tab">Video</button>
              <button className="filter-tab">Report</button>
            </div>
          </div>

          <div className="resources-grid">
            <div className="resource-item">
              <div className="resource-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="resource-info">
                <h3>Guida al Fundraising</h3>
                <p>Strategie e best practices per raccogliere capitali</p>
                <div className="resource-meta">
                  <span className="resource-type">PDF</span>
                  <span className="resource-size">1.2 MB</span>
                </div>
              </div>
              <button className="resource-download" aria-label="Scarica Guida al Fundraising">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                </svg>
              </button>
            </div>

            <div className="resource-item">
              <div className="resource-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="resource-info">
                <h3>Template Contratto Co-fondatore</h3>
                <p>Modello legale per accordi tra co-fondatori</p>
                <div className="resource-meta">
                  <span className="resource-type">DOCX</span>
                  <span className="resource-size">0.8 MB</span>
                </div>
              </div>
              <button className="resource-download" aria-label="Scarica Template Contratto Co-fondatore">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                </svg>
              </button>
            </div>

            <div className="resource-item">
              <div className="resource-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="resource-info">
                <h3>Webinar: Marketing Digitale</h3>
                <p>Strategie di marketing per startup digitali</p>
                <div className="resource-meta">
                  <span className="resource-type">MP4</span>
                  <span className="resource-size">245 MB</span>
                </div>
              </div>
              <button className="resource-download" aria-label="Scarica Webinar Marketing Digitale">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                </svg>
              </button>
            </div>

            <div className="resource-item">
              <div className="resource-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="resource-info">
                <h3>Report Fintech 2024</h3>
                <p>Analisi del mercato fintech italiano</p>
                <div className="resource-meta">
                  <span className="resource-type">PDF</span>
                  <span className="resource-size">3.1 MB</span>
                </div>
              </div>
              <button className="resource-download" aria-label="Scarica Report Fintech 2024">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                </svg>
              </button>
            </div>

            <div className="resource-item">
              <div className="resource-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="resource-info">
                <h3>Template NDA</h3>
                <p>Accordo di riservatezza standard</p>
                <div className="resource-meta">
                  <span className="resource-type">DOCX</span>
                  <span className="resource-size">0.5 MB</span>
                </div>
              </div>
              <button className="resource-download" aria-label="Scarica Template NDA">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                </svg>
              </button>
            </div>

            <div className="resource-item">
              <div className="resource-icon">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="resource-info">
                <h3>Guida GDPR per Startup</h3>
                <p>Compliance e privacy per nuove imprese</p>
                <div className="resource-meta">
                  <span className="resource-type">PDF</span>
                  <span className="resource-size">1.8 MB</span>
                </div>
              </div>
              <button className="resource-download" aria-label="Scarica Guida GDPR per Startup">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Non trovi quello che cerchi?</h2>
            <p>Contattaci per richiedere risorse specifiche o per ricevere supporto personalizzato</p>
            <div className="cta-buttons">
              <Link href="/contacts" className="btn-primary">
                Contattaci
              </Link>
              <Link href="/courses" className="btn-secondary">
                Esplora i Corsi
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
