'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '@/config/supabase';

export default function ErrorHandler() {
  const logErrorToSupabase = useCallback(async (error: any, context: string) => {
    try {
      // Ottieni l'utente corrente se loggato
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      const message = error.message || error.reason?.message || 'Errore sconosciuto';
      const stack = error.stack || error.reason?.stack || '';
      const url = typeof window !== 'undefined' ? window.location.href : '';

      // Determina la gravità
      let severity: 'info' | 'warning' | 'error' | 'critical' = 'error';
      if (message.toLowerCase().includes('video') || message.toLowerCase().includes('quiz')) {
        severity = 'critical'; // Questi bloccano il progresso dell'utente!
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
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log('✅ Errore loggato su sistema di monitoraggio');
    } catch (e) {
      console.error('❌ Impossibile loggare errore su Supabase:', e);
    }
  }, []);

  useEffect(() => {
    // Gestisce gli errori delle estensioni del browser e Server Components
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason?.message || '';
      
      // Filtra gli errori delle estensioni del browser
      if (message.includes('message channel closed') ||
          message.includes('runtime.lastError') ||
          message.includes('Extension context invalidated') ||
          message.includes('Server Components render') ||
          message.includes('digest property')) {
        event.preventDefault();
        return;
      }

      // Se non è rumore delle estensioni, loggalo
      logErrorToSupabase(event, 'unhandledrejection');
    };

    const handleError = (event: ErrorEvent) => {
      const message = event.message || '';

      // Filtra gli errori delle estensioni del browser e Server Components
      if (message.includes('message channel closed') ||
          message.includes('runtime.lastError') ||
          message.includes('Extension context invalidated') ||
          message.includes('Server Components render') ||
          message.includes('digest property')) {
        event.preventDefault();
        return;
      }

      // Logga l'errore reale
      logErrorToSupabase(event.error || { message }, 'onerror');
    };

    // Gestisce errori di rete (HubSpot, etc.)
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

    // Aggiungi i listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    window.addEventListener('error', handleResourceError, true);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      window.removeEventListener('error', handleResourceError, true);
    };
  }, [logErrorToSupabase]);

  return null;
}
