'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/config/supabase';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Controlla lo stato dell'autenticazione
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    setLoading(false);

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Rimuovo 'user' dalle dipendenze per evitare il loop infinito

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

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
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <div className="hidden md:flex gap-8 ml-8">
            <Link href="/" className="text-white/90 hover:text-white font-medium">Home</Link>
            <Link href="/courses" className="text-white/70 hover:text-white font-medium">Corsi</Link>
            <Link href="/workshops" className="text-white/70 hover:text-white font-medium">Workshop</Link>
            <Link href="/resources" className="text-white/70 hover:text-white font-medium">Risorse</Link>
            <Link href="/about" className="text-white/70 hover:text-white font-medium">Chi siamo</Link>
            <Link href="/contacts" className="text-white/70 hover:text-white font-medium">Contatti</Link>
          </div>
        </div>
        {/* CTA Area Riservata / Login */}
        {loading ? (
          <div className="ml-4 px-6 py-2 text-white">Caricamento...</div>
        ) : user ? (
          <div className="ml-4 flex items-center gap-4">
            <span className="text-white">{user.user_metadata?.name || user.email}</span>
            <button
              className="px-4 py-2 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-[#17334F] transition text-sm"
              onClick={() => router.push('/dashboard')}
            >
              Area Riservata
            </button>
            <button
              className="px-4 py-2 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-[#17334F] transition text-sm"
              onClick={handleSignOut}
            >
              Esci
            </button>
          </div>
        ) : (
          <div className="ml-4 flex items-center gap-4">
            <button
              className="px-4 py-2 rounded-full border-2 border-white text-white font-semibold hover:bg-white hover:text-[#17334F] transition text-sm"
              onClick={() => router.push('/login')}
            >
              Accedi
            </button>
            <button
              className="px-6 py-2 rounded-full border-2 border-[#9E005C] text-white font-semibold bg-[#9E005C] hover:bg-white hover:text-[#9E005C] transition text-base"
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