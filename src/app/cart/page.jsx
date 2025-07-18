'use client';
import React, { useState } from 'react';
import { Trash2, Heart, Share2 } from 'lucide-react';

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Gold-Plated Chain-Set of 3",
      price: 5432,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: 2,
      name: "Gold-Plated Chain-Set of 3",
      price: 5432,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=200&h=200&fit=crop&crop=center"
    },
    {
      id: 3,
      name: "Gold-Plated Chain-Set of 3",
      price: 5432,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=200&h=200&fit=crop&crop=center"
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="max-w-[1240px] mx-auto px-4 py-10 md:py-16 bg-white">
      {/* <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-0">
            {cartItems.map((item, idx) => (
              <div
                key={item.id}
                className={`${idx !== cartItems.length - 1 ? 'border-b border-gray-300 margin-bottom-0' : ''}`}
              >
                {/* Mobile Layout */}
                <div className="md:hidden">
                  <div className="flex gap-3 py-4 md:py-4 md:px-4">
                    {/* Left side - Image with rounded shape */}
                    <div className="relative">
                      {/* Checkbox positioned at top-left for mobile screen */}
                      <input
                        type="checkbox"
                        className="absolute top-2 left-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 z-10"
                      />
                      {/* Product Image with rounded shape */}
                      <div className="w-[127px] h-[143px] bg-gray-100 rounded-[4px] flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-[4px]"
                        />
                      </div>
                    </div>

                    {/* Right side - Product details */}
                    <div className="flex-1">
                      {/* Product Name */}
                      <h3 className="font-semibold text-gray-800 text-sm mb-1">{item.name}</h3>

                      {/* Price */}
                      <div className="text-lg font-semibold text-gray-800 mb-2">
                        ₹{item.price.toLocaleString()}
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">Qty:</span>
                        <div className="relative w-16">
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="border border-gray-300 rounded pl-3 pr-7 py-1 text-sm appearance-none w-full"
                          >
                            {[1, 2, 3, 4, 5].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                              <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                      </div>

                      {/* mobile Action Buttons in same row  */}
                      <div className="flex items-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="cart-action-btn delete flex items-center cursor-pointer gap-1 text-[#4E6984] hover:text-gray-800 md:text-sm text-[13px] border-r border-gray-500 "
                        >

                          <Trash2 size={14} className='md:block hidden' />
                          Delete
                        </button>
                        <button
                          className="cart-action-btn wishlist flex items-center cursor-pointer gap-1 text-[#4E6984] hover:text-gray-800 md:text-sm text-[13px] border-r border-gray-500 px-1"
                        >
                          <Heart size={14} className='md:block hidden'/>
                          Move to Wishlist
                        </button>
                        <button
                          className="cart-action-btn share flex items-center cursor-pointer gap-1 text-[#4E6984] hover:text-gray-800 md:text-sm text-[13px] pl-1"
                        >
                          <Share2 size={14} className='md:block hidden'/>
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop/Tablet Layout (unchanged) */}
                <div className="hidden md:flex items-center gap-4 p-6">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />

                  {/* Product Image */}
                  <div className="w-[127px] h-[143px] bg-gray-100 rounded-[4px] flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-[4px]"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <div className="relative w-16">
                        <select
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="border border-gray-300 rounded pl-3 pr-7 py-1 text-sm appearance-none w-full"
                        >
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                        {/* Custom dropdown icon */}
                        <span className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                          <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                            <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/*desktop Action Buttons */}
                    <div className="flex items-center gap-4 mt-3 cart-action-btn">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center cursor-pointer gap-1 text-red-600 hover:text-red-800 text-sm"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                      <button className="flex items-center cursor-pointer gap-1 text-gray-600 hover:text-gray-800 text-sm">
                        <Heart size={14} />
                        Move to Wishlist
                      </button>
                      <button className="flex items-center cursor-pointer gap-1 text-gray-600 hover:text-gray-800 text-sm">
                        <Share2 size={14} />
                        Share
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-800">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 p-6 rounded-lg h-fit">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#222222] font-medium text-[18px]">Subtotal ({cartItems.length} items):</span>
              <span className="font-semibold text-lg">₹{subtotal.toLocaleString()}</span>
            </div>

            <button className="w-full bg-[#14397C] hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors cursor-pointer">
              Proceed to Buy
            </button>

            {/* <div className="text-sm text-gray-500 text-center">
              <p>Free delivery on orders above ₹500</p>
              <p className="mt-1">Secure checkout with 256-bit SSL encryption</p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Continue Shopping */}
      {/* <div className="mt-8 text-center">
        <button className="text-blue-600 hover:text-blue-800 font-semibold">
          ← Continue Shopping
        </button>
      </div> */}
      <style jsx>{`
  /* Default font size for action buttons */
  .cart-action-btn {
    font-size: 16px;
  }

  /* 480px and below */
  @media (max-width: 480px) {
    .cart-action-btn {
      font-size: 16px;
    }

    .delete {
    padding-right: 8px;
    }

    .wishlist {
    padding: 0 8px 0 8px;
    }

    .share {
    padding-left: 8px;
    }
  }

  /* 480px and below */
  @media (max-width: 375px) {
    .cart-action-btn {
      font-size: 13px;
    }

    .delete {
    padding-right: 6px;
    }

    .wishlist {
    padding: 0 6px 0 6px;
    }

    .share {
    padding-left: 6px;
    }
  }

  /* 360px and below */
  @media (max-width: 360px) {
    .cart-action-btn {
      font-size: 12px;
    }

    .delete {
    padding-right: 6px;
    }

    .wishlist {
    padding: 0 6px 0 6px;
    }

    .share {
    padding-left: 6px;
    }
  }

  /* 320px and below */
  @media (max-width: 320px) {
    .cart-action-btn {
      font-size: 11px;
    }
  }
`}</style>
    </div>
  );
}

export default Cart;
