// import '@/css/Footer.css'
'use client';
import Image from 'next/image';

const Footer = () => {
  return (
    <>
      <style jsx>{`
        .footer-desktop-bg {
          background-image: url('/assets/footer/footerdesktop.png');
          background-repeat: no-repeat;
          background-position: bottom;
          background-size: contain;
        }

        .footer-mobile-bg {
          background-image: url('/assets/footer/phone-footer-bg.png');
          background-repeat: no-repeat;
          background-position: bottom;
          background-size: contain;
        }

        @media (max-width: 767px) {
          .footer-desktop-bg {
            background-image: display !important;
          }
        }

        @media (min-width: 600px) {
          .footer-mobile-bg {
            background-image: none !important;
          }
        }
      `}</style>

      <footer className='relative h-[1290px] md:h-[880px] lg:h-[950px] xl:h-[1060px] 2xl:h-[1200px] 3xl:h-[1800px] 4xl:h-[1600px] flex flex-col items-center text-center space-y-12 py-10 w-full bg-gray-100'>
        {/* Desktop Footer Background - Only visible on md+ screens */}
        <div
          className='footer-desktop-bg absolute inset-0 w-full h-full'
          style={{ zIndex: 0 }}
        />

        {/* Mobile Footer Background - Only visible on mobile */}
        <div
          className='footer-mobile-bg absolute inset-0 w-full h-full'
          style={{ zIndex: 0 }}
        />

        {/* Left Mandala */}
        <img
          src='/assets/right-mandala.svg'
          alt='Left Mandala'
          className='hidden md:block absolute left-0 top-10 md:top-24 w-32 md:w-40 xl:w-60 pointer-events-none select-none'
          style={{ zIndex: 1 }}
        />
        {/* Right Mandala */}
        <img
          src='/assets/left-mandala.svg'
          alt='Right Mandala'
          className='hidden md:block absolute right-0 top-16 md:top-28 w-32 md:w-40 xl:w-60 pointer-events-none select-none'
          style={{ zIndex: 1 }}
        />
        <div className='flex flex-col items-center space-y-0 w-full px-2 md:px-0 relative z-10'>
          <img
            src='/assets/newlogo.png'
            alt='House of Aerawat'
            className='w-[240px] md:w-[350px] mx-auto'
          />
          <p className='max-w-[95vw] lg:max-w-[950px] text-[14px] md:text-[16px] text-[#222222] mt-2'>
            At House of Aerawat, we take pride in bringing India's finest
            traditions to you. Each piece – whether it's Jewellery, Marble Dust
            Paintings, Chandan Bead Chandeliers, 7 Chakra Crystal Artefacts, or
            more – is crafted by skilled artisans using time-honoured
            techniques. We create not just luxury, but meaningful pieces that
            connect you with heritage, beauty, and craftsmanship.
          </p>
        </div>

        {/* Shop by products Section */}
        <div className='w-full flex flex-col items-center justify-center px-2 relative z-10'>
          <h3 className='text-[17px] md:text-[19px] font-semibold mb-3 text-center'>
            Shop by products
          </h3>
          <div className='flex flex-col space-y-4 md:flex-row md:flex-wrap md:justify-center md:items-center md:gap-x-12 md:space-y-0'>
            <span className='text-[15px] md:text-base text-center'>
              Fine Jewels
            </span>
            <span className='text-[15px] md:text-base text-center'>
              Shringaar
            </span>
            <span className='text-[15px] md:text-base text-center'>
              Kalapatt
            </span>
            <span className='text-[15px] md:text-base text-center'>
              Kaashth Kala
            </span>
            <span className='text-[15px] md:text-base text-center'>
              Crystals
            </span>
            <span className='text-[15px] md:text-base text-center'>
              Treasured Gifts
            </span>
          </div>
        </div>

        {/* Curious about something? Heading */}
        <h3 className='text-[17px] md:text-[19px] tracking-wide text-[#222222] font-semibold mb-4 text-center px-2 relative z-10'>
          Curious about something? Contact us today:
        </h3>

        {/* Contact Box */}
        <div className='flex flex-col sm:flex-row items-center justify-center bg-white/40 rounded-xl border border-gray-300 px-4 sm:px-12 md:px-16 py-4 max-w-[95vw] md:max-w-2xl mx-auto mb-6 shadow-sm relative z-10'>
          {/* Phone Section */}
          <div className='flex flex-row items-center flex-1 min-w-0 py-2 sm:py-6 w-full sm:w-auto justify-start sm:justify-center'>
            <div className='flex items-center justify-center bg-[#eed5ca] rounded-full w-8 h-8 md:w-10 md:h-10 mr-4'>
              {/* Phone Icon */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-4 h-4 md:w-6 md:h-6 text-[#b48a78]'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm12-12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 12a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                />
              </svg>
            </div>
            <div className='text-left space-y-1 text-[#222222] text-[15px] md:text-base'>
              <div>+91 1234567890</div>
              <div>+91 9087654321</div>
            </div>
          </div>
          {/* Vertical Divider */}
          <div className='hidden sm:block h-12 sm:h-[90px] w-px bg-[#eed5ca] mx-4 sm:mr-8'></div>
          {/* Email Section */}
          <div className='flex flex-row items-center flex-1 min-w-0 py-2 sm:py-6 w-full sm:w-auto justify-start sm:justify-center'>
            <div className='flex items-center justify-center bg-[#eed5ca] rounded-full w-8 h-8 md:w-10 md:h-10 mr-4'>
              {/* Email Icon */}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='w-4 h-4 md:w-6 md:h-6 text-[#b48a78]'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4'
                />
              </svg>
            </div>
            <div className='text-left space-y-1 text-[15px] md:text-base'>
              <div>houseofaerawat@gmail.com</div>
              <div>info@hoa.in</div>
            </div>
          </div>
        </div>

        {/* Social Icons */}
        <div className='flex flex-row items-center justify-center gap-4 md:gap-8 mb-8 relative z-10'>
          <a
            href='https://instagram.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center bg-[#eed5ca] hover:scale-110 transition-transform'>
              <img
                src='/assets/footer/instagram.svg'
                alt='Instagram'
                className='w-4 h-4 md:w-6 md:h-6'
              />
            </div>
          </a>
          <a
            href='https://facebook.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12  rounded-full flex items-center justify-center bg-[#eed5ca] hover:scale-110 transition-transform'>
              <img
                src='/assets/footer/facebook.svg'
                alt='Facebook'
                className='w-4 h-4 md:w-6 md:h-6'
              />
            </div>
          </a>
          <a
            href='https://linkedin.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <div className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12  rounded-full flex items-center justify-center bg-[#eed5ca] hover:scale-110 transition-transform'>
              <img
                src='/assets/footer/linkedin.svg'
                alt='LinkedIn'
                className='w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5'
              />
            </div>
          </a>
          <a
            href='https://wa.me/911234567890'
            target='blak'
            rel='noopener noreferrer'
          >
            <div className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12  rounded-full flex items-center justify-center bg-[#eed5ca] hover:scale-110 transition-transform'>
              <img
                src='/assets/footer/whatsapp.svg'
                alt='WhatsApp'
                className='w-4 h-4 md:w-6 md:h-6'
              />
            </div>
          </a>
        </div>
      </footer>
      {/* Copyright Bar */}
      <div
        className='w-full bg-[#193774] py-6 md:px-4 flex flex-col lg:flex-row items-center md:items-center lg:justify-between text-white text-[13px] md:text-[15px]'
        style={{ zIndex: 20 }}
      >
        <div className='w-auto text-center lg:text-left'>
          © House of Aerawat 2025. All rights reserved.
        </div>
        <div className='w-auto flex flex-row lg:flex-row space-x-2 md:space-x-4 lg:space-x-6 pt-2 lg:pt-0 lg:text-right text-center md:mt-0'>
          <a href='#' className='hover:text-yellow-700 underline'>
            Return & Refund Policy.
          </a>
          <a href='#' className='hover:text-yellow-700 underline'>
            Privacy Policy.
          </a>
          <a href='#' className='hover:text-yellow-700 underline'>
            Terms & Conditions.
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
