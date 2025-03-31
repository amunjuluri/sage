// middleware.js

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/student-login', '/teacher-login', '/api/auth'];
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath + '/')
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // If the user is not logged in, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Role-based access control
  if (path.startsWith('/student') && token.role !== 'STUDENT') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (path.startsWith('/teacher') && token.role !== 'TEACHER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/api/:path*'
  ]
};