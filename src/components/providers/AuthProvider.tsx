'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import ProfileSync from './ProfileSync';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <ProfileSync />
      {children}
    </SessionProvider>
  );
}
