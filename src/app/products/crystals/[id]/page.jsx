'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Sample product data for Crystals
const sampleProducts = [
  {
    id: '1',
    name: 'Amethyst Healing Crystal',
    price: 1500,
    originalPrice: 1800,
    products: 'crystals',
    description:
      'Natural amethyst crystal for meditation and healing. Promotes calm and spiritual growth.',
    fullDescription:
      'This beautiful natural amethyst crystal is perfect for meditation, healing practices, and spiritual growth. Known for its calming properties, amethyst helps reduce stress and promotes inner peace. Each crystal is unique and hand-selected for its quality and energy.',
    images: [
      '/assets/products/product1.png',
      '/assets/products/cardimage.png',
      '/assets/img.jpg',
    ],
    specifications: {
      'Crystal Type': 'Natural Amethyst',
      Size: '3-4 inches',
      Weight: '200-250 grams',
      Origin: 'Brazil',
      Chakra: 'Crown & Third Eye',
    },
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 45,
  },
  {
    id: '2',
    name: 'Rose Quartz Heart',
    price: 800,
    originalPrice: 1000,
    products: 'crystals',
    description:
      'Heart-shaped rose quartz crystal symbolizing love and compassion.',
    fullDescription:
      'This heart-shaped rose quartz crystal is a powerful symbol of love, compassion, and emotional healing. Known as the stone of unconditional love, rose quartz helps open the heart chakra and promotes self-love and acceptance.',
    images: [
      '/assets/products/cardimage.png',
      '/assets/img2.jpg',
      '/assets/products/product1.png',
    ],
    specifications: {
      'Crystal Type': 'Natural Rose Quartz',
      Shape: 'Heart',
      Size: '2 inches',
      Weight: '80-100 grams',
      Chakra: 'Heart Chakra',
    },
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 32,
  },
  {
    id: '3',
    name: 'Clear Quartz Point',
    price: 600,
    originalPrice: 750,
    products: 'crystals',
    description:
      'Natural clear quartz crystal point for energy amplification and clarity.',
    fullDescription:
      'This natural clear quartz crystal point is known as the "master healer" crystal. It amplifies energy, enhances clarity of thought, and can be programmed for any healing purpose. Perfect for meditation and energy work.',
    images: [
      '/assets/img3.jpg',
      '/assets/products/product1.png',
      '/assets/products/cardimage.png',
    ],
    specifications: {
      'Crystal Type': 'Natural Clear Quartz',
      Shape: 'Terminated Point',
      Size: '4-5 inches',
      Weight: '150-200 grams',
      Clarity: 'High Grade',
    },
    inStock: true,
    featured: false,
    rating: 4.9,
    reviews: 38,
  },
];

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const foundProduct = sampleProducts.find((p) => p.id === params.id);
      setProduct(foundProduct);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Added to cart:', product.id, 'Quantity:', quantity);
    setIsAddingToCart(false);
  };

  const handleAddToWishlist = () => {
    console.log('Added to wishlist:', product.id);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-[#663399]'></div>
          <p className='mt-4 text-gray-600'>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            Product Not Found
          </h1>
          <p className='text-gray-600 mb-8'>
            Sorry, the product you're looking for doesn't exist.
          </p>
          <Link
            href='/products/crystals'
            className='bg-[#663399] text-white px-6 py-3 rounded-md hover:bg-[#7B3A9A] transition-colors'
          >
            Back to Crystals
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-purple-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-2 py-4 text-sm'>
            <Link href='/' className='text-gray-500 hover:text-gray-700'>
              Home
            </Link>
            <span className='text-gray-400'>/</span>
            <Link
              href='/products/crystals'
              className='text-gray-500 hover:text-gray-700'
            >
              Crystals
            </Link>
            <span className='text-gray-400'>/</span>
            <span className='text-gray-900 font-medium'>{product.name}</span>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start'>
          {/* Image gallery */}
          <div className='flex flex-col-reverse'>
            <div className='mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none'>
              <div className='grid grid-cols-4 gap-6'>
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-[#663399] ${
                      selectedImage === index
                        ? 'ring-2 ring-[#663399]'
                        : 'ring-1 ring-gray-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className='object-cover rounded-md'
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className='w-full aspect-square'>
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className='w-full h-full object-cover object-center sm:rounded-lg shadow-lg'
                priority
              />
            </div>
          </div>

          {/* Product info */}
          <div className='mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
              {product.name}
            </h1>

            <div className='mt-3'>
              <div className='flex items-center gap-4'>
                <p className='text-3xl tracking-tight text-gray-900 font-bold'>
                  ₹{product.price.toLocaleString()}
                </p>
                {product.originalPrice > product.price && (
                  <>
                    <p className='text-xl text-gray-500 line-through'>
                      ₹{product.originalPrice.toLocaleString()}
                    </p>
                    <span className='bg-red-500 text-white px-2 py-1 text-sm font-semibold rounded'>
                      -{discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className='mt-6'>
              <div className='flex items-center'>
                <div className='flex items-center'>
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <svg
                      key={rating}
                      className={`${
                        product.rating > rating
                          ? 'text-yellow-400'
                          : 'text-gray-200'
                      } h-5 w-5 flex-shrink-0`}
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <p className='ml-3 text-sm text-gray-600'>
                  {product.rating} out of 5 stars ({product.reviews} reviews)
                </p>
              </div>
            </div>

            <div className='mt-6'>
              <div className='text-base text-gray-700 space-y-6'>
                <p>{product.fullDescription}</p>
              </div>
            </div>

            {/* Specifications */}
            <div className='mt-8'>
              <h3 className='text-lg font-medium text-gray-900'>
                Specifications
              </h3>
              <div className='mt-4 bg-white rounded-lg p-6 shadow-sm border border-purple-200'>
                <dl className='grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2'>
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key}>
                        <dt className='text-sm font-medium text-gray-500'>
                          {key}
                        </dt>
                        <dd className='mt-1 text-sm text-gray-900'>{value}</dd>
                      </div>
                    )
                  )}
                </dl>
              </div>
            </div>

            <div className='mt-10 flex flex-col sm:flex-row gap-4'>
              <div className='flex items-center'>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className='border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#663399]'
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className='flex gap-4 flex-1'>
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isAddingToCart}
                  className={`flex-1 py-3 px-8 rounded-md text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    product.inStock && !isAddingToCart
                      ? 'bg-[#663399] text-white hover:bg-[#7B3A9A] focus:ring-[#663399]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAddingToCart
                    ? 'Adding...'
                    : product.inStock
                    ? 'Add to Cart'
                    : 'Out of Stock'}
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className='p-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#663399]'
                >
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Crystal benefits */}
            <div className='mt-8 border-t border-purple-200 pt-8'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Crystal Benefits
              </h3>
              <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                <div className='flex items-center'>
                  <svg
                    className='h-5 w-5 text-purple-500 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Natural Healing Energy
                </div>
                <div className='flex items-center'>
                  <svg
                    className='h-5 w-5 text-purple-500 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Meditation Support
                </div>
                <div className='flex items-center'>
                  <svg
                    className='h-5 w-5 text-purple-500 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Chakra Balancing
                </div>
                <div className='flex items-center'>
                  <svg
                    className='h-5 w-5 text-purple-500 mr-2'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                  Spiritual Growth
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
