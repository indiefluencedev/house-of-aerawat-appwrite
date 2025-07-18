import Aboutbanner from '@/components/about/aboutBanner';
import AboutCaraousel from '@/components/about/aboutCaraousel';
import Defining from '@/components/about/aefining';
import OurMissionVision from '@/components/about/ourMissionVision';
import Tradition from '@/components/about/tradition';
import PurchaseSupport from '@/components/home/purchaseSupport';
import React from 'react';

function page() {
  return (
    <div>
      <Aboutbanner />
      <Tradition />
      <Defining />
      <OurMissionVision />
      <PurchaseSupport />
      <AboutCaraousel />
    </div>
  );
}

export default page;
