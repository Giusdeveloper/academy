import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { authOptionsSimple } from '@/lib/auth-simple';

// Usa la configurazione semplice se non ci sono provider configurati
const hasProviders = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const config = hasProviders ? authOptions : authOptionsSimple;

const handler = NextAuth(config);

export { handler as GET, handler as POST };
