'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserSidebar({ user }) {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Account Information',
      path: '/my-account',
    },
    {
      name: 'My Orders',
      path: '/my-account/orders',
    },
    {
      name: 'My Addresses',
      path: '/my-account/addresses',
    },
    {
      name: 'Settings',
      path: '/my-account/settings',
    },
  ];

  // Extract user name from profile or use first name if available
  const getUserName = () => {
    if (user?.profile?.name) {
      const firstName = user.profile.name.split(' ')[0];
      return firstName;
    }
    return 'User';
  };

  return (
    <div className='w-full lg:w-1/5 xl:w-1/6 px-4 lg:block border-r'>
      <div className='py-4 px-2 h-full'>
        <h3 className='text-[28px] md:text-[32px] font-bold mb-4'>Hi, {getUserName()}!</h3>
        <h3 className='text-[22px] py-4 font-medium mb-4'>My Account</h3>

        {/* Navigation - Horizontal scroll on mobile/tablet, vertical on desktop */}
        <nav className='lg:space-y-2'>
          {/* Mobile/Tablet horizontal scrolling container */}
          <div className='lg:hidden overflow-x-auto scrollbar-hide'>
            <div className='flex space-x-6 pb-2 min-w-max'>
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`
                      relative inline-flex items-center gap-3 py-2 font-medium transition-colors whitespace-nowrap
                      ${isActive ? 'text-black' : 'text-gray-700 hover:text-black'}
                      group
                    `}
                  >
                    <span
                      className={`
                        relative
                        after:content-['']
                        after:block
                        after:h-[2px]
                        after:bg-black
                        after:transition-all
                        after:duration-300
                        after:rounded-full
                        after:mt-1
                        ${isActive
                          ? 'after:w-full after:opacity-100'
                          : 'after:w-0 after:opacity-0 group-hover:after:w-full group-hover:after:opacity-100'
                        }
                      `}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}

              {/* Logout Link for mobile/tablet */}
              <Link
                href='/api/auth/logout'
                className='inline-flex items-center gap-3 py-2 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors whitespace-nowrap px-2'
              >
                Log Out
              </Link>
            </div>
          </div>

          {/* Desktop vertical navigation */}
          <div className='hidden lg:block space-y-2'>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`
                    relative inline-flex items-center gap-3 py-2 font-medium transition-colors w-fit
                    ${isActive ? 'text-black' : 'text-gray-700 hover:text-black'}
                    group
                  `}
                >
                  <span
                    className={`
                      relative
                      after:content-['']
                      after:block
                      after:h-[2px]
                      after:bg-black
                      after:transition-all
                      after:duration-300
                      after:rounded-full
                      after:mt-1
                      ${isActive
                        ? 'after:w-full after:opacity-100'
                        : 'after:w-0 after:opacity-0 group-hover:after:w-full group-hover:after:opacity-100'
                      }
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Logout Link for desktop */}
            <Link
              href='/api/auth/logout'
              className='flex items-center gap-3 py-2 font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors'
            >
              Log Out
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
