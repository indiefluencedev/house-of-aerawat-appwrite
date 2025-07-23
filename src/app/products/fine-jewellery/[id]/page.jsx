'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductById } from '@/data/fine-jewellery';

export default function FineJewelleryDetailPage({ params }) {
  const [activeImage, setActiveImage] = useState(0);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [dropdownHeights, setDropdownHeights] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const router = useRouter();

  // Get product from params
  useEffect(() => {
    const getProduct = async () => {
      const { id } = await params;
      const productData = getProductById(id);
      setProduct(productData);
    };
    getProduct();
  }, [params]);

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

  const descriptionRef = useRef(null);
  const additionalInfoRef = useRef(null);
  const shippingReturnRef = useRef(null);

  // Calculate dropdown heights when they open
  useEffect(() => {
    if (openDropdowns.description && descriptionRef.current) {
      setDropdownHeights((prev) => ({
        ...prev,
        description: descriptionRef.current.scrollHeight,
      }));
    }
    if (openDropdowns.additionalInfo && additionalInfoRef.current) {
      setDropdownHeights((prev) => ({
        ...prev,
        additionalInfo: additionalInfoRef.current.scrollHeight,
      }));
    }
    if (openDropdowns.shippingReturn && shippingReturnRef.current) {
      setDropdownHeights((prev) => ({
        ...prev,
        shippingReturn: shippingReturnRef.current.scrollHeight,
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
            href='/products/fine-jewellery'
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
          >
            Back to Fine Jewellery
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

  // Get product images
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ['/assets/products/cardimage.png'];

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
                      src='/assets/products/cart.svg'
                      alt='cart'
                      className='w-5 h-5'
                    />
                  </button>
                </div>

                {/* Product Information Toggles */}
                <div className='space-y-4'>
                  {/* Description Toggle */}
                  <div className='border-b pb-2'>
                    <div
                      className='flex justify-between items-center cursor-pointer py-2 hover:bg-gray-50 transition-colors duration-200 rounded px-2'
                      onClick={() => toggleDropdown('description')}
                    >
                      <h3 className='font-medium'>Description</h3>
                      <img
                        src={
                          openDropdowns.description
                            ? '/assets/svgs/drop-arrow.svg'
                            : '/assets/svgs/plus.svg'
                        }
                        alt={openDropdowns.description ? 'Collapse' : 'Expand'}
                        className='w-5 h-5 transition-transform duration-300 ease-in-out'
                      />
                    </div>
                    <div
                      className='overflow-hidden transition-all duration-300 ease-in-out'
                      style={{
                        height: openDropdowns.description
                          ? `${dropdownHeights.description || 0}px`
                          : '0px',
                        opacity: openDropdowns.description ? 1 : 0,
                      }}
                    >
                      <div
                        ref={descriptionRef}
                        className='mt-2 pb-2 text-sm text-gray-600'
                      >
                        {product.description || 'No description available.'}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Toggle */}
                  <div className='border-b pb-2'>
                    <div
                      className='flex justify-between items-center cursor-pointer py-2 hover:bg-gray-50 transition-colors duration-200 rounded px-2'
                      onClick={() => toggleDropdown('additionalInfo')}
                    >
                      <h3 className='font-medium'>Additional Information</h3>
                      <img
                        src={
                          openDropdowns.additionalInfo
                            ? '/assets/svgs/drop-arrow.svg'
                            : '/assets/svgs/plus.svg'
                        }
                        alt={
                          openDropdowns.additionalInfo ? 'Collapse' : 'Expand'
                        }
                        className='w-5 h-5 transition-transform duration-300 ease-in-out'
                      />
                    </div>
                    <div
                      className='overflow-hidden transition-all duration-300 ease-in-out'
                      style={{
                        height: openDropdowns.additionalInfo
                          ? `${dropdownHeights.additionalInfo || 0}px`
                          : '0px',
                        opacity: openDropdowns.additionalInfo ? 1 : 0,
                      }}
                    >
                      <div ref={additionalInfoRef} className='mt-2 pb-2'>
                        <ul className='ml-5 pl-5 list-disc space-y-1'>
                          {product.additionalInfo.map((item, index) => (
                            <li key={index} className='text-sm text-gray-600'>
                              <span className='font-medium mr-2'>
                                {item.split(':')[0]}:
                              </span>
                              <span>{item.split(':')[1]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Shipping & Return Policy Toggle */}
                  <div className='border-b pb-2'>
                    <div
                      className='flex justify-between items-center cursor-pointer py-2 hover:bg-gray-50 transition-colors duration-200 rounded px-2'
                      onClick={() => toggleDropdown('shippingReturn')}
                    >
                      <h3 className='font-medium'>Shipping & Return Policy</h3>
                      <img
                        src={
                          openDropdowns.shippingReturn
                            ? '/assets/svgs/drop-arrow.svg'
                            : '/assets/svgs/plus.svg'
                        }
                        alt={
                          openDropdowns.shippingReturn ? 'Collapse' : 'Expand'
                        }
                        className='w-5 h-5 transition-transform duration-300 ease-in-out'
                      />
                    </div>
                    <div
                      className='overflow-hidden transition-all duration-300 ease-in-out'
                      style={{
                        height: openDropdowns.shippingReturn
                          ? `${dropdownHeights.shippingReturn || 0}px`
                          : '0px',
                        opacity: openDropdowns.shippingReturn ? 1 : 0,
                      }}
                    >
                      <div ref={shippingReturnRef} className='mt-2 pb-2'>
                        <ul className='ml-5 pl-5 list-disc space-y-1'>
                          <li className='text-sm text-gray-600'>
                            Free shipping in India. For more information, please
                            refer to our shipping policy.
                          </li>
                          <li className='text-sm text-gray-600'>
                            We accept return within 7 days of the delivery date.
                            Return items must be unworn and without signs of
                            damage and must include all of the extras they were
                            sent with. Please check our return policy for more
                            information.
                          </li>
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
    </div>
  );
}
