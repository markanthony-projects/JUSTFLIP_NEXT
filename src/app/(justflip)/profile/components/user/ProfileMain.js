'use client'
//this file the parent layout of the entire profile page it brings up different components and stiches them together to build up a page for the user to interact and it just decides the order and layout of the child components. this can be said as the thin page for the profile section of the whole webpage.
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

//stores import
import { useAuthStore } from '@/src/stores/auth.store'
import { useToastStore } from '@/src/stores/toast.store'

//the component that tells about the user navigation path and where the user is currently in the website
import Breadcrumb from '@/src/components/organisms/breadCrumb'
import { USERS, JUSTFLIP } from '@/src/lib/axios/api'
import Modal from '@/src/components/organisms/Modal'

//components for this page under the profile section
import ProfileHeader from './ProfileHeader'
import ProfileStats from './ProfileStats'
import SavedProperties from './SavedProperties'

import ProfileSideBar from './ProfileSideBar'
import Loading from '../Loading'
import WishlistClient from '@/src/app/(justflip)/wishlist/WishlistClient'
import BrokerPropertyDashboard from '../Broker/BrokerPropertyDashboard'
import { useSearchParams } from 'next/navigation'

// INPUT CONFIG — drives what fields show inside the modal.
const fieldsArray = {
  all: [
    { key: 'name', label: 'Full name', type: 'text' },
    { key: 'email', label: 'Email ID', type: 'email' },
    { key: 'phone', label: 'phone number', type: 'text' }
  ],
  both: [
    { key: 'email', label: 'Email ID', type: 'email' },
    { key: 'phone', label: 'phone number', type: 'text' }
  ]
}

