'use client';

import { useUser } from '@clerk/nextjs';
import { useUserSync } from '@/hooks/useUserSync';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/layouts/adminLayout';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { appwriteUser, isAdmin, isLoading: isUserSyncLoading } = useUserSync();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // When Clerk has loaded and user sync is complete, update loading state
    if (isLoaded && !isUserSyncLoading) {
      setLoading(false);

      // If user is signed in but not an admin, redirect to regular dashboard
      if (isSignedIn && !isAdmin) {
        router.push('/my-account');
      }
    }
  }, [isLoaded, isUserSyncLoading, isSignedIn, isAdmin, router]);

  // Show loading state
  if (loading) {
    return (
      <div className='flex min-h-[80vh] items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold mb-4'>
            Loading admin dashboard...
          </h1>
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
          <p className='mb-6'>Please sign in to access the admin dashboard.</p>
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

  // If not admin, show unauthorized message
  if (!isAdmin) {
    return (
      <div className='flex min-h-[80vh] items-center justify-center'>
        <div className='text-center max-w-md mx-auto p-6'>
          <h1 className='text-2xl font-bold mb-4 text-red-600'>
            Unauthorized Access
          </h1>
          <p className='mb-6'>
            You do not have admin privileges to view this page.
          </p>
          <Link
            href='/my-account'
            className='inline-block bg-[#6c47ff] text-white rounded-md px-6 py-2 font-medium hover:bg-[#5538cc] transition-colors'
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Admin dashboard content
  return (
    <AdminLayout>
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
              Welcome, {user.firstName || user.username || 'Admin'}!
            </h1>
            <p className='text-gray-600'>
              {user.emailAddresses?.[0]?.emailAddress} (Admin)
            </p>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4 flex items-center'>
            <svg
              className='w-6 h-6 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
              ></path>
            </svg>
            Orders Overview
          </h2>
          <div className='flex justify-between mb-4'>
            <div className='text-center'>
              <p className='text-gray-500'>New</p>
              <p className='text-2xl font-bold'>0</p>
            </div>
            <div className='text-center'>
              <p className='text-gray-500'>Processing</p>
              <p className='text-2xl font-bold'>0</p>
            </div>
            <div className='text-center'>
              <p className='text-gray-500'>Completed</p>
              <p className='text-2xl font-bold'>0</p>
            </div>
          </div>
          <Link
            href='#'
            className='mt-4 inline-block text-[#6c47ff] font-medium hover:underline'
          >
            Manage Orders
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4 flex items-center'>
            <svg
              className='w-6 h-6 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
              ></path>
            </svg>
            Products
          </h2>
          <p className='text-gray-700 mb-2'>
            Total Products: <span className='font-bold'>0</span>
          </p>
          <p className='text-gray-700 mb-4'>
            Out of Stock: <span className='font-bold'>0</span>
          </p>
          <div className='space-y-2'>
            <Link href='#' className='block text-[#6c47ff] hover:underline'>
              Add New Product
            </Link>
            <Link href='#' className='block text-[#6c47ff] hover:underline'>
              Manage Inventory
            </Link>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4 flex items-center'>
            <svg
              className='w-6 h-6 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
              ></path>
            </svg>
            Customers
          </h2>
          <p className='text-gray-700 mb-4'>
            Total Customers: <span className='font-bold'>0</span>
          </p>
          <div className='space-y-2'>
            <Link href='#' className='block text-[#6c47ff] hover:underline'>
              Customer List
            </Link>
            <Link href='#' className='block text-[#6c47ff] hover:underline'>
              Add New Customer
            </Link>
          </div>
        </div>
      </div>

      {/* Second row with additional admin features */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4 flex items-center'>
            <svg
              className='w-6 h-6 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              ></path>
            </svg>
            Analytics
          </h2>
          <div className='space-y-2'>
            <p className='text-gray-700'>
              Sales This Month: <span className='font-bold'>₹0</span>
            </p>
            <p className='text-gray-700'>
              Visitors: <span className='font-bold'>0</span>
            </p>
            <p className='text-gray-700'>
              Conversion Rate: <span className='font-bold'>0%</span>
            </p>
          </div>
          <Link
            href='#'
            className='mt-4 inline-block text-[#6c47ff] font-medium hover:underline'
          >
            View Full Analytics
          </Link>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-bold mb-4 flex items-center'>
            <svg
              className='w-6 h-6 mr-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
              ></path>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
              ></path>
            </svg>
            Settings & Configuration
          </h2>
          <ul className='space-y-2'>
            <li>
              <Link href='#' className='text-[#6c47ff] hover:underline'>
                Site Settings
              </Link>
            </li>
            <li>
              <Link href='#' className='text-[#6c47ff] hover:underline'>
                User Permissions
              </Link>
            </li>
            <li>
              <Link href='#' className='text-[#6c47ff] hover:underline'>
                Shipping Methods
              </Link>
            </li>
            <li>
              <Link href='#' className='text-[#6c47ff] hover:underline'>
                Payment Gateways
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
