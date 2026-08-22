import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy';
// Standard local Supabase JWT secret
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'super-secret-jwt-token-with-at-least-32-characters-long';

/**
 * Creates a Supabase client authenticated as the specified user ID.
 * This perfectly simulates real RLS behavior in the database without needing cookies.
 */
export function createAuthenticatedClient(userId: string, role: string = 'authenticated') {
  // Generate a valid JWT for the local Supabase instance
  const token = jwt.sign(
    {
      aud: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour expiration
      sub: userId,
      role: role
    },
    JWT_SECRET
  );

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });
}

/**
 * Creates a Supabase Service Role client that bypasses RLS.
 * Useful for test setup/teardown (e.g. clearing carts).
 */
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_service_key';
  return createClient(SUPABASE_URL, serviceKey);
}

/**
 * Helper to construct a mock NextRequest for API route testing.
 */
export function createMockRequest(body: any = null, headers: Record<string, string> = {}) {
  const req = new Request('http://localhost:3000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  // Cast to NextRequest which extends Request
  return req as NextRequest;
}

/**
 * Mocks the `auth()` function from @/auth
 */
export function mockAuthSession(userId: string) {
  return {
    user: { id: userId, email: 'test@test.com' },
    expires: new Date(Date.now() + 86400000).toISOString()
  };
}
