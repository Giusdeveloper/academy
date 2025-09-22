"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import Image from "next/image";
import Link from "next/link";
import type { User } from '@supabase/supabase-js';
import "./homepage.css";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  language: string | null;
  price: number;
  duration_hours: number | null;
  ects_max: number | null;
  image_url: string | null;
  created_at: string;
}

export default function HomePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  // Controllo autenticazione
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Errore nel controllo autenticazione:', error);
        setUser(null);
      }
    };

    checkAuth();

    // Ascolta i cambiamenti di autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .limit(3);

      if (error) throw error;
      setCourses(data || []);

    } catch (err) {
      console.error('Errore nel caricamento dei corsi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (courseSlug: string) => {
    // "Scopri di più" porta sempre alla pagina del corso
    router.push(`/courses/${courseSlug}`);
  };

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
          {loading ? (
            // Loading state
            Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="loading-card">
                <div className="loading-image"></div>
                <div className="loading-content">
                  <div className="loading-title"></div>
                  <div className="loading-text"></div>
                  <div className="loading-text-short"></div>
                  <div className="loading-price"></div>
                </div>
              </div>
            ))
          ) : courses.length > 0 ? (
            // Courses
            courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image-container">
                  <Image
                    src={course.image_url || "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=192&q=90"}
                    alt={`Corso ${course.title} - ${course.description || 'Descrizione non disponibile'}`}
                    width={400}
                    height={192}
                    className="course-image"
                    quality={90}
                  />
                  <div className="course-image-overlay"></div>
                </div>
                <div className="course-content">
                  <div className="course-icon">
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">
                    {course.description || 'Nessuna descrizione disponibile'}
                  </p>
                  <div className="course-meta">
                    <div className="course-meta-item">
                      <svg className="course-meta-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration_hours} ore
                    </div>
                    <div className="course-meta-item">
                      <svg className="course-meta-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.level || 'Tutti i livelli'}
                    </div>
                    {course.language && (
                      <div className="course-meta-item">
                        <svg className="course-meta-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.103 9.75c-.83-1.641.759-3.221 2.874-3.387A48.15 48.15 0 0112 6.25c2.291 0 4.545.16 6.75.47 2.114.166 3.703 1.746 2.874 3.387A18.022 18.022 0 0115 17.5m-9-12h.008v.008H6V5.5zm.375 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                        {course.language}
                      </div>
                    )}
                  </div>
                  <div className="course-footer">
                    <span className="course-price">€{course.price}</span>
                    <button 
                      className="btn-course"
                      onClick={() => handleCourseClick(course.slug)}
                    >
                      Scopri di più
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // No courses
            <div className="no-courses-message">
              Nessun corso disponibile al momento.
            </div>
          )}
        </div>
      </section>

      {/* EVENTI PARTNER */}
      <section className="section section-large events-section">
        <h2 className="section-title">Eventi Partner</h2>
        <p className="section-subtitle text-center">
          Collaboriamo con le migliori community tech italiane per portarti eventi di altissimo livello
        </p>
        
        <div className="event-featured">
          <div className="event-card">
            <div className="event-logo">
              <div className="logo-container">
                <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            </div>
            <div className="event-content">
              <div className="event-tag">Google Developer Groups Napoli</div>
              <h3 className="event-title">Napoli DevFest 2025</h3>
              <p className="event-description">
                Il più grande evento tech di Napoli. Una giornata intera dedicata a intelligenza artificiale, 
                gaming, robotica, startup e networking con ospiti internazionali e Alberto Giusti nella Startup Alley.
              </p>
              <div className="event-details">
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
                className="event-btn"
              >
                Acquista Biglietti
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="events-cta">
          <Link href="/workshops" className="btn-primary">
            Scopri tutti gli eventi
          </Link>
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