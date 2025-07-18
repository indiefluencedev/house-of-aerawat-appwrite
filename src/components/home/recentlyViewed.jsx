// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import products from '../../Data/products';

// function RecentlyViewed() {
//   const router = useRouter();
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const carouselRef = useRef(null);

//   // Touch/swipe state
//   const [touchStart, setTouchStart] = useState(null);
//   const [touchEnd, setTouchEnd] = useState(null);
//   const [isTouchDevice, setIsTouchDevice] = useState(false);

//   // Calculate how many cards to show based on screen size
//   const [cardsToShow, setCardsToShow] = useState(4);
//   const [cardWidth, setCardWidth] = useState(20); // Width percentage for each card
//   const [imageHeight, setImageHeight] = useState('250px'); // Default height

//   // Minimum swipe distance (in px) to trigger slide
//   const minSwipeDistance = 50;

//   useEffect(() => {
//     // Detect if device supports touch
//     const checkTouchDevice = () => {
//       setIsTouchDevice(
//         'ontouchstart' in window ||
//         navigator.maxTouchPoints > 0 ||
//         navigator.msMaxTouchPoints > 0
//       );
//     };

//     checkTouchDevice();
//   }, []);

//   useEffect(() => {
//     const handleResize = () => {
//       const width = window.innerWidth;
//       if (width <= 320) {
//         setCardsToShow(1);
//         setCardWidth(100); // 100% width for 320px (1 card fully visible)
//       } else if (width <= 375) {
//         setCardsToShow(1);
//         setCardWidth(92); // 80% width for 375px (1 card fully visible + 20% of 2nd card)
//       } else if (width <= 360) {
//         setCardsToShow(1);
//         setCardWidth(100); // 80% width for 360px (1 card fully visible + 20% of 2nd card)
//       } else if (width < 480) {
//         setCardsToShow(2);
//         setCardWidth(50); // 50% width for mobile (2 cards)
//       } else if (width >= 1024) {
//         setCardsToShow(4);
//         setCardWidth(24); // 20% width (4 full cards + 20% of 5th card visible)
//       }
//       else if (width >= 768) {
//         setCardsToShow(3);
//         setCardWidth(30); // 20% width (4 full cards + 20% of 5th card visible)
//       }

//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // Set image height based on screen size
//   useEffect(() => {
//     const updateImageHeight = () => {
//       const width = window.innerWidth;
//       if (width <= 375) {
//         setImageHeight('270px');
//       } else if (width <= 360) {
//         setImageHeight('270px');
//       } else if (width <= 320) {
//         setImageHeight('320px');
//       } else if (width >= 640 && width < 768) {
//         setImageHeight('320px');
//       } else if (width >= 768 && width < 1280) {
//         setImageHeight('270px');
//       } else if (width >= 1280) {
//         setImageHeight('390px');
//       } else {
//         setImageHeight('250px');
//       }
//     };

//     updateImageHeight();
//     window.addEventListener('resize', updateImageHeight);
//     return () => window.removeEventListener('resize', updateImageHeight);
//   }, []);

//   // Calculate total slides - can slide until we reach the end
//   const totalSlides = Math.max(0, products.products.length - cardsToShow);

//   const nextSlide = () => {
//     if (isTransitioning || currentSlide >= totalSlides) return;
//     setIsTransitioning(true);
//     setCurrentSlide((prev) => prev + 1);
//     setTimeout(() => setIsTransitioning(false), 300);
//   };

//   const prevSlide = () => {
//     if (isTransitioning || currentSlide <= 0) return;
//     setIsTransitioning(true);
//     setCurrentSlide((prev) => prev - 1);
//     setTimeout(() => setIsTransitioning(false), 300);
//   };

//   // Touch event handlers
//   const onTouchStart = (e) => {
//     // Only enable touch on mobile/tablet screens (< 1024px)
//     if (window.innerWidth >= 1024 || !isTouchDevice) return;

//     setTouchEnd(null);
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const onTouchMove = (e) => {
//     // Only enable touch on mobile/tablet screens (< 1024px)
//     if (window.innerWidth >= 1024 || !isTouchDevice) return;

//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const onTouchEnd = () => {
//     // Only enable touch on mobile/tablet screens (< 1024px)
//     if (window.innerWidth >= 1024 || !isTouchDevice) return;

//     if (!touchStart || !touchEnd) return;

//     const distance = touchStart - touchEnd;
//     const isLeftSwipe = distance > minSwipeDistance;
//     const isRightSwipe = distance < -minSwipeDistance;

//     if (isLeftSwipe && currentSlide < totalSlides) {
//       nextSlide();
//     } else if (isRightSwipe && currentSlide > 0) {
//       prevSlide();
//     }
//   };

//   // Calculate the transform value to slide one card at a time
//   const getTransform = () => {
//     // Each slide moves by one card width
//     const baseTransform = currentSlide * cardWidth;
//     return `translateX(-${baseTransform}%)`;
//   };

//   return (
//     <div className="max-w-[1340px] mx-auto px-4 py-16">
//       {/* Top description text */}
//       <p className="text-gray-600 mb-2 text-left">
//         Lorem ipsum dolor sit amet consectetur.
//       </p>

//       {/* Featured Products heading */}
//       <h2 className="text-3xl font-bold mb-8 text-left">Recently Viewed Items</h2>

//       {/* Carousel Container */}
//       <div className="relative">
//         {/* Products carousel */}
//         <div
//           className="overflow-hidden rounded-lg"
//           ref={carouselRef}
//           onTouchStart={onTouchStart}
//           onTouchMove={onTouchMove}
//           onTouchEnd={onTouchEnd}
//         >
//           <div
//             className="flex transition-transform duration-300 ease-in-out"
//             style={{
//               transform: getTransform(),
//             }}
//           >
//             {products.products.map((product, index) => (
//               <div
//                 key={product.id}
//                 className="flex-shrink-0 px-2"
//                 style={{ width: `${cardWidth}%` }}
//               >
//                 <div
//                   className="group overflow-hidden cursor-pointer"
//                   onClick={() => router.push(`/products/${product.id}`)}
//                 >
//                   {/* Image container */}
//                   <div
//                     className="rounded-[6px] md:rounded-[8px] w-full relative overflow-hidden"
//                     style={{
//                       height: imageHeight
//                     }}
//                   >
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                     {/* Heart icon */}
//                     <div className="absolute bottom-3 right-3">
//                       <img
//                         src="/assets/products/cardheart.svg"
//                         alt="Add to favorites"
//                         className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-200 hover:opacity-80"
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                     </div>
//                   </div>

//                   {/* Product info */}
//                   <div className="p-2 text-center">
//                     <h3 className="font-medium text-[16px] mb-1 text-[#777777]">{product.name}</h3>
//                     {product.price > 0 ? (
//                       <p className="text-lg font-semibold text-gray-900">
//                         ₹{product.price.toFixed(2)}
//                       </p>
//                     ) : (
//                       <p className="text-[18px] font-medium text-gray-900">Prices On Demand</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Navigation buttons */}
//         <div className="flex justify-center items-center gap-4 mt-6">
//           <button
//             onClick={prevSlide}
//             disabled={isTransitioning || currentSlide <= 0}
//             className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
//           >
//             <svg
//               className="w-5 h-5 text-gray-600 transform rotate-180"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>

//           <button
//             onClick={nextSlide}
//             disabled={isTransitioning || currentSlide >= totalSlides}
//             className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 cursor-pointer"
//           >
//             <svg
//               className="w-5 h-5 text-gray-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RecentlyViewed;
