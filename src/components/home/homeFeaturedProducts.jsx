// // src/components/HomeFeaturedProducts.jsx
// 'use client';
// import React from 'react';
// import { useRouter } from 'next/navigation';
// import products from '../../Data/products';
// import ProductCard from '../constants/productCard';

// function HomeFeaturedProducts() {
//   const router = useRouter();

//   return (
//     <div className='max-w-[1340px] mx-auto px-4 py-8'>
//       {/* Top description text */}
//       <p className='text-gray-600 mb-2 text-left'>
//         Lorem ipsum dolor sit amet consectetur.
//       </p>

//       {/* Featured Products heading */}
//       <h2 className='text-3xl font-bold mb-8 text-left'>Featured Products</h2>

//       {/* Products grid */}
//       <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 xl:gap-8'>
//         {products.products.map((product, index) => (
//           <div
//             key={product.id}
//             className={`${
//               index >= 10 ? 'hidden md:block lg:block xl:block' : ''
//             }
//                        ${
//                          index >= 12
//                            ? 'hidden md:hidden lg:hidden xl:block'
//                            : ''
//                        }`}
//           >
//             <ProductCard
//               product={product}
//               onClick={() => router.push(`/products/${product.id}`)}
//             />
//           </div>
//         ))}
//       </div>

//       {/* View All Products button - full width on mobile */}
//       <div className='mt-8 flex justify-center'>
//         <button
//           className='flex items-center justify-center gap-2 rounded-[4px] bg-[#14397C] text-white px-6 py-3 hover:bg-[#38445a] transition-colors duration-300 cursor-pointer
//             w-full max-w-[480px] sm:w-auto'
//           onClick={() => router.push('/kashth-kala')}
//         >
//           <span>View All Products</span>
//           <img src='/assets/cart.svg' alt='Arrow icon' className='w-5 h-5' />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default HomeFeaturedProducts;
