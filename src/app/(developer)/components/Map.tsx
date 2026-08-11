import React from 'react'
import MapContainer from './MapContainer'
import { Builder } from '@/src/types'

export interface MapProps {
  builder?: Builder;
}

function Map({ builder }: MapProps) {
  return (
    <div className='w-full'>
      <MapContainer builder={builder} />
    </div>
  )
}

export default Map