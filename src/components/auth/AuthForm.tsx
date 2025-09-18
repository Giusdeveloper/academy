'use client';

import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { useRouter } from 'next/navigation';
import './AuthForm.css';

type AuthMode = 'login' | 'register';

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendEmail, setResendEmail] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        console.log('🔐 Tentativo di registrazione con:', { email, name });
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
            emailRedirectTo: `${window.location.origin}/verify-email`,
          },
        });

        console.log('🔐 Risposta registrazione:', { 
          user: !!data.user, 
          error: error?.message,
          emailConfirmed: !!data.user?.email_confirmed_at 
        });

        if (error) {
          console.log('❌ Errore registrazione:', error.message);
          throw error;
        }
        
        if (data.user) {
          console.log('✅ Registrazione riuscita!');
          
          if (!data.user.email_confirmed_at) {
            console.log('📧 Email di verifica inviata! Controlla la tua casella di posta.');
            setSuccess('Registrazione completata! Ti abbiamo inviato un\'email di verifica. Controlla la tua casella di posta (inclusa la cartella spam) e clicca sul link per attivare il tuo account. Se non ricevi l\'email entro 5 minuti, vai al login e usa il pulsante "Invia nuovamente email di verifica".');
            return;
          }
          
          console.log('✅ Email già verificata, reindirizzando...');
          router.push('/dashboard');
        }
      } else {
        console.log('🔐 Tentativo di login con:', { email, password: '***' });
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('🔐 Risposta login:', { 
          user: !!data.user, 
          error: error?.message,
          emailConfirmed: !!data.user?.email_confirmed_at 
        });

        if (error) {
          console.log('❌ Errore login:', error.message);
          
          // Gestione specifica per email non confermata
          if (error.message.includes('Email not confirmed') || 
              error.message.includes('email_not_confirmed')) {
            setError('Il tuo account non è ancora stato verificato. Controlla la tua email (inclusa la cartella spam) e clicca sul link di verifica. Se non hai ricevuto l\'email, usa il pulsante qui sotto per richiederne una nuova.');
            return;
          }
          
          // Gestione per credenziali non valide
          if (error.message.includes('Invalid login credentials')) {
            setError('Email o password non corretti. Controlla le tue credenziali e riprova.');
            return;
          }
          
          throw error;
        }
        
        if (data.user) {
          console.log('✅ Login riuscito, reindirizzando...');
          router.push('/dashboard');
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setError('Inserisci prima la tua email');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) {
        setError('Errore nell\'invio dell\'email di verifica: ' + error.message);
      } else {
        setSuccess('Email di verifica inviata! Controlla la tua casella di posta.');
        setResendEmail(true);
      }
    } catch {
      setError('Errore durante l\'invio dell\'email di verifica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2 className="auth-form-title">
          {mode === 'login' ? 'Accedi' : 'Registrati'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Nome
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          {mode === 'login' && error && error.includes('non è ancora stato verificato') && (
            <div className="form-group">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading || resendEmail}
                className="resend-verification-button"
              >
                {loading ? 'Invio in corso...' : resendEmail ? 'Email inviata!' : 'Invia nuovamente email di verifica'}
              </button>
            </div>
          )}


          {mode === 'register' && success && success.includes('email di verifica') && (
            <div className="form-group">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="go-to-login-button"
              >
                Vai al Login
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Caricamento...' : mode === 'login' ? 'Accedi' : 'Registrati'}
          </button>
        </form>

        <div className="form-links">
          <p>
            {mode === 'login' ? 'Non hai un account?' : 'Hai già un account?'}{' '}
            <a
              href={mode === 'login' ? '/register' : '/login'}
            >
              {mode === 'login' ? 'Registrati' : 'Accedi'}
            </a>
          </p>
          {mode === 'login' && (
            <p>
              <a
                href="/forgot-password"
              >
                Password dimenticata?
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 