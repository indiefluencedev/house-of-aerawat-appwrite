import React from 'react';
import AdminSidebar from '@/components/adminSidebar';
import '@/app/globals.css';

export default function AdminLayout({ children }) {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex flex-1'>
        <AdminSidebar />
        <div className='flex-1'>
          <main className='p-6'>{children}</main>
        </div>
      </div>
    </div>
  );
}
