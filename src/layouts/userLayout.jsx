import React from 'react';
import UserSidebar from '@/components/userSidebar';
import '@/app/globals.css';

export default function UserLayout({ children, user }) {
  return (
    <div className='min-h-screen max-w-[1240px] lg:flex mx-auto py-5'>
      <UserSidebar user={user} />
      <div className='flex-1 p-4'>
        <main className='mx-0 h-full flex flex-col'>{children}</main>
      </div>
    </div>
  );
}
