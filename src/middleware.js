// src/middleware.js
import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// This function is the middleware's main entry point
export default function middleware(request) {
  // Run the Clerk middleware
  return clerkMiddleware()(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
