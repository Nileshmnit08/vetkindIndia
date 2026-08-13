import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { createServerClient } from './lib/supabase/client';
import bcrypt from 'bcryptjs';

const supabase = createServerClient();

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
          return null;
        }

        const { data: user, error } = (await supabase
          .from('users')
          .select('*')
          .eq('email', credentials.email.toLowerCase())
          .single()) as { data: any, error: any };

        if (error || !user || !user.password) {
          return null;
        }

        if (user.status !== 'ACTIVE') {
          return null; // Reject login for inactive users
        }

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (passwordsMatch) {
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        }

        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
});
