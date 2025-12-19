'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula un caricamento per verificare il pagamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifica Pagamento
          </h2>
          <p className="text-gray-600">
            Stiamo verificando il tuo pagamento...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icona di successo */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pagamento Completato!
        </h1>

        <p className="text-gray-600 mb-6">
          Il tuo pagamento è stato elaborato con successo. Hai ora accesso completo al corso.
        </p>

        {paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">ID Pagamento</p>
            <p className="text-sm font-mono text-gray-900">{paymentId}</p>
          </div>
        )}

        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">ID Ordine</p>
            <p className="text-sm font-mono text-gray-900">{orderId}</p>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors block"
          >
            Vai alla Dashboard
          </Link>
          
          <Link
            href="/courses"
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors block"
          >
            Esplora Altri Corsi
          </Link>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Riceverai una email di conferma a breve.</p>
          <p>Per assistenza, contatta il supporto clienti.</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Caricamento...
          </h2>
          <p className="text-gray-600">
            Stiamo caricando la pagina...
          </p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
