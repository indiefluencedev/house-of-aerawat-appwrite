function Defining() {
  return (
    <div className="relative w-full h-[500px] md:h-[550px] overflow-hidden">
      {/* Background Image */}
      <img
        src="/assets/about/defining.svg"
        alt="About Banner"
        className="object-cover w-full h-full absolute inset-0"
      />

      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black/60 "></div> */}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-2 md:px-4 lg:px-[50px] text-center md:py-[150px]">
        {/* Heading */}
        <h2 className="text-white text-[28px] md:text-4xl lg:text-[45px] font-bold mb-8">
          Defining Our Distinction
        </h2>

        {/* Description */}
        <div className="max-w-[1240px]">
          <p className="text-white text-base md:text-[18px] tracking-wide leading-relaxed">
            In a world driven by speed and mass production, we choose intention. In the 21st century, where much of tradition risks being forgotten, we bring India's rare crafts back to life—with precision, purpose, and deep cultural pride. By working directly with skilled artisans and reviving age-old techniques, we offer creations that carry meaning, not just beauty. Our work is not about following trends—it's about preserving values in a fast-changing modern world.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Defining
