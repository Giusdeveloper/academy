import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { supabase } from '@/config/supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google Provider (solo se configurato)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    
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
    
    // Microsoft Provider (da aggiungere quando configurato)
    // MicrosoftProvider({
    //   clientId: process.env.MICROSOFT_CLIENT_ID!,
    //   clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    //   tenant: 'common', // o 'organizations' per account aziendali
    // }),
  ],
  
  // Adapter solo se Supabase è configurato
  ...(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? {
    adapter: SupabaseAdapter({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }),
  } : {}),

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
    
    async signIn({ user }) {
      // Logica personalizzata per il sign-in
      console.log('User signing in:', user.email);
      return true;
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect personalizzato dopo il login
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
    strategy: 'jwt', // Usa JWT per supportare sia OAuth che credentials
  },

  debug: process.env.NODE_ENV === 'development',
};
