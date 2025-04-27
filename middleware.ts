// middleware.js
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for auth token in cookies or localStorage (client-side only)
  const token = request.cookies.get('omnicloud_token')?.value;
  
  // If accessing protected routes without token, redirect to login
  if (request.nextUrl.pathname.startsWith('/dash') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Specify which paths middleware runs on
export const config = {
  matcher: ['/dash/:path*']
};