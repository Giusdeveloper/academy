'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import LoginButton from './auth/LoginButton';

export default function Navbar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === 'loading' || !session) {
        setIsAdmin(false);
        return;
      }

      setCheckingAdmin(true);
      try {
        const response = await fetch('/api/admin/verify');
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [session, status]);

  return (
    <nav className="bg-[#17334F] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center h-full">
            <Image 
              src="/Imment%20-%20logo%20-%20web_orizzontale%20-%20colori%20-%20chiaro.png" 
              alt="Imment Logo" 
              width={200}
              height={48}
              className="h-12 w-auto object-contain max-h-12"
              priority
            />
          </Link>
          <div className="hidden md:flex gap-6 ml-6">
            <Link href="/" className="text-white/90 hover:text-white font-medium text-sm">Home</Link>
            <Link href="/courses" className="text-white/70 hover:text-white font-medium text-sm">Corsi</Link>
            <Link href="/workshops" className="text-white/70 hover:text-white font-medium text-sm">Workshop</Link>
            <Link href="/startup-award" className="text-white/70 hover:text-white font-medium text-sm">Startup Award</Link>
            <Link href="/resources" className="text-white/70 hover:text-white font-medium text-sm">Risorse</Link>
            <Link href="/about" className="text-white/70 hover:text-white font-medium text-sm">Chi siamo</Link>
            <Link href="/contacts" className="text-white/70 hover:text-white font-medium text-sm">Contatti</Link>
          </div>
        </div>

        {/* CTA Area Riservata / Login */}
        {status === 'loading' ? (
          <div className="ml-4 px-4 py-2 text-white text-sm">Caricamento...</div>
        ) : session ? (
          <div className="ml-4 flex items-center gap-2 flex-shrink-0">
            <span className="hidden xl:block text-white/90 text-xs font-medium truncate max-w-[100px]">
              {session.user?.name || session.user?.email}
            </span>
            {isAdmin && (
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-full border-2 border-pink-500 text-white font-semibold bg-pink-500 hover:bg-pink-600 transition text-xs whitespace-nowrap"
              >
                Admin
              </Link>
            )}
            <button
              className="px-3 py-1.5 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-[#17334F] transition text-xs whitespace-nowrap"
              onClick={() => router.push('/dashboard')}
            >
              <span className="hidden sm:inline">Area Riservata</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
            <LoginButton showUserInfo={false} />
          </div>
        ) : (
          <div className="ml-4 flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-[#17334F] transition text-xs whitespace-nowrap"
              onClick={() => router.push('/auth/signin')}
            >
              Accedi
            </button>
            <button
              className="px-4 py-1.5 rounded-full border-2 border-[#9E005C] text-white font-semibold bg-[#9E005C] hover:bg-white hover:text-[#9E005C] transition text-xs whitespace-nowrap"
              onClick={() => router.push('/register')}
            >
              Registrati
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}