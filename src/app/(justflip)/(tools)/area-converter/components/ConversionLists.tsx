import React from 'react'
import ConversionLinks from './ConversionLinks';
import AboutConversions from './AboutConversions';

const ConversionLists = () => {
  return (
    <>
    <section className='flex flex-col-reverse sm:flex sm:flex-row  gap-10'>
      <div>
        <AboutConversions/>
      </div>
      <div className='sm:w-80'>
        <p className="section-heading mb-1 text-center border-2 border-[#e1e8f2] bg-white shadow-[0_2px_10px_rgba(0,3,9,0.10)] rounded-lg px-2 py-3">Explore All Conversions</p>
        <ConversionLinks/>
      </div>
    </section>
    </>
  )
}

export default ConversionLists