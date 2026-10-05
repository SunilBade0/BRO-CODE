import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // 1. HONEYPOT / DECOY ROUTES
  // If an attacker tries to scan for sensitive files or API endpoints, we trap them.
  const decoyRoutes = ['/api/admin/export', '/.env', '/wp-admin', '/config.json', '/api/v1/users'];
  
  // 2. CHECK FOR EXISTING SHADOW BAN
  // If they have the shadow_banned cookie, force route them to the fake dashboard for any page they visit (except the honeypot itself to prevent loop)
  const isShadowBanned = request.cookies.has('shadow_banned');
  
  if (isShadowBanned && !url.pathname.startsWith('/shadow-dashboard')) {
    // Keep them trapped in the simulation
    const shadowUrl = url.clone();
    shadowUrl.pathname = '/shadow-dashboard';
    return NextResponse.rewrite(shadowUrl);
  }

  // 3. TRIGGER THE TRAP
  if (decoyRoutes.some(route => url.pathname.includes(route))) {
    console.log(`⚠️ HONEYPOT TRIGGERED! Attacker IP: ${request.ip || 'Unknown'} Route: ${url.pathname}`);
    
    // Redirect them to the shadow dashboard, which looks real but is fake
    const response = NextResponse.redirect(new URL('/shadow-dashboard', request.url));
    
    // Set an HTTP-only cookie so they stay trapped for their entire session
    response.cookies.set('shadow_banned', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
