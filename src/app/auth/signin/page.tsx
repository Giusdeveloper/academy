'use client';

import { getSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TraditionalLoginForm from '@/components/auth/TraditionalLoginForm';
import LoginButton from '@/components/auth/LoginButton';

export default function SignInPage() {
  const router = useRouter();

  useEffect(() => {
    // Controlla se l'utente è già loggato
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">A</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accedi al tuo account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accedi con email e password o con i tuoi account social
          </p>
        </div>

        <div className="space-y-6">
          {/* Login Tradizionale */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Accedi con email e password
            </h3>
            <TraditionalLoginForm />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">oppure</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Accedi con i tuoi account social
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Accedi rapidamente con Google
            </p>
            <LoginButton className="w-full" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Non hai un account?{' '}
            <Link href="/register" className="font-medium text-pink-600 hover:text-pink-500">
              Registrati qui
            </Link>
          </p>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Torna alla homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
