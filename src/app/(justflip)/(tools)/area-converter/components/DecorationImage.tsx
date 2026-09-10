import Image from 'next/image';
import React from 'react'

const DecorationImage = () => {
  return (
    <div className='pointer-events-none absolute inset-x-0 top-40 sm:top-33 h-90 overflow-hidden bg-linear-to-r from-primary via-primary/5 to-primary '>
          <Image src='/banners/calculator.svg'   
            alt=""
            aria-hidden="true"
            width={300}
            height={40}
            className='absolute right-25 top-60 hidden w-130 -translate-y-1/2 opacity-90 lg:block xl:w-162.5'
          />
    </div>
        
  )
}

export default DecorationImage