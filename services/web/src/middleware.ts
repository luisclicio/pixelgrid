import { NextResponse } from 'next/server';

import { auth } from '@/services/auth';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export default auth((request) => {
  const isAuthenticated = Boolean(request.auth?.user);
  const isLoginPage = request.nextUrl.pathname === '/auth/login';
  const isRegisterPage = request.nextUrl.pathname === '/auth/register';

  if (isAuthenticated && (isLoginPage || isRegisterPage)) {
    const newUrl = new URL('/dashboard', request.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard');

  if (!isAuthenticated && isProtectedPath && !isLoginPage) {
    const newUrl = new URL(
      `/auth/login?redirect=${request.nextUrl.pathname}`,
      request.nextUrl.origin
    );
    return NextResponse.redirect(newUrl);
  }
});
