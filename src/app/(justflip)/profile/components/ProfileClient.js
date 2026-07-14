'use client'

import React, { useState } from 'react'
// components
import Breadcrumb from '@/src/components/organisms/breadCrumb'
import Modal from '@/src/components/organisms/Modal'

//store
import { useAuthStore } from '@/src/stores/auth.store'
import { useToastStore } from '@/src/stores/toast.store'

//icons and other utilities
import { MdModeEdit } from 'react-icons/md'
import { CgArrowsExchange } from 'react-icons/cg'
import NotificationsSection from './user/NotificationsSection'

const ProfileClient = () => {
  const [editedName, setEditedName] = useState({})
  const [validationError, setValidationError] = useState('')

  //gettting the user information and some functions so as to perform actions from the zustand store.
  const { user, updateUser, hydrated } = useAuthStore()
  // console.log(user.name.split(" ")[0].charAt(0).toUpperCase().concat(user.name.split(" ")[1].charAt(0).toUpperCase()));
  // const initials = user.name.split(" ")[0].charAt(0).toUpperCase().concat(user.name.split(" ")[1].charAt(0).toUpperCase())
  console.log('user : ', user)
  const getInitials = name => {
    if (!name) return 'N.A.'
    const nameParts = name.trim().split(' ')

    return nameParts.map(part => part.charAt(0).toUpperCase()).join('')
  }
  const initials = getInitials(user.name)

  // this will render as bold text as this don't has to redirect to another page that's why we don't need a href property.
  const breadcrumbItems = [{ label: 'Profile' }]

  //to get the toast from the store so that we can display the success or error messages to the user.
  const { addToast } = useToastStore(state => state.addToast)

  //function to handle the edit button click
  const handleEditClick = filedData => {
    setEditedName(filedData)
    setValidationError('')
  }

  //we will need to validte the input or changes made by the user so that we don't get the wrong data.
  const validateInput = (fieldName, value) => {
    switch (fieldName) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          setValidationError('Please enter a valid email address.')
          return false
        }
        setValidationError('')
        return true
      default:
        setValidationError('')
        return value.trim().length > 0 && value !== null && value !== undefined
    }
  }

  //and we will also need to handle the svae of the edited or changed credetials of a user.
  const handleSave = async data => {
    const isValid = validateInput(data?.field, data?.value)

    if (!isValid) {
      setValidationError('Please enter a valid value.')
      return
    }

    // we will try to update the user information and if it fails we will catch the error and display it to the user.
    try {
      const response = await put('/update', {
        [data?.field.toLowerCase()]: data?.value
      })
      // console.log("response : ", response);

      //now that we have the user information updated, we will update the user information in the zustand store so that it can be reflected in the UI.
      updateUser({ [data?.field.toLowerCase()]: data?.value })

      addToast({
        message: response?.data?.message || 'Profile updated successfully',
        type: 'success'
      })

      setEditedName({})
      setValidationError('')
    } catch (error) {
      addToast({
        message: error?.response?.data?.error || 'Failed to update profile',
        type: 'error'
      })
    }
  }

  return (
    <div className='md:mx-14 mb-10'>
      {/* the breadcrumb component to navigate */}
      <Breadcrumb items={breadcrumbItems} />

      <div className='grid grid-flow-col grid-cols-2 lg:grid-cols-3 justify-stretch'>
        <div
          className='grid col-span-2 bg-white rounded-xl justify-stretch p-4'
          style={{ boxShadow: '2px 1px 13px 0px #a8a7a787' }}
        >
          {/* container for the first box containing the user name and email address and the edit button */}
          <div className='grid grid-cols-1 sm:grid-cols-[auto, 1fr] items-center justify-between w-full border-b-2 gap-4'>
            {/* the hero icon with naming initials */}
            <div className='hidden md:block'>
              <div className='flex items-center justify-center w-[64px] h-[64px] sm:w-[84px] sm:h-[84px] rounded-full bg-blue-100 text-[#002B5B] text-shadow-xs text-shadow-[#002B5B] text-2xl sm:text-3xl font-bold border border-[#002B5B] shadow-sm shadow-[#002B5B]'>
                {user?.name ? initials : 'N.A.'}
              </div>
            </div>

            {/* username and the button to edit */}
            <div className='flex flex-row justify-between items-center w-full'>
              <div className='flex flex-col'>
                <input
                  type='text'
                  value={user?.name || ' '}
                  readOnly
                  className='w-full sm:w-auto font-semibold text-lg sm:text-xl px-2 py-1 rounded-md focus:outline-none'
                />
                <input
                  type='text'
                  value={user?.email || ' '}
                  readOnly
                  className='w-full sm:w-auto font-light px-2 text-xs sm:text-base focus:outline-none text-gray-800'
                />
              </div>

              <button
                onClick={() =>
                  handleEditClick({ field: 'name', value: user?.name })
                }
                className='flex gap-1 mr-0 sm:mr-4
                          mt-2 sm:mt-0 sm:ml-4 
                          text-[#002B5B] 
                          font-normal sm:font-bold 
                          text-sm sm:text-base 
                          cursor-pointer 
                          border rounded-lg border-[#v002B5B] 
                          px-3 py-1 
                          hover:bg-[#002B5B] hover:text-white 
                          transition
                          '
              >
                <span>
                  <MdModeEdit className='text-[16px] sm:text-[20px] md:text-[24px]' />
                </span>
                Edit
              </button>
            </div>
          </div>

          {/* the second box containing the user email and the change button */}
          <div className='my-4'>
            <label
              htmlFor='E-mail'
              className='block text-base font-medium text-[#002B5B]'
            >
              E-mail ID
            </label>
            <div className='flex flex-row justify-between items-center w-full'>
              <input
                type='email'
                id='E-mail'
                value={user?.email || 'No email added '}
                readOnly
                className='w-full focus:outline-none pt-2 text-[15px] font-normal'
              />

              <button
                onClick={() =>
                  handleEditClick({ field: 'email', value: user?.email })
                }
                className='flex gap-1 mr-0 sm:mr-4
                          mt-2 sm:mt-0 sm:ml-4 
                          text-[#002B5B] 
                          font-normal sm:font-bold 
                          text-sm sm:text-base 
                          cursor-pointer 
                          border rounded-lg border-[#002B5B] 
                          px-2 py-1 
                          hover:bg-[#002B5B] hover:text-white 
                          transition
                          '
              >
                <span>
                  <CgArrowsExchange className='text-[16px] sm:text-[20px] md:text-[24px]' />
                </span>
                Change
              </button>
            </div>
          </div>

          {/* the second box containing the user phone number and the change button */}
          <div className='my-4'>
            <label
              htmlFor='Phone'
              className='block text-base font-medium text-[#002B5B]'
            >
              Phone Number
            </label>
            <div className='flex flex-row justify-between items-center w-full'>
              <input
                type='number'
                id='Phone'
                value={user?.phone || ''}
                placeholder='No phone number added'
                readOnly
                className='w-full focus:outline-none pt-2 text-[15px] font-normal'
              />

              <button
                onClick={() =>
                  handleEditClick({ field: 'phone', value: user?.phone })
                }
                className='flex gap-1 mr-0 sm:mr-4
                          mt-2 sm:mt-0 sm:ml-4 
                          text-[#002B5B] 
                          font-normal sm:font-bold 
                          text-sm sm:text-base 
                          cursor-pointer 
                          border rounded-lg border-[#002B5B] 
                          px-2 py-1 
                          hover:bg-[#002B5B] hover:text-white 
                          transition
                          '
              >
                <span>
                  <CgArrowsExchange className='text-[16px] sm:text-[20px] md:text-[24px]' />
                </span>
                Change
              </button>
            </div>
          </div>

          {/* the notifications section */}
          <div>
            <NotificationsSection />
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!editedName.field}
        onClose={() => setEditedName({})}
      ></Modal>
    </div>
  )
}

export default ProfileClient

const notProvided = () => {
  return
}
