// src/components/ProductCard.jsx
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
      className={`group overflow-hidden cursor-pointer product-card-hover ${className}`}
      onClick={onClick}
    >
      {/* Image container */}
      <div
        className={`rounded-[6px] md:rounded-[8px] w-full relative overflow-hidden ${imageClassName}`}
      >
        <Image
          src={product.image || '/assets/products/cardimage.png'}
          alt={product.name}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-300'
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
          priority={false}
        />
        {/* Heart icon */}
        <div className='absolute bottom-3 right-3'>
          <img
            src='/assets/products/cardheart.svg'
            alt='Add to favorites'
            className='w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-200 hover:opacity-80'
            onClick={handleWishlistClick}
          />
        </div>
      </div>

      {/* Product info */}
      <div className='p-2 text-center'>
        <h3 className='font-medium text-[16px] mb-1 text-[#777777] line-clamp-2'>
          {product.name}
        </h3>
        {showPrice &&
          (product.price > 0 ? (
            <p className='text-lg font-semibold text-gray-900'>
              ₹{product.price.toFixed(2)}
            </p>
          ) : (
            <p className='text-[18px] font-medium text-gray-900'>
              Prices On Demand
            </p>
          ))}
      </div>
    </div>
  );
};

export default ProductCard;
