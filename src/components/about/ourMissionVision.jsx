function OurMissionVision() {
  return (
    <div className="w-full bg-gray-50 py-[50px] md:py-[100px] px-4">
      {/* Mission Section */}
      <div className="max-w-[1340px] mx-auto mb-[50px]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-14 xl:gap-30 items-center">
          {/* Mission Heading - Left Side */}
          <div className="text-right">
            <h2 className="text-4xl lg:text-[35px] font-bold text-[#222222] mb-4 tracking-wider">
              Our
              <br />
              Mission
            </h2>
          </div>

          {/* Mission Description - Right Side */}
          <div className="text-[#222222] leading-relaxed">
            <p className="text-[16px] md:text-left text-right">
              We are committed to keep India's rich artistic traditions close—preserving them not just as heritage, but as a living part of who we are. Our mission is to ensure these crafts never fade or grow distant. By working with skilled artisans, reviving forgotten techniques, and presenting them with integrity, we bring timeless Indian artistry into today's world—so it remains cherished, relevant, and forever connected to us all.
            </p>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="max-w-[1340px] mx-auto pt-8 md:pt-10 lg:pt-[50px]">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 lg:gap-14 xl:gap-30 items-center">
          {/* Vision Description - Left Side */}
          <div className="text-[#222222] leading-relaxed order-2 md:order-1">
            <p className="text-[16px] text-left md:text-right ">
              House of Aaravat envisions a world where every piece of jewelry and accessory tells a story—a narrative of individuality, a celebration of heritage, and a testament to craftsmanship. We aim to be more than a brand; we aspire to be a curator of moments, a creator of memories, and a bridge between tradition and self-expression. Through our creations, we aim to inspire connection, preserve culture, and craft beauty that resonates far beyond the surface.
            </p>
          </div>

          {/* Vision Heading - Right Side */}
          <div className="text-left order-1 md:order-2">
            <h2 className="text-4xl lg:text-[35px] font-bold text-gray-900 tracking-wider mb-4">
              Our
              <br />
              Vision
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurMissionVision;
