'use client'
import React from 'react'

import { useAuthStore } from '@/src/stores/auth.store'
import ProfileMain from './user/ProfileMain'
import BrokerProfile from './Broker/BrokerProfile'

const ProfileRouter = () => {
    const authType = useAuthStore((state) => state.authType)
    console.log(authType);
    

    if(authType === 'visitor') return <ProfileMain/>
    return <BrokerProfile />
}

export default ProfileRouter