// src/app/layout.jsx

import './globals.css';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import FloatingActionBar from '@/components/constants/floatingActionBar';
import MobileNavbar from '@/components/navigation/mobileNavbar';

import { Kumbh_Sans, Lora } from 'next/font/google';

const kumbhSans = Kumbh_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kumbh-sans',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
});

export const metadata = {
  title: 'House of Aerawat',
  description: 'Jewellery and Handcrafted Items – Clean UI Design',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary:
            'bg-[#14397C] hover:bg-[#D4AF37] hover:text-[#14397C]',
          footerActionLink: 'text-[#14397C] hover:text-[#D4AF37]',
          captchaMessage: 'text-sm text-gray-600 mt-2',
          captchaContainer: 'flex justify-center mt-4 mb-4',
          card: 'rounded-md shadow-sm border border-gray-100',
          formFieldInput: 'border border-gray-200 bg-gray-100',
          identityPreviewEditButton: 'text-[#14397C]',
          formFieldAction: 'text-[#14397C]',
        },
        variables: {
          colorPrimary: '#14397C',
          colorText: '#14397C',
          colorBackground: '#ffffff',
          colorDanger: '#e53e3e',
          colorSuccess: '#38a169',
          borderRadius: '0.375rem',
        },
        layout: {
          socialButtonsVariant: 'iconButton',
          socialButtonsPlacement: 'top',
          termsPageUrl: 'https://clerk.com/terms',
        },
      }}
    >
      <html lang='en' className={`${kumbhSans.variable} ${lora.variable}`}>
        <body suppressHydrationWarning={true}>
          {/* ✅ Desktop Navbar */}
          <div className='hidden xl:block'>
            <Navbar />
          </div>
          {/* ✅ Mobile Navbar */}
          <div className='block xl:hidden'>
            <MobileNavbar />
          </div>

          {/* ✅ Main page content */}
          <main>{children}</main>

          <Footer />
          <FloatingActionBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
