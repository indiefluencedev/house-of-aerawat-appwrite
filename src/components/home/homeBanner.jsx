import image from '@/../public/assets/banner.png';
import mobileImage from '@/../public/assets/mobilebanner.png';

function HomeBanner() {
  return (
    <div className='relative w-screen h-[600px] md:h-[730px] overflow-hidden'>
      {/* Background Image for desktop */}
      <div
        className='hidden md:block absolute inset-0 w-full h-full bg-cover bg-center'
        style={{ backgroundImage: `url(${image.src})` }}
      />
      {/* Background Image for mobile */}
      <div
        className='block md:hidden absolute inset-0 w-full h-full bg-cover bg-center'
        style={{ backgroundImage: `url(${mobileImage.src})` }}
      />
      {/* Content at bottom */}
      <div className='absolute bottom-0 left-0 z-10 w-full flex px-6 lg:px-10 xl:px-14 pb-10 md:pb-16'>
        <div className='max-w-xl'>
          <h1 className='block md:hidden text-4xl tracking-wide font-bold text-gray-900 mb-4'>
            Lorem ipsum dolor sit amet
          </h1>
          <p className='text-black text-[14px] md:text-[16px] tracking-wider mb-2'>
            Lorem ipsum dolor sit amet consectetur. Pellentesque tellus
            pellentesque volutpat eros sed magna. Malesuada sed lobortis orci
            leo leo at. At egestas purus dui mi.
          </p>
          <h1 className='md:block hidden text-4xl md:text-6xl tracking-wide font-bold text-gray-900 mb-6'>
            Lorem ipsum dolor sit amet
          </h1>
          <button className='bg-[#14397C] text-white w-[255px] h-[56px] px-[16px] py-[16px] rounded-md font-semibold flex items-center gap-3 hover:bg-[#323e53] transition'>
            Explore Kashth Kala
            <img src='/assets/cart.svg' alt='Button Icon' className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
