import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/config/supabase';

// Valida che NEXTAUTH_SECRET sia configurato
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('⚠️ NEXTAUTH_SECRET non configurato. Genera un secret con: openssl rand -base64 32');
}

// Configurazione semplificata per testing senza provider OAuth
export const authOptionsSimple: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Credentials Provider per login tradizionale
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Usa Supabase per autenticazione tradizionale
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            return null;
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email,
            image: data.user.user_metadata?.avatar_url,
          };
        } catch (error) {
          console.error('Errore autenticazione:', error);
          return null;
        }
      }
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      // Quando l'utente fa login, aggiungi l'ID al token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      // Aggiungi l'ID utente alla sessione dal token JWT
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
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
