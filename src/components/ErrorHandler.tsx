'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';

interface ErrorLike {
  message: string;
  stack?: string;
  reason?: {
    message?: string;
    stack?: string;
  };
}

export default function ErrorHandler() {
  const logErrorToSupabase = useCallback(async (error: Error | ErrorLike | unknown, context: string) => {
    try {
      // Ottieni l'utente corrente se loggato
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      // Estrai messaggio e stack in modo sicuro
      let message = 'Errore sconosciuto';
      let stack = '';

      if (error instanceof Error) {
        message = error.message;
        stack = error.stack || '';
      } else if (typeof error === 'object' && error !== null) {
        const errObj = error as ErrorLike;
        message = errObj.message || errObj.reason?.message || 'Errore oggetto';
        stack = errObj.stack || errObj.reason?.stack || '';
      } else if (typeof error === 'string') {
        message = error;
      }

      const url = typeof window !== 'undefined' ? window.location.href : '';

      // Determina la gravità
      let severity: 'info' | 'warning' | 'error' | 'critical' = 'error';
      if (message.toLowerCase().includes('video') || message.toLowerCase().includes('quiz')) {
        severity = 'critical';
      }

      // Salva l'errore su Supabase
      await supabase.from('system_errors').insert({
        message,
        stack,
        url,
        user_id: user?.id,
        user_email: user?.email,
        severity,
        metadata: {
          context,
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
          timestamp: new Date().toISOString()
        }
      });
      
      console.log('✅ Errore loggato su sistema di monitoraggio');
    } catch (e) {
      console.error('❌ Impossibile loggare errore su Supabase:', e);
    }
  }, []);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason?.message || '';
      
      if (message.includes('message channel closed') ||
          message.includes('runtime.lastError') ||
          message.includes('Extension context invalidated') ||
          message.includes('Server Components render') ||
          message.includes('digest property')) {
        event.preventDefault();
        return;
      }

      logErrorToSupabase(reason, 'unhandledrejection');
    };

    const handleError = (event: ErrorEvent) => {
      const message = event.message || '';

      if (message.includes('message channel closed') ||
          message.includes('runtime.lastError') ||
          message.includes('Extension context invalidated') ||
          message.includes('Server Components render') ||
          message.includes('digest property')) {
        event.preventDefault();
        return;
      }

      logErrorToSupabase(event.error || { message }, 'onerror');
    };

    const handleResourceError = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT')) {
        const src = (target as HTMLImageElement).src || (target as HTMLScriptElement).src;
        if (src?.includes('forms-na1.hsforms.com') || 
            src?.includes('hs-scripts.com')) {
          event.preventDefault();
          return;
        }
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    window.addEventListener('error', handleResourceError, true);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, [logErrorToSupabase]);

  return null;
}
