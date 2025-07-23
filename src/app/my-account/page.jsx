'use client';

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUserSync } from '@/hooks/useUserSync';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { appwriteUser, isAdmin, isLoading: isUserSyncLoading } = useUserSync();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // When Clerk has loaded and user sync is complete, update loading state
    if (isLoaded && !isUserSyncLoading) {
      setLoading(false);

      // If user is admin, redirect to admin dashboard
      if (isSignedIn && isAdmin) {
        router.push('/admin');
      }
    }
  }, [isLoaded, isUserSyncLoading, isSignedIn, isAdmin, router]);

  // Show loading state
  if (loading) {
    return (
      <div className='flex min-h-[80vh] items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>Loading your dashboard...</h1>
          <div className='animate-pulse flex space-x-4'>
            <div className='h-3 w-3 bg-[#6c47ff] rounded-full'></div>
            <div className='h-3 w-3 bg-[#6c47ff] rounded-full'></div>
            <div className='h-3 w-3 bg-[#6c47ff] rounded-full'></div>
          </div>
        </div>
      </div>
    );
  }

  // If not signed in, show a message and redirect option
  if (!isSignedIn) {
    return (
      <div className='flex min-h-[80vh] items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-6'>
          <h1 className='text-2xl font-bold mb-4 text-red-600'>
            Authentication Required
          </h1>
          <p className='mb-6'>Please sign in to access your dashboard.</p>
          <Link
            href='/login'
            className='inline-block bg-[#6c47ff] text-white rounded-md px-6 py-2 font-medium hover:bg-[#5538cc] transition-colors'
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // User is signed in, show the dashboard
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
        <div className='flex items-center gap-4'>
          {user.imageUrl && (
            <Image
              src={user.imageUrl}
              alt='Profile'
              width={80}
              height={80}
              className='rounded-full'
            />
          )}
          <div>
            <h1 className='text-2xl font-bold text-gray-800'>
              Welcome, {user.firstName || user.username || 'User'}!
            </h1>
            <p className='text-gray-600'>
              {user.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4'>Recent Orders</h2>
          <p className='text-gray-600'>You don't have any recent orders.</p>
          <Link
            href='/products'
            className='mt-4 inline-block text-[#6c47ff] font-medium hover:underline'
          >
            Browse Products
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4'>Wishlist</h2>
          <p className='text-gray-600'>Your wishlist is empty.</p>
          <Link
            href='/wishlist'
            className='mt-4 inline-block text-[#6c47ff] font-medium hover:underline'
          >
            View Wishlist
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4'>Account Settings</h2>
          <ul className='space-y-2'>
            <li>
              <Link href='#' className='text-[#6c47ff] hover:underline'>
                Edit Profile
              </Link>
            </li>
            <li>
              <Link href='#' className='text-[#6c47ff] hover:underline'>
                Change Password
              </Link>
            </li>
            <li>
              <Link href='#' className='text-[#6c47ff] hover:underline'>
                Shipping Address
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
