import React from 'react'

function Tradition() {
  return (
    <div className="w-full bg-gray-50 py-[80px] md:py-[100px] lg:py-[150px] px-4 lg:px-8">
      <div className="max-w-[1340px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-40 items-center">
          {/* Left side - Bold large text */}
          <div className="md:pl-24 lg:pl-4 xl:pl-8">
            <h2 className="text-[28px] md:text-[32px] xl:text-[35px] tracking-wide font-bold text-gray-900 leading-tight text-right">
              Tradition reimagined through artistry, designed to live with you.
            </h2>
          </div>

          {/* Right side - Description text */}
          <div className="md:pr-24 lg:pr-4 xl:pr-8">
            <p className="text-[#222222] text-[15px] md:text-[16px] tracking-wide">
              Rooted in legacy, House of Aerawat brings India's rich artistic traditions into the present—crafting meaningful luxury through age-old techniques, rare materials, and the hands of skilled artisans. Each creation is more than just a product: it's a reflection of heritage, a connection to culture, and a mark of elegance for those who value authenticity and beauty with purpose.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tradition
