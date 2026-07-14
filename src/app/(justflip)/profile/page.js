//this is the profile page.  It is a protected route, and can only be accessed by authenticated users.  It displays the user's profile information, and allows them to update their profile and change their password.
// 'use client'

import React, { Suspense } from 'react'
import ProfileRouter from './components/ProfileRouter'

export const metadata = {
	title: 'Profile | JustFlip',
	description: 'Manage your JustFlip profile and properties.',
}

const profile = () => {
	return (
		<div className="min-h-screen bg-gray-50/50 ">
			<Suspense fallback={
				<div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
				</div>
			}>
				<ProfileRouter />
			</Suspense>
		</div>
	)
}

export default profile
