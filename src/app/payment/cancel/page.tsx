'use client';

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icona di cancellazione */}
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento Annullato
        </h1>

        <p className="text-gray-600 mb-6">
          Il pagamento è stato annullato. Non è stata effettuata alcuna transazione.
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            Se hai cambiato idea, puoi sempre tornare al corso e completare l'acquisto.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/courses"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors block"
          >
            Torna ai Corsi
          </Link>
          
          <Link
            href="/dashboard"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors block"
          >
            Vai alla Dashboard
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Hai domande? Contatta il nostro supporto clienti.</p>
        </div>
      </div>
    </div>
  );
}
