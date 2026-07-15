'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/src/stores/auth.store'
import { useToastStore } from '@/src/stores/toast.store'
import AuthService from '@/src/services/AuthService'
import { JUSTFLIP } from '@/src/lib/axios/api'
import { FiX, FiSave } from 'react-icons/fi'

const BrokerEditModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore() // Get updateUser method
  const addToast = useToastStore((state) => state.addToast)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    companyName: '',
    companyAddress: '',
    rera: '',
    teamSize: '',
    annualIncome: '',
    missionAndVision: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)

  // Pre-fill form when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        alternatePhone: user.alternatePhone || '',
        companyName: user.companyName || '',
        companyAddress: user.companyAddress || user.address || '',
        rera: user.rera || '',
        teamSize: user.teamSize || '',
        annualIncome: user.annualIncome || '',
        missionAndVision: user.missionAndVision || ''
      })
    }
  }, [isOpen, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'missionAndVision') {
      if (value.length > 500) return // Prevent exceeding 500 characters
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Call the API with user ID
      const updatedData = await AuthService.updateBrokerProfile(user.id, formData)
      
      // Update local Zustand state so the UI reflects the changes immediately
      if (updateUser) {
        updateUser(formData)
      }

      addToast({ message: 'Profile updated successfully!', type: 'success' })
      onClose()
    } catch (error) {
      console.error("Update failed:", error)
      addToast({ message: error?.response?.data?.error || 'Failed to update profile. API might not be ready.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-xl font-bold text-[#002B5B]">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Alternate Phone</label>
                    <input type="text" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Business Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">RERA Number</label>
                    <input type="text" name="rera" value={formData.rera} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">Company Address</label>
                    <input type="text" name="companyAddress" value={formData.companyAddress} onChange={handleChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Team Size</label>
                    <input type="number" name="teamSize" value={formData.teamSize} onChange={handleChange} placeholder="e.g. 50" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Annual Income (Cr)</label>
                    <input type="number" name="annualIncome" value={formData.annualIncome} onChange={handleChange} placeholder="e.g. 6" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none" />
                  </div>
                </div>
              </div>
              
              <hr className="border-gray-100" />

              {/* About Info */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">About</h3>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Mission and Vision</label>
                  <textarea name="missionAndVision" value={formData.missionAndVision} onChange={handleChange} maxLength={500} rows="3" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#002B5B]/20 focus:border-[#002B5B] transition-all outline-none resize-none"></textarea>
                  <p className={`text-xs text-right ${formData.missionAndVision?.length >= 500 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    {formData.missionAndVision?.length || 0}/500 characters
                  </p>
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              form="edit-profile-form"
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-[#002B5B] rounded-xl hover:bg-blue-900 shadow-md shadow-[#002B5B]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FiSave size={16} />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BrokerEditModal
