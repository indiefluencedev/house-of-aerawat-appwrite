'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function MobileNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  // products data - now linking to individual product pages
  const products = [
    { name: 'Fine Jewellery', slug: 'fine-jewellery' },
    { name: 'Crystals', slug: 'crystals' },
    { name: 'Shringaar', slug: 'shringaar' },
    { name: 'Kashth Kala', slug: 'kashth-kala' },
    { name: 'Treasured Gifts', slug: 'treasured-gifts' },
    { name: 'Kalapatt', slug: 'kalapatt' },
  ];

  // Handle products click - now goes to product pages
  const handleproductsClick = (productSlug) => {
    setMenuOpen(false); // Close the menu
    router.push(`/products/${productSlug}`); // Navigate to product page
  };

  // Handle body scroll lock and viewport height
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial height
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    };
  }, [menuOpen]);

  return (
    <>
      {/* Mobile Header */}
      <div className='flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 xl:hidden'>
        {/* Hamburger + Logo */}
        <div className='flex items-center'>
          <button
            aria-label='Open menu'
            onClick={() => setMenuOpen(true)}
            className='mr-2'
          >
            {/* Hamburger Icon */}
            <svg
              className='w-7 h-7'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' d='M4 6h16M4 12h16M4 18h16' />
            </svg>
          </button>
          <Link href='/'>
            <Image
              src='/assets/newlogo.png'
              alt='Logo'
              width={180}
              height={50}
              className='ml-1 cursor-pointer'
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>
        </div>
        {/* Icons */}
        <div className='flex items-center space-x-4'>
          <Image src='/assets/heart.svg' alt='Heart' width={24} height={24} />
          <Link href='/cart'>
            <Image src='/assets/chart.svg' alt='Cart' width={24} height={24} />
          </Link>
        </div>
      </div>

      {/* Search Bar (Mobile Only) */}
      <div className='px-4 py-2 bg-white'>
        <div className='flex items-center bg-gray-100 rounded-lg px-3 py-2'>
          <svg
            className='w-5 h-5 text-gray-400 mr-2'
            fill='none'
            stroke='currentColor'
            strokeWidth={2}
            viewBox='0 0 24 24'
          >
            <circle cx='11' cy='11' r='8' />
            <path d='M21 21l-4.35-4.35' strokeLinecap='round' />
          </svg>
          <input
            type='text'
            placeholder='Search for jewellery, paintings and more'
            className='bg-transparent outline-none w-full text-sm'
          />
        </div>
      </div>

      {/* Side Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          menuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            menuOpen ? 'opacity-30' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 w-[85vw] max-w-xl bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-out will-change-transform ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            height: 'calc(var(--vh, 1vh) * 100)',
          }}
        >
          {/* Drawer Header */}
          <div className='flex items-center px-4 py-4 border-b border-gray-200 bg-white sticky top-0 z-10'>
            <button
              aria-label='Close menu'
              onClick={() => setMenuOpen(false)}
              className='mr-2'
            >
              {/* X Icon */}
              <svg
                className='w-7 h-7'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' d='M6 6l12 12M6 18L18 6' />
              </svg>
            </button>
            <Link href='/'>
              <Image
                src='/assets/newlogo.png'
                alt='Logo'
                width={180}
                height={50}
                className='ml-1 cursor-pointer'
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Scrollable Content */}
          <div className='flex flex-col min-h-0'>
            {/* products */}
            <nav className='flex flex-col py-2'>
              {products.map((products, index) => (
                <button
                  key={products.slug}
                  onClick={() => handleproductsClick(products.slug)}
                  className={`flex items-center px-6 py-3 text-[16px] font-medium hover:bg-gray-100 transition-all duration-200 text-left ${
                    menuOpen
                      ? 'translate-x-0 opacity-100'
                      : 'translate-x-4 opacity-0'
                  }`}
                  style={{
                    transitionDelay: menuOpen ? `${index * 50}ms` : '0ms',
                  }}
                >
                  {products.name}
                </button>
              ))}
            </nav>

            {/* Divider */}
            <div className='border-b border-gray-200 my-2' />

            {/* Profile & Other Links */}
            <div className='flex flex-col'>
              {/* Profile Dropdown */}
              <button
                className={`flex items-center justify-between px-6 py-3 text-[16px] font-medium hover:bg-gray-100 transition-all duration-200 ${
                  menuOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-4 opacity-0'
                }`}
                style={{
                  transitionDelay: menuOpen ? '300ms' : '0ms',
                }}
                onClick={() => setProfileOpen((v) => !v)}
              >
                Your Profile
                <svg
                  className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                    profileOpen ? 'rotate-90' : ''
                  }`}
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 6l6 6-6 6'
                  />
                </svg>
              </button>

              {/* Dropdown with smooth transition */}
              <div
                className={`pl-10 flex flex-col text-[15px] overflow-hidden transition-all duration-300 ease-out
                    ${
                      profileOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }
                  `}
              >
                <a
                  href='/my-account'
                  className='py-2 hover:underline transition-colors duration-200'
                >
                  Account Information
                </a>
                <a
                  href='/my-account/orders'
                  className='py-2 hover:underline transition-colors duration-200'
                >
                  Your Orders
                </a>
                <a
                  href='/my-account/address'
                  className='py-2 hover:underline transition-colors duration-200'
                >
                  Your Addresses
                </a>
              </div>

              {['About House Of Aerawat', 'Legal', 'Get In Touch'].map(
                (item, index) => (
                  <a
                    key={item}
                    href={`/${item
                      .toLowerCase()
                      .replace(/\s+/g, '-')
                      .replace('house-of-aerawat', 'about')
                      .replace('get-in-touch', 'contact')}`}
                    className={`px-6 py-3 text-[16px] font-medium hover:bg-gray-100 transition-all duration-200 ${
                      menuOpen
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-4 opacity-0'
                    }`}
                    style={{
                      transitionDelay: menuOpen
                        ? `${350 + index * 50}ms`
                        : '0ms',
                    }}
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
