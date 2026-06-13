import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public auth routes
  const authRoutes = ['/auth/signin', '/auth/signup', '/auth/verify', '/auth/reset'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Get session token from cookies
  const token = request.cookies.get('sb-access-token')?.value;

  // If user is authenticated and tries to access auth routes, redirect to canvas
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/canvas', request.url));
  }

  // If user is not authenticated and tries to access protected routes, redirect to signin
  if (!token && !isAuthRoute && pathname !== '/' && pathname.startsWith('/')) {
    // Allow public routes like '/' but protect '/canvas' and other app routes
    if (pathname.startsWith('/canvas') || pathname.startsWith('/billing')) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
