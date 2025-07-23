'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Sample product data for Kashth Kala
const sampleProducts = [
  {
    id: '1',
    name: 'Sandalwood Mala Beads',
    price: 2200,
    originalPrice: 2800,
    products: 'kashth-kala',
    description:
      'Traditional 108-bead sandalwood mala for meditation and prayer. Authentic fragrant sandalwood.',
    fullDescription:
      'This authentic sandalwood mala consists of 108 carefully crafted beads made from genuine sandalwood. Known for its calming fragrance and spiritual significance, this mala is perfect for meditation, prayer, and mindfulness practices. Each bead is hand-polished to perfection.',
    images: [
      '/assets/products/product1.png',
      '/assets/products/cardimage.png',
      '/assets/img.jpg',
    ],
    specifications: {
      'Wood Type': 'Genuine Sandalwood',
      'Bead Count': '108 + 1 Guru Bead',
      'Bead Size': '8mm',
      Length: '34 inches',
      Finish: 'Natural Polish',
    },
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 56,
  },
  {
    id: '2',
    name: 'Rudraksha Seed Bracelet',
    price: 1200,
    originalPrice: 1500,
    products: 'kashth-kala',
    description:
      'Authentic 5-mukhi rudraksha seed bracelet for spiritual protection and peace.',
    fullDescription:
      'This powerful rudraksha bracelet features authentic 5-mukhi (5-faced) rudraksha seeds, known for their spiritual significance and protective properties. Traditionally worn for inner peace, clarity, and spiritual growth.',
    images: [
      '/assets/products/cardimage.png',
      '/assets/img2.jpg',
      '/assets/products/product1.png',
    ],
    specifications: {
      'Seed Type': '5-Mukhi Rudraksha',
      'Bead Count': '21 Beads',
      'Bead Size': '10mm',
      Length: 'Adjustable',
      Origin: 'Nepal',
    },
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 34,
  },
  {
    id: '3',
    name: 'Wooden Prayer Beads Set',
    price: 800,
    originalPrice: 1000,
    products: 'kashth-kala',
    description:
      'Handcrafted wooden prayer beads made from sacred rosewood. Perfect for daily meditation.',
    fullDescription:
      'This beautiful set of wooden prayer beads is handcrafted from sacred rosewood. Each bead is carefully shaped and polished, creating a smooth texture perfect for meditation and prayer practices. The natural wood grain makes each piece unique.',
    images: [
      '/assets/img3.jpg',
      '/assets/products/product1.png',
      '/assets/products/cardimage.png',
    ],
    specifications: {
      'Wood Type': 'Sacred Rosewood',
      'Bead Count': '54 Beads',
      'Bead Size': '12mm',
      Length: '28 inches',
      Finish: 'Hand Polished',
    },
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 28,
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
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-[#8B4513]'></div>
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
            href='/products/kashth-kala'
            className='bg-[#8B4513] text-white px-6 py-3 rounded-md hover:bg-[#A0522D] transition-colors'
          >
            Back to Kashth Kala
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
    <div className='min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b border-amber-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center space-x-2 py-4 text-sm'>
            <Link href='/' className='text-gray-500 hover:text-gray-700'>
              Home
            </Link>
            <span className='text-gray-400'>/</span>
            <Link
              href='/products/kashth-kala'
              className='text-gray-500 hover:text-gray-700'
            >
              Kashth Kala
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
                    className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-[#8B4513] ${
                      selectedImage === index
                        ? 'ring-2 ring-[#8B4513]'
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
              <div className='mt-4 bg-white rounded-lg p-6 shadow-sm border border-amber-200'>
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
                  className='border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8B4513]'
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
                      ? 'bg-[#8B4513] text-white hover:bg-[#A0522D] focus:ring-[#8B4513]'
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
                  className='p-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B4513]'
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

            {/* Spiritual benefits */}
            <div className='mt-8 border-t border-amber-200 pt-8'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Spiritual Benefits
              </h3>
              <div className='grid grid-cols-2 gap-4 text-sm text-gray-600'>
                <div className='flex items-center'>
                  <svg
                    className='h-5 w-5 text-amber-600 mr-2'
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
                    className='h-5 w-5 text-amber-600 mr-2'
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
                  Spiritual Protection
                </div>
                <div className='flex items-center'>
                  <svg
                    className='h-5 w-5 text-amber-600 mr-2'
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
                  Natural Fragrance
                </div>
                <div className='flex items-center'>
                  <svg
                    className='h-5 w-5 text-amber-600 mr-2'
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
                  Sacred Tradition
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
