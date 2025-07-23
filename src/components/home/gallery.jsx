// src/components/Content2.jsx
import Link from 'next/link';

const products = [
  {
    id: 1,
    image: '/assets/img4.jpg',
    title: 'Fine Jewellery',
    slug: 'fine-jewellery',
  },
  {
    id: 2,
    image: '/assets/img.jpg',
    title: 'Shringaar',
    slug: 'shringaar',
  },
  {
    id: 3,
    image: '/assets/img2.jpg',
    title: 'Kalapatt',
    slug: 'kalapatt',
  },
  {
    id: 4,
    image: '/assets/img.jpg',
    title: 'Crystals',
    slug: 'crystals',
  },
  {
    id: 5,
    image: '/assets/img2.jpg',
    title: 'Kashth Kala',
    slug: 'kashth-kala',
  },
  {
    id: 6,
    image: '/assets/img4.jpg',
    title: 'Treasured Gifts',
    slug: 'treasured-gifts',
  },
];

const Gallery = () => {
  return (
    <div className='w-full h-auto xl:h-[750px] flex items-center justify-center bg-white third'>
      <div className='flex flex-col gap-[10px] h-full max-w-full xl:max-w-[1440px] px-[15px] xl:px-[50px] py-[30px] xl:py-[70px]'>
        {/* Desktop Layout - Hidden on mobile/tablet */}
        <div className='hidden lg:block'>
          {/* Top Row */}
          <div className='flex gap-[10px] mb-[10px]'>
            {products.slice(0, 3).map((products, index) => (
              <Link
                href={`/products/${products.slug}`}
                key={products.id}
                className={`${
                  index === 0
                    ? 'w-[466px] xl:w-[658px]'
                    : 'w-[233px] xl:w-[431px]'
                } h-[213px] xl:h-[300px] rounded-[8px] border border-gray-300 overflow-hidden relative card group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
              >
                <img
                  src={products.image}
                  alt={products.title}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                />
                {/* Gradient overlay that fades from transparent to white */}
                <div className='absolute bottom-0 w-full h-[265px] bg-gradient-to-t from-white/95 via-white/70 via-white/40 to-transparent transition-opacity duration-300 group-hover:opacity-80'></div>
                {/* Text container */}
                <div className='absolute bottom-0 w-full text-center py-3 transition-transform duration-300 group-hover:translate-y-[-5px]'>
                  <h3 className='text-[#14397C] text-[22px] font-semibold transition-colors duration-300 group-hover:text-[#0f2a5a]'>
                    {products.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Row */}
          <div className='flex gap-[10px]'>
            {products.slice(3).map((products, index) => (
              <Link
                href={`/products/${products.slug}`}
                key={products.id}
                className={`${
                  index === 2
                    ? 'w-[466px] xl:w-[658px]'
                    : 'w-[233px] xl:w-[431px]'
                } h-[213px] xl:h-[300px] rounded-[8px] border border-gray-300 overflow-hidden relative card group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}
              >
                <img
                  src={products.image}
                  alt={products.title}
                  className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                />
                {/* Gradient overlay that fades from transparent to white */}
                <div className='absolute bottom-0 w-full h-[265px] bg-gradient-to-t from-white/95 via-white/70 via-white/40 to-transparent transition-opacity duration-300 group-hover:opacity-80'></div>
                {/* Text container */}
                <div className='absolute bottom-0 w-full text-center py-3 transition-transform duration-300 group-hover:translate-y-[-5px]'>
                  <h3 className='text-[#14397C] text-[22px] font-semibold transition-colors duration-300 group-hover:text-[#0f2a5a]'>
                    {products.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile/Tablet Layout - Stacked cards */}
        <div className='lg:hidden flex flex-col gap-[8px] w-full'>
          {products.map((products) => (
            <Link
              href={`/products/${products.slug}`}
              key={products.id}
              className='w-full h-[280px] sm:h-[320px] md:h-[350px] rounded-[8px] border border-gray-300 overflow-hidden relative card group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]'
            >
              <img
                src={products.image}
                alt={products.title}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
              />
              {/* Gradient overlay that fades from transparent to white */}
              <div className='absolute bottom-0 w-full h-[180px] bg-gradient-to-t from-white/95 via-white/70 via-white/40 to-transparent transition-opacity duration-300 group-hover:opacity-80'></div>
              {/* Text container */}
              <div className='absolute bottom-0 w-full text-center py-3 transition-transform duration-300 group-hover:translate-y-[-5px]'>
                <h3 className='text-[#14397C] text-[20px] font-semibold text-sm sm:text-base transition-colors duration-300 group-hover:text-[#0f2a5a]'>
                  {products.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
