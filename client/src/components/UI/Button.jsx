import React from 'react'

const Button = () => {

  const slider = [
    '',
  ]

  const scrollRef = useRef(null);
  
    const handleScrollLeft = () => {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    };
  
    const handleScrollRight = () => {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    };
  return (
    <>
      <button
        onClick={handleScrollLeft}
        className="
          absolute left-4 top-1/2 transform -translate-y-1/2
          flex items-center justify-center
          h-16 w-16
          rounded-xl shadow-2xl
          bg-amber-800 text-white text-3xl font-bold
          cursor-pointer
          transition-all duration-300
          hover:bg-amber-600 hover:-translate-y-1
          z-10
        "
        aria-label="Scroll Left"
      >
        {'<'}
      </button>

      <button
        onClick={handleScrollRight}
        className="
          absolute right-4 top-1/2 transform -translate-y-1/2
          flex items-center justify-center
          h-16 w-16
          rounded-xl shadow-2xl
          bg-amber-800 text-white text-3xl font-bold
          cursor-pointer
          transition-all duration-300
          hover:bg-amber-600 hover:-translate-y-1
          z-10
        "
        aria-label="Scroll Right"
      >
        {'>'}
      </button>
    </>
  )
}

export default Button