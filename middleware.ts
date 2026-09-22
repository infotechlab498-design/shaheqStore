import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, readAdminSession } from '@/lib/auth/admin-session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await readAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

  if (pathname === '/admin/login') {
    if (session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
