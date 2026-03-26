'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/config/supabase';
import { EmailOtpType } from '@supabase/supabase-js';
import './verify-email.css';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [redirectTo, setRedirectTo] = useState<'dashboard' | 'course'>('dashboard');
  const router = useRouter();
  const searchParams = useSearchParams();
  const verificationProcessed = useRef(false);

  useEffect(() => {
    // Impedisce la doppia esecuzione del trigger (causa comune del token "scaduto")
    if (verificationProcessed.current) return;

    const verifyEmail = async () => {
      try {
        // Prima verifica: l'utente è già autenticato? 
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.email_confirmed_at) {
          console.log('✅ Utente già verificato tramite sessione esistente');
          handleSuccess();
          return;
        }

        // Procediamo con l'estrazione dei parametri se non siamo ancora loggati
        let error = searchParams.get('error');
        let errorCode = searchParams.get('error_code');
        let errorDescription = searchParams.get('error_description');

        // Controlla hash (#) perché Supabase spesso mette i dati lì
        if (!error && typeof window !== 'undefined') {
          const hash = window.location.hash;
          if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1));
            error = hashParams.get('error');
            errorCode = hashParams.get('error_code');
            errorDescription = hashParams.get('error_description');
          }
        }

        if (error) {
          if (errorCode === 'otp_expired' && session) {
            handleSuccess();
            return;
          }

          console.log('❌ Errore rilevato:', { error, errorCode, errorDescription });
          setStatus('error');
          setMessage(errorCode === 'otp_expired' 
            ? 'Il link è scaduto o è già stato utilizzato. Prova ad accedere direttamente.' 
            : `Errore: ${errorDescription || error}`);
          return;
        }

        // Estrazione token/type per metodo OTP
        let token = searchParams.get('token_hash') || searchParams.get('token');
        let typeStr = searchParams.get('type') || 'signup';

        if (!token && typeof window !== 'undefined') {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          token = hashParams.get('token_hash') || hashParams.get('token');
          typeStr = hashParams.get('type') || typeStr;
        }

        if (token) {
          console.log('🔐 Tentativo di verifica con token...');
          verificationProcessed.current = true;
          
          // Mappatura sicura del tipo di OTP
          const type: EmailOtpType = typeStr === 'invite' ? 'invite' : 
                                    (typeStr === 'recovery' ? 'recovery' : 'signup');

          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type
          });

          if (verifyError) {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              handleSuccess();
            } else {
              throw verifyError;
            }
          } else if (data.user) {
            handleSuccess();
          }
        } else if (session) {
          handleSuccess();
        } else {
          setTimeout(async () => {
            const { data: { session: finalCheck } } = await supabase.auth.getSession();
            if (finalCheck) handleSuccess();
            else {
              setStatus('error');
              setMessage('Nessun dato di verifica trovato nel link. Prova a fare il login.');
            }
          }, 2000);
        }
        
      } catch (err: unknown) {
        const error = err as Error;
        console.error('❌ Errore durante la verifica:', error);
        setStatus('error');
        setMessage('Il link potrebbe essere stato già utilizzato. Prova ad accedere.');
      }
    };

    const handleSuccess = () => {
      verificationProcessed.current = true;
      setStatus('success');
      
      const fromStartupAward = typeof window !== 'undefined' && sessionStorage.getItem('registerFrom') === 'startup-award';
      if (fromStartupAward) {
        setMessage('Email verificata! Ora puoi accedere al corso "Finanziamento Aziendale".');
        setRedirectTo('course');
      } else {
        setMessage('Email verificata con successo! Benvenuto nell\'Academy.');
      }
      
      setTimeout(() => {
        if (fromStartupAward) {
          router.push('/courses/finanziamento-aziendale');
        } else {
          router.push('/dashboard');
        }
      }, 2500);
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
                {redirectTo === 'course' 
                  ? 'Verrai reindirizzato automaticamente al corso...'
                  : 'Verrai reindirizzato automaticamente alla dashboard...'}
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
