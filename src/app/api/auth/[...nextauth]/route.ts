import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Usa sempre authOptions che include almeno il CredentialsProvider
// Se Google è configurato, verrà aggiunto automaticamente
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
