import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnDistributor = nextUrl.pathname.startsWith('/distributor');
      const isAuthPage = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
      const isOnOldDashboard = nextUrl.pathname === '/dashboard';

      if (isOnAdmin) {
        return true; // TEMPORARILY BYPASS AUTH
      }

      if (isOnDistributor) {
        return true; // TEMPORARILY BYPASS AUTH
      }
      
      if (isOnOldDashboard) {
        if (!isLoggedIn) return false;
        // Redirect from old dashboard to role-specific dashboard
        if (role === 'ADMIN') return Response.redirect(new URL('/admin/dashboard', nextUrl));
        if (role === 'DISTRIBUTOR') return Response.redirect(new URL('/distributor/dashboard', nextUrl));
        // Allow regular users to access the dashboard
        return true;
      }

      if (isAuthPage) {
        if (isLoggedIn) {
          if (role === 'ADMIN') return Response.redirect(new URL('/admin/dashboard', nextUrl));
          if (role === 'DISTRIBUTOR') return Response.redirect(new URL('/distributor/dashboard', nextUrl));
          return Response.redirect(new URL('/dashboard', nextUrl)); // fallback for regular users
        }
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        if (token.role) {
          session.user.role = token.role as string;
        }
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
