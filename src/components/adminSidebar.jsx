'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin',
      icon: (
        <Image src='/assets/svgs/home.svg' alt='home' width={20} height={20} />
      ),
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: (
        <Image
          src='/assets/svgs/orders.svg'
          alt='orders'
          width={20}
          height={20}
        />
      ),
    },
    {
      name: 'Products',
      path: '/admin/products',
    },
    {
      name: 'Stock',
      path: '/admin/stock',
    },
    {
      name: 'Combos',
      path: '/admin/combos',
    },
    {
      name: 'Customers',
      path: '/admin/customers',
      icon: (
        <Image
          src='/assets/adminsvgs/customers.svg'
          alt='customers'
          width={20}
          height={20}
        />
      ),
    },
  ];

  return (
    <aside className='w-64 text-black min-h-screen p-6'>
      <h2 className='text-md font-medium mb-5 pt-2'>Admin Panel</h2>
      <nav className='space-y-1'>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 text-sm rounded-md transition-colors ${
                isActive ? 'bg-[#E8DEF8]' : 'hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
