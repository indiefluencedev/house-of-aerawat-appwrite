// import '../../css/content.css';

const PurchaseSupport = () => {
  const cardData = [
    {
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet consectetur. Sagittis ipsum ante fusce malesuada condimentum at suscipit."
    },
    {
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet consectetur. Sagittis ipsum ante fusce malesuada condimentum at suscipit."
    },
    {
      title: "Lorem ipsum dolor",
      description: "Lorem ipsum dolor sit amet consectetur. Sagittis ipsum ante fusce malesuada condimentum at suscipit."
    }
  ];

  const CardComponent = ({ data, className = "" }) => (
    <div
      className={`w-full max-w-full lg:w-[317.33px] h-[155px] xl:w-[500px] xl:h-[186px] bg-white/10 backdrop-blur-xl border border-gray-300 shadow-lg rounded-xl p-4 xl:p-6 flex items-center gap-5 transition-all duration-300 hover:scale-[1.02] hover:bg-white/15 ${className}`}
      style={{
        // boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      <img src="/assets/leaf-icon.svg" alt="Leaf Icon" className="w-11 h-11 " />
      <div>
        <h3 className="text-gray-800 text-[18px] md:text-[20px] font-semibold">{data.title}</h3>
        <p className="text-gray-500 text-[14px] md:text-[16px] lg:text-sm mt-1">{data.description}</p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-4/5 bg-white pt-10 pb-20 px-4 md:px-8 lg:px-4 flex flex-col justify-center items-center">
      <p className="mb-8 font-bold tracking-wdie text-[28px] md:text-[38px]">Your Purchase Supports</p>

      <img
        src="/assets/right-mandala.svg"
        alt="Left Decoration"
        className="absolute left-1 top-[62.5%] transform -translate-y-1/2 w-[199px] h-[405px]  z-0"
      />

      <img
        src="/assets/left-mandala.svg"
        alt="Right Decoration"
        className="absolute right-1 top-[62.5%] transform -translate-y-1/2 w-[199px] h-[405px] z-0"
      />

      {/* Glassmorphism Cards Container */}
      <div className="max-w-[1340px] w-full z-10 justify-center mx-auto">

        {/* Desktop and Large Tablet (1024px+) - 3 cards in one row */}
        <div className="hidden lg:flex gap-3 xl:gap-10 justify-center">
          {cardData.map((card, index) => (
            <CardComponent key={`desktop-${index}`} data={card} />
          ))}
        </div>



        {/* Mobile (480px and below) - 1 card per row, stacked vertically */}
        <div className="lg:hidden flex flex-col gap-3 items-center">
          {cardData.map((card, index) => (
            <CardComponent key={`mobile-${index}`} data={card} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default PurchaseSupport
