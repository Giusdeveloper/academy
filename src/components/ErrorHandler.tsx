'use client';

import { useEffect } from 'react';

export default function ErrorHandler() {
  useEffect(() => {
    // Gestisce gli errori delle estensioni del browser
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Filtra gli errori delle estensioni del browser
      if (event.reason?.message?.includes('message channel closed') ||
          event.reason?.message?.includes('runtime.lastError') ||
          event.reason?.message?.includes('Extension context invalidated')) {
        event.preventDefault();
        return;
      }
    };

    const handleError = (event: ErrorEvent) => {
      // Filtra gli errori delle estensioni del browser
      if (event.message?.includes('message channel closed') ||
          event.message?.includes('runtime.lastError') ||
          event.message?.includes('Extension context invalidated')) {
        event.preventDefault();
        return;
      }
    };

    // Aggiungi i listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null; // Questo componente non renderizza nulla
}
