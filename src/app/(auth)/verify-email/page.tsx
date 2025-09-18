'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/config/supabase';
import './verify-email.css';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Controlla prima se ci sono errori nei parametri URL (query params)
        let error = searchParams.get('error');
        let errorCode = searchParams.get('error_code');
        let errorDescription = searchParams.get('error_description');

        // Se non ci sono errori nei query params, controlla l'hash dell'URL
        if (!error && typeof window !== 'undefined') {
          const hash = window.location.hash;
          if (hash) {
            console.log('🔍 Controllo hash URL:', hash);
            const hashParams = new URLSearchParams(hash.substring(1)); // Rimuove il #
            error = hashParams.get('error');
            errorCode = hashParams.get('error_code');
            errorDescription = hashParams.get('error_description');
          }
        }

        if (error) {
          console.log('❌ Errore rilevato:', { error, errorCode, errorDescription });
          
          if (errorCode === 'otp_expired') {
            setStatus('error');
            setMessage('Il link di verifica è scaduto. I link di verifica sono validi per 24 ore. Richiedi una nuova email di verifica.');
            return;
          } else if (error === 'access_denied') {
            setStatus('error');
            setMessage('Accesso negato. Il link di verifica potrebbe essere stato già utilizzato o non è valido.');
            return;
          } else {
            setStatus('error');
            setMessage(`Errore nella verifica: ${errorDescription || error}`);
            return;
          }
        }

        // Supabase può usare diversi parametri per la verifica
        let accessToken = searchParams.get('access_token');
        let refreshToken = searchParams.get('refresh_token');
        let token = searchParams.get('token');
        let type = searchParams.get('type');

        // Se non troviamo i parametri nei query params, controlliamo l'hash
        if (!accessToken && typeof window !== 'undefined') {
          const hash = window.location.hash;
          if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            accessToken = hashParams.get('access_token');
            refreshToken = hashParams.get('refresh_token');
            token = hashParams.get('token');
            type = hashParams.get('type');
          }
        }

        console.log('🔐 Parametri URL ricevuti:', {
          accessToken: !!accessToken,
          refreshToken: !!refreshToken,
          token: !!token,
          type
        });

        // Metodo 1: Se abbiamo access_token e refresh_token (metodo standard Supabase)
        if (accessToken && refreshToken) {
          console.log('🔐 Verificando con access_token e refresh_token');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('❌ Errore verifica con session:', error);
            setStatus('error');
            setMessage('Errore nella verifica dell\'email. Il link potrebbe essere scaduto o non valido.');
            return;
          }

          if (data.user && data.user.email_confirmed_at) {
            console.log('✅ Email verificata con successo tramite session!');
            setStatus('success');
            setMessage('Email verificata con successo! Ora puoi accedere al tuo account.');
            
            // Reindirizza alla dashboard dopo 3 secondi
            setTimeout(() => {
              router.push('/dashboard');
            }, 3000);
            return;
          }
        }

        // Metodo 2: Se abbiamo token e type (metodo OTP)
        if (type === 'signup' && token) {
          console.log('🔐 Verificando email con token OTP:', token);
          
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) {
            console.error('❌ Errore verifica OTP:', error);
            setStatus('error');
            setMessage('Errore nella verifica dell\'email. Il link potrebbe essere scaduto o non valido.');
            return;
          }

          if (data.user) {
            console.log('✅ Email verificata con successo tramite OTP!');
            setStatus('success');
            setMessage('Email verificata con successo! Ora puoi accedere al tuo account.');
            
            // Reindirizza alla dashboard dopo 3 secondi
            setTimeout(() => {
              router.push('/dashboard');
            }, 3000);
            return;
          }
        }

        // Se nessun metodo ha funzionato
        console.log('❌ Nessun parametro di verifica valido trovato');
        setStatus('error');
        setMessage('Link di verifica non valido. Assicurati di aver cliccato sul link completo dall\'email.');
        
      } catch (error) {
        console.error('❌ Errore durante la verifica:', error);
        setStatus('error');
        setMessage('Si è verificato un errore durante la verifica dell\'email.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="verify-email-page">
      <div className="verify-email-container">
        <div className="verify-email-card">
          {status === 'loading' && (
            <>
              <div className="loading-spinner"></div>
              <h2 className="verify-title">
                Verifica in corso...
              </h2>
              <p className="verify-message">
                Stiamo verificando la tua email, attendi un momento.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="status-icon success">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="verify-title">
                Email verificata!
              </h2>
              <p className="verify-message">
                {message}
              </p>
              <p className="verify-redirect">
                Verrai reindirizzato automaticamente alla dashboard...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="status-icon error">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="verify-title">
                Errore nella verifica
              </h2>
              <p className="verify-message">
                {message}
              </p>
              <div className="verify-actions">
                <button
                  onClick={() => router.push('/login')}
                  className="login-button"
                >
                  Vai al Login
                </button>
                {message.includes('scaduto') && (
                  <button
                    onClick={() => router.push('/register')}
                    className="register-button"
                  >
                    Registrati di Nuovo
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="verify-email-page">
        <div className="verify-email-container">
          <div className="verify-email-card">
            <div className="loading-spinner"></div>
            <h2 className="verify-title">Caricamento...</h2>
            <p className="verify-message">Stiamo caricando la pagina di verifica...</p>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
