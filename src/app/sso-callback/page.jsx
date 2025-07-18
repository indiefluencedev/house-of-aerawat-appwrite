// src/app/sso-callback/page.jsx

'use client';
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallback() {
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