const ProfileMain = () => {
  const { user, updateUser, hydrated } = useAuthStore() //we are getting these informations from the auth store.
  // console.log(authType);
  // console.log(user);
  // console.log(user.createdAt);
  // console.log(dateCreated)
  // useEffect(() => {
  //     if(authType !== 'visitor'){

  //     }
  // })

  const addToast = useToastStore(state => state.addToast) //we are getting the useToast function from the toast store.

  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')

  const [activeNav, setActiveNav] = useState('overview')

  useEffect(() => {
    if(tabParam){
        setActiveNav(tabParam)
      }else{
        setActiveNav("overview")
      }
  },[tabParam])

  // modalMode: null (closed) | "all" | "both"
  // null means modal is closed. The string tells the modal which fields to show.
  const [modalMode, setModalMode] = useState(null)

  // formValues holds the current input values inside the modal.
  // Pre-filled from the store when the modal opens, updated as the user types.
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: ''
  })

  // Per-field validation errors — key is field name, value is the error string.
  const [errors, setErrors] = useState({})

  // Hydration guard — waits for Zustand persist to load from localStorage.without this the user namevalue will be null at the starting and might create a hydration error.
  if (!hydrated) {
    return (
      <Loading/>
    )
  }

  const openModal = mode => {
    setModalMode(mode)
    setFormValues({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setErrors({})
  }

  const closeModal = () => {
    setModalMode(null)
    setErrors({})
  }

  //the logic to handle the change of email or phone number of the user.
  // const handleEditClick = (fieldData) =>{
  //     // console.log("i was clicked");
  //     console.log(fieldData);

  //     setEditingField(fieldData); //set the editing field to the field that is being edited.
  //     setValidationError("") //reset the validation error message to an empty string.
  // }

  //this function validates the input made by the user while changing the there info.
  const validateField = (key, value) => {
    if (key === 'name') {
      if (!value || value.trim().length === 0) return 'name is required'
    }
    if (key === 'email' && value && value.trim().length > 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return 'enter a valid email.'
    }
    if (key === 'phone' && value && value.trim().length === 10) {
      if (!/^(?:\+91)?[6-9]\d{9}$/.test(value)) {
        return 'enter a valid phone number'
      }
    }
    return ''
  }

  const validateAll = () => {
    const fields = fieldsArray[modalMode] || []
    // console.log(fields)
    const newErrors = {}
    let isValid = true

    fields.forEach(({ key }) => {
      const error = validateField(key, formValues[key])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
      // if(fields.include('email' || 'number')){
      //     isValid = true
      // }
    })

    const emailFilled = formValues.email && formValues.email.trim() > 0
    const numberFilled = formValues.number && formValues.number.trim() > 0

    if (!emailFilled && !!numberFilled) {
      newErrors.email = 'please provide at least one - email or number'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  //the function that is responsible to actually make changes to the user info.
  const handleSave = async () => {
    if (!validateAll()) return

    //here we are going throught the user input and trying to create a payload of data to be sent to server and
    //also set the new informations to to User interface.
    const fields = fieldsArray[modalMode] || []
    const payload = {}
    fields.forEach(({ key }) => {
      if (formValues[key] && formValues[key].trim().length > 0) {
        payload[key] = formValues[key]
      }
    })
    console.log('payload being sent : ', payload)

    try {
      const response = await JUSTFLIP.put('/user/update', payload)
      // console.log(response);
      updateUser(payload)
      addToast({
        message: response?.data?.message || 'updated successfully',
        type: 'success'
      })
      closeModal()
    } catch (error) {
      console.log('type of error : ', error)
      addToast({
        message: error.response?.data?.error || 'update failed',
        type: 'error'
      })
    }
  }

  return (
    <div className='mb-10 min-h-screen'>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumb className='mb-6' items={[{ label: 'Profile' }]} />
      </motion.div>

      {/* main layout container */}
      <div className='flex flex-col gap-8 mt-6 max-w-6xl mx-auto'>
        
        {/* Main Content Area */}
        <motion.div 
          className='flex flex-col gap-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {activeNav === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className='lg:col-span-2 flex flex-col gap-8'>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <ProfileHeader onEditClick={() => openModal('all')} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <ProfileStats />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <SavedProperties />
                </motion.div>
              </div>

              {/* Right sidebar content (Overview specific) */}
              <div className="flex flex-col gap-8">
                <motion.div
                  whileHover={{ y: -2 }}
                  className="hidden sm:block relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  {/* Background Glow */}
                  <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-blue-50 blur-3xl opacity-70" />

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">
                        Account Details
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Manage your personal information.
                      </p>
                    </div>

                    <button
                      onClick={() => openModal('both')}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Details */}
                  <div className="relative z-10 mt-8 space-y-6">

                    {/* Email */}
                    <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50">

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Email Address
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                        {user?.email || "Not provided"}
                      </p>

                    </div>

                    {/* Phone */}
                    <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-blue-50">

                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Phone Number
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {user?.phone || "Not provided"}
                      </p>

                    </div>

                  </div>
                </motion.div>
              </div>
            </div>
          )}





          {activeNav === 'my-properties' && (
             <div className='bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden'>
               <BrokerPropertyDashboard />
             </div>
          )}

          {activeNav === 'wishlist' && (
             <div className='bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 relative overflow-hidden'>
               <WishlistClient isEmbedded={true} />
             </div>
          )}

        </motion.div>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {modalMode && (
          <Modal isOpen={!!modalMode} onClose={closeModal}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='space-y-6'
            >
              <h2 className='text-2xl font-bold text-gray-900 tracking-tight'>
                {modalMode === 'all' ? 'Edit Profile' : 'Change Info'}
              </h2>

              <div className="space-y-4">
                {(fieldsArray[modalMode] || []).map(({ key, label, type }) => (
                  <div key={key} className="space-y-1.5">
                    <label
                      htmlFor={key}
                      className='text-sm font-semibold text-gray-700'
                    >
                      {label}
                    </label>
                    <input
                      id={key}
                      type={type}
                      value={formValues[key]}
                      onChange={e =>
                        setFormValues(prev => ({ ...prev, [key]: e.target.value }))
                      }
                      className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-300 ${
                        errors[key] ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder={`Enter your ${label.toLowerCase()}`}
                    />
                    <AnimatePresence>
                      {errors[key] && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className='text-red-500 text-xs font-medium pl-1'
                        >
                          {errors[key]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className='flex justify-end gap-3 pt-4 border-t border-gray-100'>
                <button
                  onClick={closeModal}
                  className='px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className='px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 active:scale-95'
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProfileMain
