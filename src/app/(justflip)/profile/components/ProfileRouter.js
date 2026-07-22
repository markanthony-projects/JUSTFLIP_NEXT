'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { useAuthStore } from '@/src/stores/auth.store'
import ProfileMain from './user/ProfileMain'
import BrokerProfile from './Broker/BrokerProfile'

const ProfileRouter = () => {
    const router = useRouter()
    const authType = useAuthStore((state) => state.authType)
    const user = useAuthStore((state) => state.user)
    const hydrated = useAuthStore((state) => state.hydrated)
    
    // Track if this wrapper has safely finished mounting to the actual DOM
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Safely perform route transitions only after mounting and hydration complete
    useEffect(() => {
        if (isMounted && hydrated && !user) {
            router.replace('/login')
        }
    }, [isMounted, hydrated, user, router])

    // Hold rendering until component is mounted and Zustand storage is loaded
    if (!isMounted || !hydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!user) return null
    

    if (authType === 'visitor') return <ProfileMain />

    return <BrokerProfile />
}

export default ProfileRouter


