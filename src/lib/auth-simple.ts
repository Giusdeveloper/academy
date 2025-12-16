import { NextAuthOptions } from 'next-auth';

// Configurazione semplificata per testing senza provider OAuth
export const authOptionsSimple: NextAuthOptions = {
  providers: [
    // Nessun provider per ora - solo per testare la configurazione
  ],
  
  callbacks: {
    async session({ session }) {
      return session;
    },
    
    async signIn() {
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt', // Usa JWT invece di database per ora
  },

  debug: process.env.NODE_ENV === 'development',
};
