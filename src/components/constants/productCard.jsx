'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({
  product,
  onClick,
  showPrice = true,
  className = '',
  imageClassName = 'h-[220px] md:h-[271px] xl:h-[380px]',
  products = 'fine-jewellery', // Add products prop for dynamic routing
}) => {
  // Handle wishlist functionality
  const handleWishlistClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product.id);
  };

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Image container */}
      <div
        className={`relative ${imageClassName} w-full overflow-hidden bg-gray-100`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className='object-cover'
        />
        {/* Heart icon */}
        <button
          onClick={handleWishlistClick}
          className='absolute top-2 right-2 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full transition-all duration-200 z-10'
        >
          <img
            src='/assets/heart.svg'
            alt='Add to wishlist'
            className='w-5 h-5'
          />
        </button>
      </div>

      {/* Product info */}
      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-2 line-clamp-2'>
          {product.name}
        </h3>
        {showPrice &&
          (product.price > 0 ? (
            <p className='text-xl font-bold text-gray-800'>
              ₹{product.price.toFixed(2)}
            </p>
          ) : (
            <p className='text-xl font-bold text-gray-800'>Prices On Demand</p>
          ))}
      </div>
    </div>
  );
};

export default ProductCard;
