'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useResources } from '@/hooks/useResources';
import { Resource, ResourceFilters, ResourceType, ResourceCategory } from '@/types/resources';
import { RESOURCE_TYPE_LABELS } from '@/types/resources';
import './resources.css';

export default function ResourcesPage() {
  const { 
    loading, 
    error, 
    fetchResources, 
    fetchFeaturedResources, 
    trackView, 
    trackDownload 
  } = useResources();

  const [featuredResources, setFeaturedResources] = useState<Resource[]>([]);
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [filters, setFilters] = useState<ResourceFilters>({});
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Carica risorse featured
  useEffect(() => {
    const loadFeaturedResources = async () => {
      try {
        const featured = await fetchFeaturedResources(6);
        setFeaturedResources(featured);
      } catch (err) {
        console.error('Errore nel caricamento delle risorse featured:', err);
      }
    };

    loadFeaturedResources();
  }, [fetchFeaturedResources]);

  // Carica tutte le risorse
  useEffect(() => {
    const loadAllResources = async () => {
      try {
        const response = await fetchResources(filters, undefined, currentPage, 12);
        setAllResources(response.resources);
        setTotalPages(response.total_pages);
      } catch (err) {
        console.error('Errore nel caricamento delle risorse:', err);
      }
    };

    loadAllResources();
  }, [fetchResources, filters, currentPage]);

  // Gestione filtri
  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilter(value);
    setCurrentPage(1);

    if (value === 'all') {
      setFilters({});
    } else if (filterType === 'type') {
      setFilters({ ...filters, type: [value as ResourceType] });
    } else if (filterType === 'category') {
      setFilters({ ...filters, category: [value as ResourceCategory] });
    }
  };

  // Gestione ricerca
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ ...filters, search: query });
    setCurrentPage(1);
  };

  // Gestione download
  const handleDownload = async (resource: Resource) => {
    try {
      // Traccia il download
      await trackDownload(resource.id);
      
      // Apri il file in una nuova finestra
      window.open(resource.file_url, '_blank');
    } catch (err) {
      console.error('Errore nel download:', err);
    }
  };

  // Gestione visualizzazione
  const handleView = async (resource: Resource) => {
    try {
      await trackView(resource.id);
    } catch (err) {
      console.error('Errore nel tracking della visualizzazione:', err);
    }
  };

  // Formatta dimensione file
  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Formatta numero
  const formatNumber = (num: number): string => {
    return num.toLocaleString('it-IT');
  };
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
            <div className="category-card" onClick={() => handleFilterChange('type', 'guide')}>
              <div className="category-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3>Documenti e Guide</h3>
              <p>Business plan, pitch deck, modelli finanziari e guide pratiche</p>
              <span className="resource-count">
                {allResources.filter(r => r.type === 'guide' || r.type === 'pdf').length} risorse
              </span>
            </div>

            <div className="category-card" onClick={() => handleFilterChange('type', 'template')}>
              <div className="category-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3>Template e Modelli</h3>
              <p>Strumenti pronti all&apos;uso per accelerare il tuo business</p>
              <span className="resource-count">
                {allResources.filter(r => r.type === 'template').length} risorse
              </span>
            </div>

            <div className="category-card" onClick={() => handleFilterChange('type', 'video')}>
              <div className="category-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Video e Webinar</h3>
              <p>Contenuti video formativi e registrazioni di webinar</p>
              <span className="resource-count">
                {allResources.filter(r => r.type === 'video').length} risorse
              </span>
            </div>

            <div className="category-card" onClick={() => handleFilterChange('category', 'finanza')}>
              <div className="category-icon">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3>Analisi e Report</h3>
              <p>Studi di mercato, analisi settoriali e report di settore</p>
              <span className="resource-count">
                {allResources.filter(r => r.category === 'finanza' || r.category === 'investimenti').length} risorse
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      {featuredResources.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Risorse in Evidenza</h2>
            <div className="featured-grid">
              {featuredResources.map((resource) => (
                <div key={resource.id} className="featured-card">
                  <div className="featured-image">
                    <Image
                      src={resource.thumbnail_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&q=80'}
                      alt={resource.title}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover"
                      onLoad={() => handleView(resource)}
                    />
                    <div className={`featured-badge ${resource.is_premium ? 'premium' : 'popular'}`}>
                      {resource.is_premium ? 'Premium' : 'Popolare'}
                    </div>
                  </div>
                  <div className="featured-content">
                    <h3>{resource.title}</h3>
                    <p>{resource.description}</p>
                    <div className="featured-meta">
                      <span className="resource-type">{RESOURCE_TYPE_LABELS[resource.type]}</span>
                      <span className="resource-size">{formatFileSize(resource.file_size)}</span>
                      <span className="downloads">{formatNumber(resource.download_count)} download</span>
                    </div>
                    <button 
                      className={`download-btn ${resource.is_premium ? 'premium' : ''}`}
                      onClick={() => handleDownload(resource)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {resource.is_premium ? 'Scarica Premium' : 'Scarica Gratis'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Resources */}
      <section className="all-resources-section">
        <div className="container">
          <div className="resources-header">
            <h2 className="section-title">Tutte le Risorse</h2>
            <div className="search-and-filters">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Cerca risorse..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                />
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all', 'all')}
                >
                  Tutte
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'pdf' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('type', 'pdf')}
                >
                  Documenti
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'template' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('type', 'template')}
                >
                  Template
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'video' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('type', 'video')}
                >
                  Video
                </button>
                <button 
                  className={`filter-tab ${activeFilter === 'guide' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('type', 'guide')}
                >
                  Guide
                </button>
              </div>
            </div>
            {loading && <div className="loading-spinner">Caricamento...</div>}
            {error && <div className="error-message">Errore: {error}</div>}
          </div>

          {allResources.length > 0 ? (
            <>
              <div className="resources-grid">
                {allResources.map((resource) => (
                  <div key={resource.id} className="resource-item">
                    <div className="resource-icon">
                      {resource.type === 'pdf' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {resource.type === 'template' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                      {resource.type === 'video' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      {resource.type === 'guide' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                      {resource.type === 'ebook' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                      {resource.type === 'checklist' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {resource.type === 'presentation' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V1a1 1 0 011-1h2a1 1 0 011 1v3m0 0h8m-8 0v16a1 1 0 001 1h6a1 1 0 001-1V4H7z" />
                        </svg>
                      )}
                      {resource.type === 'tool' && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="resource-info">
                      <h3>{resource.title}</h3>
                      <p>{resource.description}</p>
                      <div className="resource-meta">
                        <span className="resource-type">{RESOURCE_TYPE_LABELS[resource.type]}</span>
                        <span className="resource-size">{formatFileSize(resource.file_size)}</span>
                        {resource.is_premium && <span className="premium-badge">Premium</span>}
                      </div>
                      <div className="resource-stats">
                        <span className="downloads">{formatNumber(resource.download_count)} download</span>
                        <span className="views">{formatNumber(resource.view_count)} visualizzazioni</span>
                      </div>
                    </div>
                    <button 
                      className="resource-download" 
                      aria-label={`Scarica ${resource.title}`}
                      onClick={() => handleDownload(resource)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Precedente
                  </button>
                  <span className="pagination-info">
                    Pagina {currentPage} di {totalPages}
                  </span>
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Successiva
                  </button>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <div className="no-resources">
                {error ? (
                  <div>
                    <p>⚠️ Database non configurato. Per utilizzare le risorse dinamiche:</p>
                    <ol className="setup-instructions">
                      <li>Apri Supabase Dashboard</li>
                      <li>Vai al SQL Editor</li>
                      <li>Copia e incolla il contenuto di <code>create_resources_database.sql</code></li>
                      <li>Esegui lo script per creare le tabelle</li>
                    </ol>
                    <p>Oppure contatta l&apos;amministratore per configurare il database.</p>
                  </div>
                ) : (
                  <div>
                    <p>Nessuna risorsa trovata con i filtri selezionati.</p>
                    <button 
                      className="clear-filters-btn"
                      onClick={() => {
                        setFilters({});
                        setActiveFilter('all');
                        setSearchQuery('');
                      }}
                    >
                      Cancella Filtri
                    </button>
                  </div>
                )}
              </div>
            )
          )}
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
                style={{ width: "auto", height: "auto" }}
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
