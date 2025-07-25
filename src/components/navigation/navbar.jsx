// src/components/navigation/navbar.jsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { useUserSync } from '@/hooks/useUserSync';

const Navbar = () => {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const { appwriteUser, isLoading: isAppwriteLoading } = useUserSync();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // products data - now linking to individual product pages
  const products = [
    { name: 'Fine Jewellery', slug: 'fine-jewellery' },
    { name: 'Shringaar', slug: 'shringaar' },
    { name: 'Kalapatt', slug: 'kalapatt' },
    { name: 'Crystals', slug: 'crystals' },
    { name: 'Kashth Kala', slug: 'kashth-kala' },
    { name: 'Treasured Gifts', slug: 'treasured-gifts' },
  ];

  // Handle products click - now goes to product pages
  const handleproductsClick = (productSlug) => {
    router.push(`/products/${productSlug}`);
  };

  // Check if products is active based on current pathname
  const isproductsActive = (productSlug) => {
    return pathname === `/products/${productSlug}`;
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getUserDashboardLink = () => {
    if (!clerkUser || !appwriteUser) return '/login';
    return appwriteUser.role === 'admin' ? '/admin' : '/my-account';
  };

  const renderUserIcon = () => {
    if (clerkUser) {
      return (
        <div
          className='relative'
          onMouseEnter={() => setShowUserMenu(true)}
          onMouseLeave={() => setShowUserMenu(false)}
        >
          <div className='flex items-center space-x-2 focus:outline-none cursor-pointer p-2'>
            <Link href={getUserDashboardLink()}>
              <Image
                src={clerkUser.imageUrl || '/assets/svgs/user.svg'}
                alt='User Profile'
                width={24}
                height={24}
                className='w-6 h-6 rounded-full'
              />
            </Link>
          </div>

          {showUserMenu && (
            <div className='absolute right-0 mt-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[250px]'>
              <div className='pt-2'>
                <div className='px-4 py-2 text-[16px] text-[#222222] font-medium border-b'>
                  <div className='font-semibold text-[16px] px-0'>
                    {clerkUser.firstName && clerkUser.lastName
                      ? `${clerkUser.firstName} ${clerkUser.lastName}`
                      : clerkUser.fullName || 'User'}
                  </div>
                  <div className='text-[14px] text-gray-500 tracking-wide'>
                    {clerkUser.emailAddresses[0]?.emailAddress}
                  </div>
                  {isAppwriteLoading && (
                    <div className='text-[12px] text-blue-500 mt-1'>
                      Syncing profile...
                    </div>
                  )}
                </div>
                <Link
                  href={getUserDashboardLink()}
                  className='block px-4 py-3 text-[15px] text-[#222222] font-medium hover:bg-gray-100'
                >
                  {appwriteUser?.role === 'admin'
                    ? 'Admin Dashboard'
                    : 'My Account'}
                </Link>
                {appwriteUser?.role !== 'admin' && (
                  <>
                    <Link
                      href='/my-account/orders'
                      className='block px-4 py-3 text-[15px] text-[#222222] font-medium hover:bg-gray-100'
                    >
                      My Orders
                    </Link>
                    <Link
                      href='/my-account/addresses'
                      className='block px-4 py-3 text-[15px] text-[#222222] font-medium hover:bg-gray-100'
                    >
                      My Addresses
                    </Link>
                    <Link
                      href='/my-account/wishlist'
                      className='block px-4 py-3 text-[15px] text-[#222222] font-medium hover:bg-gray-100'
                    >
                      My Wishlist
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className='block w-full cursor-pointer text-left px-4 py-3 text-[15px] text-red-600 hover:bg-gray-100'
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link href='/login'>
        <Image
          src='/assets/svgs/user.svg'
          alt='Login'
          width={24}
          height={24}
          className='w-6 h-6'
        />
      </Link>
    );
  };

  return (
    <header>
      {/* Top Navigation Links */}
      <div className='bg-[#14397C] text-white py-2 px-4 flex justify-center space-x-12 text-[16px] new-class'>
        <a href='/' className='hover:underline'>
          Home
        </a>
        <a href='/about' className='hover:underline'>
          About Us
        </a>
        <a href='/contact' className='hover:underline'>
          Get in Touch
        </a>
      </div>

      {/* Main Navbar */}
      <div className='flex flex-wrap items-center justify-between px-4 py-4 border-b'>
        {/* Logo */}
        <div className='flex items-center'>
          <Link href='/'>
            <Image
              src='/assets/newlogo.png'
              alt='Logo'
              width={290}
              height={75}
              className=' md:w-[290px]'
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </Link>
        </div>

        {/* Search */}
        <div className='flex-1 flex justify-end items-center space-x-2 mr-5 mt-4 md:mt-0'>
          <Image
            src='/assets/search.svg'
            alt='Search Icon'
            width={28}
            height={28}
            className='search hidden md:block'
            style={{ width: 'auto', height: 'auto' }}
          />
          <input
            type='text'
            id='search'
            placeholder='Search for Jewellery, Crystals, Gifts...'
            className='w-full md:w-96 p-2 border rounded-lg bg-gray-100 text-sm focus:outline-none'
          />
        </div>

        {/* Icons */}
        <div className='flex items-center ml-2 space-x-4 mt-4 md:mt-0'>
          {renderUserIcon()}
          <Link href='/wishlist'>
            <Image
              src='/assets/heart.svg'
              alt='Heart Icon'
              width={24}
              height={24}
              className='w-6 h-6 cursor-pointer'
            />
          </Link>
          <Link href='/cart'>
            <Image
              src='/assets/chart.svg'
              alt='Cart Icon'
              width={24}
              height={24}
              className='w-6 h-6'
            />
          </Link>
        </div>
      </div>

      {/* products Navigation */}
      <div className='flex flex-wrap justify-center space-x-4 py-6 text-xs md:text-[14px] new-class2 gap-26 text-black font-medium tracking-wide'>
        {products.map((products) => (
          <button
            key={products.slug}
            onClick={() => handleproductsClick(products.slug)}
            className={`
              relative cursor-pointer focus:outline-none transition-all duration-300 ease-in-out
              ${
                isproductsActive(products.slug)
                  ? 'text-black'
                  : 'text-black hover:text-gray-700'
              }
            `}
          >
            {products.name}
            {/* Animated underline */}
            <span
              className={`
                absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-300 ease-in-out
                ${
                  isproductsActive(products.slug)
                    ? 'w-full'
                    : 'w-0 group-hover:w-full'
                }
              `}
            />
            {/* Hover effect - separate span for hover animation */}
            <span className='absolute bottom-0 left-0 h-[2px] bg-black w-0 hover:w-full transition-all duration-300 ease-in-out opacity-0 hover:opacity-100' />
          </button>
        ))}
      </div>

      {/* Custom CSS for better hover effect */}
      <style jsx>{`
        .new-class2 button {
          position: relative;
          overflow: hidden;
        }

        .new-class2 button::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #000;
          transition: width 0.3s ease-in-out;
        }

        .new-class2 button:hover::after {
          width: 100%;
        }

        .new-class2 button.active::after {
          width: 100%;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
