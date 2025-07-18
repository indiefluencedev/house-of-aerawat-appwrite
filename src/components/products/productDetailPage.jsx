'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function ProductDetailPage({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [dropdownHeights, setDropdownHeights] = useState({});
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // Handle add to cart functionality
  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', { productId: product.id, quantity });
  };

  // Handle add to wishlist functionality
  const handleAddToWishlist = () => {
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product.id);
  };

  // Get product images
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ['/assets/products/cardimage.png'];

  const shippingRef = useRef(null);
  const returnRef = useRef(null);

  // Calculate dropdown heights when they open
  useEffect(() => {
    if (openDropdowns.shipping && shippingRef.current) {
      setDropdownHeights((prev) => ({
        ...prev,
        shipping: shippingRef.current.scrollHeight,
      }));
    }
    if (openDropdowns.return && returnRef.current) {
      setDropdownHeights((prev) => ({
        ...prev,
        return: returnRef.current.scrollHeight,
      }));
    }
  }, [openDropdowns]);

  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-gray-900 mb-2'>
            Product Not Found
          </h2>
          <p className='text-gray-600 mb-4'>
            The requested product could not be found.
          </p>
          <Link
            href='/products'
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  return (
    <div className='min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-lg overflow-hidden'>
          <div className='p-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Product Images */}
              <div>
                {/* Main Image Carousel */}
                <div className='relative w-full h-[300px] md:h-[467px] overflow-hidden mb-4'>
                  <div
                    className='flex transition-transform duration-500 ease-in-out h-full'
                    style={{ transform: `translateX(-${activeImage * 100}%)` }}
                  >
                    {productImages.map((image, index) => (
                      <div
                        key={index}
                        className='w-full h-full flex-shrink-0 flex items-center justify-center'
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          width={467}
                          height={467}
                          className='h-[300px] md:h-[467.2px] w-full object-cover'
                        />
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={() =>
                      setActiveImage(
                        activeImage > 0
                          ? activeImage - 1
                          : productImages.length - 1
                      )
                    }
                    className='absolute left-1 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200'
                  >
                    <svg
                      className='w-6 h-6 text-gray-700'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 19l-7-7 7-7'
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() =>
                      setActiveImage(
                        activeImage < productImages.length - 1
                          ? activeImage + 1
                          : 0
                      )
                    }
                    className='absolute right-1 top-1/2 transform -translate-y-1/2 bg-transparent cursor-pointer bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200'
                  >
                    <svg
                      className='w-6 h-6 text-gray-700'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                </div>

                {/* Thumbnail Navigation */}
                <div className='grid grid-cols-4 gap-2'>
                  {productImages.map((thumb, index) => (
                    <div
                      key={index}
                      className={`w-[80px] h-[80px] md:h-[128px] md:w-[128px] flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        activeImage === index
                          ? 'border-[#14397C] ring-2 ring-[#14397C]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setActiveImage(index)}
                    >
                      <Image
                        src={thumb}
                        alt={`Thumbnail ${index + 1}`}
                        width={128}
                        height={128}
                        className='w-[80px] h-[80px] md:w-[128px] md:h-[128px] object-cover'
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h1 className='text-[28px] md:text-[32px] font-bold mb-2'>
                  {product.name}
                </h1>
                <p className='text-[22px] md:text-[28px] font-semibold text-gray-800 mb-4'>
                  {product.price > 0
                    ? `₹${product.price.toFixed(2)}`
                    : 'Price on Demand'}
                </p>

                <div className='mb-6 flex items-center'>
                  <label className='text-[16px] font-semibold text-black'>
                    Quantity:
                  </label>
                  <div className='relative ml-3'>
                    <select
                      className='border-1 border-gray-500 cursor-pointer font-medium rounded px-3 py-2 pr-8 w-20 appearance-none bg-white'
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <div className='absolute inset-y-0 right-3 flex items-center pointer-events-none'>
                      <svg
                        className='w-4 h-4 text-black font-medium cursor-pointer'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M19 9l-7 7-7-7'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className='mb-6'>
                  <p className='text-gray-700'>
                    {product.description || 'No description available.'}
                  </p>
                </div>

                {/* Full Width Stacked Buttons */}
                <div className='space-y-3 mb-8'>
                  <button
                    onClick={handleAddToWishlist}
                    className='w-full cursor-pointer border border-gray-300 px-6 py-3 rounded hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2'
                  >
                    <span>Wishlist</span>
                    <img
                      src='/assets/heart.svg'
                      alt='heart'
                      className='w-5 h-5'
                    />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    className='w-full bg-[#14397C] text-white px-6 py-3 rounded cursor-pointer hover:bg-[#38445a] transition-colors duration-200 flex items-center justify-center gap-2'
                  >
                    <span>
                      {product.price > 0 ? 'Add to Cart' : 'Inquire Now'}
                    </span>
                    <img
                      src='/assets/products/Frame.svg'
                      alt='cart'
                      className='w-5 h-5'
                    />
                  </button>
                </div>

                {/* Buying Options */}
                <div className='space-y-4'>
                  <div className='border-b pb-2'>
                    <div
                      className='flex justify-between items-center cursor-pointer py-2 hover:bg-gray-50 transition-colors duration-200 rounded px-2'
                      onClick={() => toggleDropdown('shipping')}
                    >
                      <h3 className='font-medium'>Shipping & Return Policy</h3>
                      <span
                        className={`text-xl transition-transform duration-300 ease-in-out ${
                          openDropdowns.shipping ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        {openDropdowns.shipping ? '−' : '+'}
                      </span>
                    </div>
                    <div
                      className='overflow-hidden transition-all duration-300 ease-in-out'
                      style={{
                        height: openDropdowns.shipping
                          ? `${dropdownHeights.shipping || 0}px`
                          : '0px',
                        opacity: openDropdowns.shipping ? 1 : 0,
                      }}
                    >
                      <ul
                        ref={shippingRef}
                        className='mt-2 pl-5 list-disc space-y-1 pb-2'
                      >
                        {(
                          product.shippingPolicy || [
                            'Free shipping on orders over ₹500',
                            'Delivery within 3-5 business days',
                            'International shipping available',
                          ]
                        ).map((item, index) => (
                          <li key={index} className='text-sm text-gray-600'>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className='border-b pb-2'>
                    <div
                      className='flex justify-between items-center cursor-pointer py-2 hover:bg-gray-50 transition-colors duration-200 rounded px-2'
                      onClick={() => toggleDropdown('return')}
                    >
                      <h3 className='font-medium'>Return Policy</h3>
                      <span
                        className={`text-xl transition-transform duration-300 ease-in-out ${
                          openDropdowns.return ? 'rotate-180' : 'rotate-0'
                        }`}
                      >
                        {openDropdowns.return ? '−' : '+'}
                      </span>
                    </div>
                    <div
                      className='overflow-hidden transition-all duration-300 ease-in-out'
                      style={{
                        height: openDropdowns.return
                          ? `${dropdownHeights.return || 0}px`
                          : '0px',
                        opacity: openDropdowns.return ? 1 : 0,
                      }}
                    >
                      <ul
                        ref={returnRef}
                        className='mt-2 pl-5 list-disc space-y-1 pb-2'
                      >
                        {(
                          product.returnPolicy || [
                            '30-day return policy',
                            'Items must be unused with tags',
                            'Customer pays return shipping',
                          ]
                        ).map((item, index) => (
                          <li key={index} className='text-sm text-gray-600'>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
