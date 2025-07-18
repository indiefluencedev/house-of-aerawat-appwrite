// src/app/page.jsx - Main homepage
'use client';

import HomeBanner from '@/components/home/homeBanner';
import Gallery from '@/components/home/gallery';
import PurchaseSupport from '@/components/home/purchaseSupport';
// import HomeFeaturedProducts from '@/components/home/homeFeaturedProducts';
// import RecentlyViewed from '@/components/home/recentlyViewed';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className=''>
      <HomeBanner />
      <Gallery />
      <PurchaseSupport />
      {/* <HomeFeaturedProducts /> */}
      {/* <RecentlyViewed /> */}
    </main>
  );
}
