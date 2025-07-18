import React from 'react'

function Aboutbanner() {
  return (
    <div className="w-full h-[500px] md:h-[584px] relative overflow-hidden">
      <img
        src="/assets/about/aboutbanner.png"
        alt="About Banner"
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
      {/* Optional: Overlay and title */}
      {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow-lg">About Us</h1>
      </div> */}
    </div>
  )
}

export default Aboutbanner
