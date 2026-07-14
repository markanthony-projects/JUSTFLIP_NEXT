'use client'
import React, { useEffect, useState } from 'react'

import { useAuthStore } from '@/src/stores/auth.store'


const BrokerStats = () => {
  const { user } = useAuthStore();

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(false)

  // useEffect(()=>{
  //   const fetchedProperties = async() =>{
  //     if(!user.id) return

  //     try{
  //       setLoading(true);

  //       const res = await JUSTFLIP.get('/')
  //     }
  //   }
  // })
  return (
    <div>

    </div>
  )
}

export default BrokerStats