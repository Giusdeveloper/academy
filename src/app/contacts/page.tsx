"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import "./contacts.css";

// Dichiarazione TypeScript per HubSpot
declare global {
  interface Window {
    hbspt: {
      forms: {
        create: (options: {
          portalId: string;
          formId: string;
          region: string;
          target: string;
        }) => void;
      };
    };
  }
}

export default function ContactsPage() {
  // Carica e inizializza il form HubSpot
  useEffect(() => {
    const loadHubSpotForm = () => {
      // Controlla se HubSpot è già caricato
      if (window.hbspt) {
        window.hbspt.forms.create({
          portalId: "2689406",
          formId: "db3aee8f-27c8-40fb-ad16-815a5242d184",
          region: "na1",
          target: "#hubspot-form-container"
        });
        return;
      }

      // Carica lo script HubSpot se non è già presente
      const existingScript = document.querySelector('script[src*="js.hsforms.net"]');
      if (existingScript) {
        // Script già presente, aspetta che sia caricato
        const checkHubSpot = setInterval(() => {
          if (window.hbspt) {
            clearInterval(checkHubSpot);
            window.hbspt.forms.create({
              portalId: "2689406",
              formId: "db3aee8f-27c8-40fb-ad16-815a5242d184",
              region: "na1",
              target: "#hubspot-form-container"
            });
          }
        }, 100);
        return;
      }

      // Crea e carica lo script HubSpot
      const script = document.createElement('script');
      script.src = '//js.hsforms.net/forms/embed/v2.js';
      script.charset = 'utf-8';
      script.type = 'text/javascript';
      script.async = true;
      
      script.onload = () => {
        // Aspetta un po' per assicurarsi che HubSpot sia completamente caricato
        setTimeout(() => {
          if (window.hbspt) {
            window.hbspt.forms.create({
              portalId: "2689406",
              formId: "db3aee8f-27c8-40fb-ad16-815a5242d184",
              region: "na1",
              target: "#hubspot-form-container"
            });
          }
        }, 500);
      };

      script.onerror = () => {
        console.error('Errore nel caricamento dello script HubSpot');
        const container = document.getElementById('hubspot-form-container');
        if (container) {
          container.innerHTML = '<p class="text-center text-gray-600">Form temporaneamente non disponibile. Riprova più tardi.</p>';
        }
      };

      document.head.appendChild(script);
    };

    // Aspetta che il DOM sia pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadHubSpotForm);
    } else {
      loadHubSpotForm();
    }

    return () => {
      // Cleanup non necessario per script esterni
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1833]">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Contattaci</h1>
          <p className="hero-subtitle">
            Il team di Imment si compone di esperti nell&apos;area Amministrazione, 
            Finanza e Controllo, specializzati nei più innovativi strumenti finanziari alternativi. 
            Confrontati con noi.
          </p>
        </div>
      </section>


      {/* Contact Form Section */}
      <section className="form-section">
        <div className="container">
          <div className="form-content">
            <h2 className="section-title">Invia un messaggio</h2>
            <p className="form-subtitle">
              Compila il modulo sottostante e ti ricontatteremo al più presto per discutere 
              delle tue esigenze e di come possiamo aiutarti.
            </p>
            
            <div className="contact-form">
              <div id="hubspot-form-container">
                <div className="form-loading">
                  <p>Caricamento form...</p>
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
            <h2 className="cta-title">Pronto a iniziare il tuo percorso?</h2>
            <p className="cta-subtitle">
              Unisciti a 300+ founder e 190+ investitori che hanno già scelto Imment 
              per creare, finanziare e gestire le loro startup innovative.
            </p>
            <div className="cta-buttons">
              <Link href="/courses" className="btn-primary">
                Scopri i corsi
              </Link>
              <Link href="/about" className="btn-secondary">
                Chi siamo
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
