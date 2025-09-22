import Link from "next/link";
import Image from "next/image";
import "./privacy.css";

export default function PrivacyPage() {
  return (
    <div className="privacy-page">
      <div className="container">
        <div className="privacy-content">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-last-updated">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>
          
          <section className="privacy-section">
            <h2>1. Informazioni Generali</h2>
            <p>
              Imment S.r.l. ("noi", "nostro" o "la nostra azienda") rispetta la tua privacy e si impegna a proteggere 
              le tue informazioni personali. Questa Privacy Policy spiega come raccogliamo, utilizziamo e proteggiamo 
              le tue informazioni quando utilizzi la nostra piattaforma Academy.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Informazioni che Raccogliamo</h2>
            <h3>2.1 Informazioni fornite direttamente</h3>
            <ul>
              <li>Nome e cognome</li>
              <li>Indirizzo email</li>
              <li>Password (criptata)</li>
              <li>Informazioni di contatto</li>
            </ul>
            
            <h3>2.2 Informazioni raccolte automaticamente</h3>
            <ul>
              <li>Dati di utilizzo della piattaforma</li>
              <li>Progresso nei corsi</li>
              <li>Risultati dei quiz</li>
              <li>Informazioni tecniche del dispositivo</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. Come Utilizziamo le Tue Informazioni</h2>
            <p>Utilizziamo le tue informazioni per:</p>
            <ul>
              <li>Fornire e migliorare i nostri servizi educativi</li>
              <li>Tracciare il tuo progresso nei corsi</li>
              <li>Comunicare con te riguardo ai nostri servizi</li>
              <li>Rispettare gli obblighi legali</li>
              <li>Prevenire frodi e abusi</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Condivisione delle Informazioni</h2>
            <p>
              Non vendiamo, affittiamo o condividiamo le tue informazioni personali con terze parti, 
              eccetto nei casi previsti dalla legge o con il tuo consenso esplicito.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Sicurezza dei Dati</h2>
            <p>
              Implementiamo misure di sicurezza appropriate per proteggere le tue informazioni personali 
              contro accessi non autorizzati, alterazioni, divulgazioni o distruzioni.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. I Tuoi Diritti</h2>
            <p>Hai il diritto di:</p>
            <ul>
              <li>Accedere alle tue informazioni personali</li>
              <li>Correggere informazioni inesatte</li>
              <li>Eliminare le tue informazioni</li>
              <li>Limitare il trattamento dei tuoi dati</li>
              <li>Portabilità dei dati</li>
              <li>Opporti al trattamento</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>7. Cookie e Tecnologie Simili</h2>
            <p>
              Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza sulla nostra piattaforma. 
              Puoi gestire le tue preferenze sui cookie attraverso le impostazioni del tuo browser.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Modifiche a Questa Privacy Policy</h2>
            <p>
              Potremmo aggiornare questa Privacy Policy di tanto in tanto. Ti informeremo di eventuali 
              modifiche significative pubblicando la nuova Privacy Policy su questa pagina.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Contatti</h2>
            <p>
              Se hai domande su questa Privacy Policy o sul trattamento dei tuoi dati personali, 
              puoi contattarci:
            </p>
            <ul>
              <li>Email: privacy@imment.it</li>
              <li>Indirizzo: Piazza Teresa Noce 17/D - 10155 Torino</li>
              <li>Telefono: +39 011 123 4567</li>
            </ul>
          </section>
        </div>
      </div>

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
