'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';

interface LoginButtonProps {
  className?: string;
  showUserInfo?: boolean;
}

export default function LoginButton({ className = '', showUserInfo = true }: LoginButtonProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (provider: string) => {
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Errore durante il login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Errore durante il logout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
        <span className="text-gray-600">Caricamento...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        {showUserInfo && (
          <div className="flex items-center space-x-2">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-gray-700 font-medium">
              {session.user?.name || session.user?.email}
            </span>
          </div>
        )}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          {loading ? 'Uscita...' : 'Esci'}
        </button>
      </div>
    );
  }

  // Mostra sempre il pulsante Google - NextAuth gestirà la configurazione

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Google Button */}
      <button
        onClick={() => handleSignIn('google')}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{loading ? 'Accesso...' : 'Accedi con Google'}</span>
        </button>

    </div>
  );
}
