'use client';

import { useEffect } from 'react';

export default function ErrorHandler() {
  useEffect(() => {
    // Gestisce gli errori delle estensioni del browser e Server Components
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Filtra gli errori delle estensioni del browser
      if (event.reason?.message?.includes('message channel closed') ||
          event.reason?.message?.includes('runtime.lastError') ||
          event.reason?.message?.includes('Extension context invalidated') ||
          event.reason?.message?.includes('Server Components render') ||
          event.reason?.message?.includes('digest property')) {
        event.preventDefault();
        return;
      }
    };

    const handleError = (event: ErrorEvent) => {
      // Filtra gli errori delle estensioni del browser e Server Components
      if (event.message?.includes('message channel closed') ||
          event.message?.includes('runtime.lastError') ||
          event.message?.includes('Extension context invalidated') ||
          event.message?.includes('Server Components render') ||
          event.message?.includes('digest property')) {
        event.preventDefault();
        return;
      }
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

    // Gestisce errori di rete per XMLHttpRequest e fetch
  const handleNetworkError = (event: Event) => {
    if (event.type === 'error' && event.target) {
      const target = event.target as XMLHttpRequest;
      if (target.responseURL && target.responseURL.includes('forms-na1.hsforms.com')) {
        event.preventDefault();
        return;
      }
    }
  };

    // Aggiungi i listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);
    window.addEventListener('error', handleResourceError, true);
    window.addEventListener('error', handleNetworkError, true);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      window.removeEventListener('error', handleResourceError, true);
      window.removeEventListener('error', handleNetworkError, true);
    };
  }, []);

  return null; // Questo componente non renderizza nulla
}
