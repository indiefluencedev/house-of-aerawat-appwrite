'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AboutCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample carousel data - you can replace with your actual content
  const carouselData = [
    {
      id: 1,
      image: '/assets/about/aboutcaraousel.png',
    //   title: 'Empowering Communities Through Craft',
      description: 'Lorem ipsum dolor sit amet consectetur. Pellentesque lacus vestibulum vivamus arcu erat eros ultricies risus vestibulum. Congue blandit magnis cras mauris justo. Lorem ipsum dolor sit amet consectetur. Pellentesque lacus vestibulum vivamus arcu erat eros ultricies risus vestibulum. '
    },
    {
      id: 2,
      image: '/assets/about/aboutbanner.png',
    //   title: 'Traditional Artisans at Work',
      description: 'Lorem ipsum dolor sit amet consectetur. Pellentesque lacus vestibulum vivamus arcu erat eros ultricies risus vestibulum. Congue blandit magnis cras mauris justo. Lorem ipsum dolor sit amet consectetur. Pellentesque lacus vestibulum vivamus arcu erat eros ultricies risus vestibulum. '
    },
    {
      id: 3,
      image: '/assets/about/aboutcaraousel.png',
    //   title: 'Sustainable Practices',
      description: 'Lorem ipsum dolor sit amet consectetur. Pellentesque lacus vestibulum vivamus arcu erat eros ultricies risus vestibulum. Congue blandit magnis cras mauris justo. Lorem ipsum dolor sit amet consectetur. Pellentesque lacus vestibulum vivamus arcu erat eros ultricies risus vestibulum. '
    },
    {
      id: 4,
      image: '/assets/about/aboutbanner.png',
    //   title: 'Quality and Excellence',
      description: 'Lorem ipsum dolor sit amet consectetur. Pellentesque lacus vestibulum vivamus arcu erat eros ultricies risus vestibulum. Congue blandit magnis cras mauris justo. Lorem ipsum dolor sit amet consectetur. Pellentesque lacus vestibulum vivamus arcu erat eros ultricies risus vestibulum. '
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  // Removed auto-play functionality - slides only change on button click

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Carousel Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselData.map((slide, index) => (
          <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
            {/* Background Image */}
            <div
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />

            {/* Black Overlay */}
            <div className="absolute" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/55 py-[16px] px-[15px] md:px-[35px] md:py-[21px]">
              <div className="max-w-6xl mx-auto text-white">
                <p className="text-[14px] md:text-[16px] lg:text-[17px] md:leading-relaxed opacity-90 text-center">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 cursor-pointer text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 cursor-pointer text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators - Commented out */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}

      {/* Progress Bar - Commented out */}
      {/* <div className="absolute top-0 left-0 w-full h-1 bg-black/20">
        <div
          className="h-full bg-white transition-all duration-700 ease-in-out"
          style={{ width: `${((currentSlide + 1) / carouselData.length) * 100}%` }}
        />
      </div> */}
    </div>
  );
};

export default AboutCarousel;
