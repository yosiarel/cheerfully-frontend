import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Routes that require authentication
const protectedRoutes = ['/profile', '/checkout'];

// Routes that require admin role
const adminRoutes = ['/admin'];

// Routes that should redirect to home if already authenticated
const authRoutes = ['/auth/login', '/auth/register'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(id|en)/, '') || '/';

  // Check if this is a protected or admin route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // For protected/admin routes, check auth via NextAuth
  if (isProtectedRoute || isAdminRoute || isAuthRoute) {
    const session = await auth();

    // Protected routes: redirect to login if not authenticated
    if (isProtectedRoute && !session) {
      const locale = pathname.match(/^\/(id|en)/)?.[1] || defaultLocale;
      const loginUrl = new URL(`/${locale}/auth/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin routes: redirect to home if not admin
    if (isAdminRoute) {
      if (!session) {
        const locale = pathname.match(/^\/(id|en)/)?.[1] || defaultLocale;
        const loginUrl = new URL(`/${locale}/auth/login`, request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
      }
      if ((session.user as any)?.role !== 'ADMIN') {
        const locale = pathname.match(/^\/(id|en)/)?.[1] || defaultLocale;
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    }

    // Auth routes: redirect to home if already logged in
    if (isAuthRoute && session) {
      const locale = pathname.match(/^\/(id|en)/)?.[1] || defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  // Apply i18n middleware for locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
