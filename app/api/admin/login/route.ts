import { NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/auth/admin-auth';
import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
  createAdminSessionToken,
} from '@/lib/auth/admin-session';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = String(body?.email || '');
  const password = String(body?.password || '');

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, redirectTo: '/admin/dashboard' });
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSessionToken(email), adminCookieOptions());
  return response;
}
