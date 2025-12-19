'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/config/supabase';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image: string | null;
  slug: string;
}

interface User {
  email: string;
  name?: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const { slug } = params as { slug: string };

  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Recupera i dettagli del corso
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('id, title, description, price, image, slug')
          .eq('slug', slug)
          .single();

        if (courseError || !courseData) {
          setError('Corso non trovato');
          return;
        }

        setCourse(courseData);

        // Recupera i dati dell'utente (da implementare con autenticazione)
        // Per ora usiamo dati mock
        setUser({
          email: 'user@example.com',
          name: 'Utente Test',
        });

      } catch (err) {
        console.error('Errore nel caricamento dei dati:', err);
        setError('Errore nel caricamento dei dati');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handlePayment = async () => {
    if (!course || !user) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          userEmail: user.email,
          userName: user.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se il servizio non è disponibile (503), mostra un messaggio specifico
        if (response.status === 503) {
          setError('Il servizio di pagamento è temporaneamente non disponibile. Contattaci per maggiori informazioni.');
        } else {
          throw new Error(data.error || 'Errore nella creazione del pagamento');
        }
        return;
      }

      // Redirect al checkout di Revolut
      if (data.payment?.checkout_url) {
        window.location.href = data.payment.checkout_url;
      } else {
        throw new Error('URL di checkout non disponibile');
      }

    } catch (err) {
      console.error('Errore nel pagamento:', err);
      setError(err instanceof Error ? err.message : 'Errore nel pagamento');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Errore</h1>
          <p className="text-gray-600 mb-6">{error || 'Corso non trovato'}</p>
          <Link
            href="/courses"
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Torna ai Corsi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Informazioni del corso */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Checkout
              </h1>
              
              <div className="border rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="text-gray-600 mb-4">{course.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-pink-500">
                    €{course.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">IVA inclusa</span>
                </div>
              </div>

              {/* Informazioni utente */}
              <div className="border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Informazioni Fatturazione
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{user?.email || 'N/A'}</p>
                  </div>
                  {user?.name && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Metodo di pagamento */}
              <div className="border rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Metodo di Pagamento
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Il servizio di pagamento è temporaneamente non disponibile. 
                    Contattaci per completare l'acquisto.
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {processing ? 'Elaborazione...' : `Paga €${course.price.toFixed(2)}`}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Il servizio di pagamento sarà presto disponibile. Contattaci per maggiori informazioni.
              </p>
            </div>

            {/* Riepilogo ordine */}
            <div className="bg-gray-50 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Riepilogo Ordine
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Corso</span>
                  <span className="text-gray-900">{course.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prezzo</span>
                  <span className="text-gray-900">€{course.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA</span>
                  <span className="text-gray-900">Inclusa</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Totale</span>
                  <span className="text-pink-500">€{course.price.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p className="mb-2">✅ Accesso immediato al corso</p>
                <p className="mb-2">✅ Supporto clienti incluso</p>
                <p className="mb-2">✅ Garanzia soddisfatti o rimborsati</p>
                <p>📧 Contattaci per completare l'acquisto</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
