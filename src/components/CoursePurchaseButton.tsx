'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CoursePurchaseButtonProps {
  courseId: string;
  courseSlug: string;
  price: number;
  isEnrolled?: boolean;
  className?: string;
}

export default function CoursePurchaseButton({ 
  courseId, 
  courseSlug, 
  price, 
  isEnrolled = false,
  className = ''
}: CoursePurchaseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      // Redirect alla pagina di checkout
      router.push(`/courses/${courseSlug}/checkout`);
    } catch (error) {
      console.error('Errore nel redirect al checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Se l'utente è già iscritto, mostra il pulsante per accedere al corso
  if (isEnrolled) {
    return (
      <Link
        href={`/courses/${courseSlug}`}
        className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center block ${className}`}
      >
        🎓 Accedi al Corso
      </Link>
    );
  }

  // Se il corso è gratuito
  if (price <= 0) {
    return (
      <Link
        href={`/courses/${courseSlug}`}
        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-center block ${className}`}
      >
        🆓 Inizia Gratis
      </Link>
    );
  }

  // Corso a pagamento
  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className={`w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Caricamento...
        </div>
      ) : (
        `💳 Acquista per €${price.toFixed(2)}`
      )}
    </button>
  );
}
