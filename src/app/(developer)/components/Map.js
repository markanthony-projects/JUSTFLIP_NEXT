import React from 'react'
import MapContainer from './MapContainer'

function Map({ builder }) {
  return (
    <div className=''>
      <p className="text-xl font-normal text-[#000000 x] py-3">Map View</p>
      <div className=" mt-1 border-b-[0.5px] border-gray-500" />
      <div className='border border-gray-300 p-1 rounded mt-4'>
        <MapContainer builder={builder} />
      </div>

    </div>
  )
}

export default Map