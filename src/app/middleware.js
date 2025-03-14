import { NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Get the path name
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login';
  
  // Get the token from cookies
  const token = request.cookies.get('omnicloud_token')?.value || '';
  
  // Check for dev mode override - REMOVE IN PRODUCTION
  const isDev = process.env.NODE_ENV === 'development';
  const devParam = request.nextUrl.searchParams.get('dev');
  const isDevOverride = isDev && devParam === 'bypass';
  
  // Redirect logic based on authentication status
  if (isPublicPath && (token || isDevOverride)) {
    // If user is logged in but trying to access login page, redirect to dashboard
    return NextResponse.redirect(new URL('/dash', request.url));
  }
  
  if (!isPublicPath && !token && !isDevOverride) {
    // If user is not logged in and trying to access a protected page, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Continue with the request if all checks pass
  return NextResponse.next();
}

// Configure which paths should trigger this middleware
export const config = {
  matcher: [
    // Add paths that require authentication checks
    '/dash/:path*',
    '/login',
  ],
};