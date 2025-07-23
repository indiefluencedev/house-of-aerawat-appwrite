// src/app/sso-callback/page.jsx

'use client';
import { AuthenticateWithRedirectCallback, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserSync } from '@/hooks/useUserSync';

export default function SSOCallback() {
  const { isSignedIn, isLoaded } = useUser();
  const { appwriteUser, isAdmin, isLoading: isUserSyncLoading } = useUserSync();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  // Handle redirection after authentication
  useEffect(() => {
    if (isSignedIn && !isUserSyncLoading && !redirecting) {
      setRedirecting(true);
      // Redirect to admin dashboard if user is an admin
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/my-account');
      }
    }
  }, [isSignedIn, isUserSyncLoading, isAdmin, router, redirecting]);

  return (
    <div className='flex min-h-[80vh] items-center justify-center bg-white'>
      <div className='text-center'>
        <h1 className='text-2xl font-bold mb-4 text-gray-900'>
          Processing your sign-in...
        </h1>
        <div className='animate-pulse flex space-x-4 justify-center mb-6'>
          <div
            className='h-3 w-3 bg-[#14397C] rounded-full animate-bounce'
            style={{ animationDelay: '0ms' }}
          ></div>
          <div
            className='h-3 w-3 bg-[#14397C] rounded-full animate-bounce'
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className='h-3 w-3 bg-[#14397C] rounded-full animate-bounce'
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
        <p className='text-sm text-gray-600 mb-4'>
          Please wait while we complete your authentication...
        </p>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
