'use client'

import React, { useEffect, useState } from 'react'
import Breadcrumb from '@/src/components/organisms/breadCrumb'
import ReportModal from './ReportModal';
import { useSearchParams } from 'next/navigation'

//icons import
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiCreditCard,
  FiEye,
  FiFlag,
  FiLock,
  FiMapPin,
  FiPhone,
  FiShield,
  FiUserCheck
} from 'react-icons/fi'
import { AiFillSafetyCertificate } from 'react-icons/ai'
import { SiGooglestreetview } from 'react-icons/si'

const SafetyGuideClient = () => {
  const [showReportModal, setShowReportModal] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const report = searchParams.get('report')

    if(report === 'true'){
        setShowReportModal(true)
    } 
  },[searchParams])

  const breadcrumbItems = [{ label: 'Safety Guide', href: '/safety-guide' }]

  const safetyTips = [
    {
      icon: FiUserCheck,
      title: 'Verify the Person',
      description:
        'Before proceeding with a property, verify the identity and details of the person you are communicating with.'
    },
    {
      icon: FiEye,
      title: 'Inspect the Property',
      description:
        'Always visit and inspect the property in person before making any financial commitment.'
    },
    {
      icon: FiCreditCard,
      title: 'Be Careful with Payments',
      description:
        'Never transfer money before verifying the property, owner, documents, and terms of the transaction.'
    },
    {
      icon: FiLock,
      title: 'Protect Your Information',
      description:
        'Do not share passwords, OTPs, banking credentials, or other sensitive personal information with anyone.'
    },
    {
      icon: FiMapPin,
      title: 'Meet in Safe Places',
      description:
        'When meeting someone for the first time, choose a public or safe location and consider informing someone you trust.'
    },
    {
      icon: FiPhone,
      title: 'Communicate Carefully',
      description:
        'Be cautious if someone pressures you to communicate through unfamiliar channels or asks you to avoid normal verification.'
    }
  ]

  const redFlags = [
    'Requests for payment before you have verified the property.',
    'Someone pressuring you to make an immediate decision.',
    'Prices or offers that seem unusually good compared with similar properties.',
    'Requests for OTPs, passwords, bank details, or other sensitive information.',
    'Someone refusing to let you inspect the property in person.',
    'Requests to make payments to unrelated or third-party accounts.'
  ]

  const transactionSteps = [
    'Verify the property and the person offering it.',
    'Inspect the property and confirm the details provided.',
    'Review ownership and relevant property documents.',
    'Clearly understand the price, terms, and conditions.',
    'Use appropriate legal and financial assistance when required.',
    'Keep records of important communications and transaction documents.'
  ]

  return (
    <main className='min-h-screen bg-white'>
      <div className='mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Hero */}
        <header className='mt-6 rounded-2xl bg-[#EAF3FA] px-6 py-6 text-center sm:px-8 sm:py-8'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm'>
            <AiFillSafetyCertificate size={36} className='text-[#002B5B]' />
          </div>

          <h1 className='mt-2 text-2xl font-bold tracking-tight text-[#002B5B] sm:text-3xl'>
            Stay Safe with JustFlip
          </h1>

          <p className='mx-auto max-w-2xl text-[12px] leading-6 text-gray-600'>
            Your safety matters to us. Follow these guidelines to help protect
            yourself from scams and make safer property decisions.
          </p>
        </header>

        {/* Introduction */}
        <section className='mt-6 rounded-2xl border border-[#D8E4EE] bg-white p-6 shadow-sm sm:p-8'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF3FA]'>
              <FiCheckCircle size={24} className='text-[#002B5B]' />
            </div>

            <div>
              <h2 className='text-md font-bold text-[#002B5B] sm:text-lg'>
                A few simple precautions can make a big difference
              </h2>

              <p className='text-[12px] leading-6 text-gray-600'>
                Whether you are buying, renting, selling, or simply exploring
                properties, take time to verify information and avoid making
                rushed decisions.
              </p>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className='mt-8'>
          <div>
            <h2 className='text-lg font-bold text-[#002B5B] sm:text-xl'>
              Essential Safety Tips
            </h2>

            <p className='text-sm text-gray-600'>
              Keep these points in mind whenever you interact with a property
              listing or another user.
            </p>
          </div>

          <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {safetyTips.map(item => {
              const Icon = item.icon

              return (
                <article
                  key={item.title}
                  className='rounded-2xl border border-[#D8E4EE] bg-white p-6  shadow-sm transition hover:-translate-y-0.5 hover:shadow-md'
                >
                  <div className='flex items-start gap-4'>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3FA]'>
                      <Icon size={22} className='text-[#002B5B]' />
                    </div>

                    <div>
                      <h3 className='text-base font-bold text-[#002B5B]'>
                        {item.title}
                      </h3>

                      <p className='mt-1 text-sm leading-6 text-gray-600'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* Red Flags */}
        <section className='mt-8 rounded-2xl border border-[#F0D7B5] bg-[#FFF9F0] p-6 sm:p-8'>
          <div className='flex flex-col sm:flex-row items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white'>
              <FiAlertTriangle size={25} className='text-[#d0190c]' />
            </div>

            <div className='flex-1'>
              <h2 className='text-md font-bold text-[#002B5B] sm:text-lg'>
                Watch Out for Red Flags
              </h2>

              <p className='text-[12px] leading-6 text-gray-600'>
                Be especially cautious when you notice any of the following
                situations:
              </p>

              <ul className='mt-4 space-y-3'>
                {redFlags.map(flag => (
                  <li
                    key={flag}
                    className='flex items-start gap-3 text-sm leading-6 text-gray-700'
                  >
                    <FiAlertTriangle
                      size={17}
                      className='mt-1 shrink-0 text-[#d0190c]'
                    />

                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Property Viewing */}
        <section className='mt-8 rounded-2xl border border-[#D8E4EE] bg-white p-6 shadow-sm sm:p-8'>
          <div className='flex flex-col sm:flex-row items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF3FA]'>
              <SiGooglestreetview size={24} className='text-[#002B5B]' />
            </div>

            <div>
              <h2 className='text-md font-bold text-[#002B5B] sm:text-lg'>
                When Viewing a Property
              </h2>

              <p className='text-[12px] leading-6 text-gray-600'>
                An online listing is only the beginning. Take reasonable steps
                to verify what you see online before moving forward.
              </p>

              <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {[
                  'Visit the property before making a payment.',
                  'Verify the property address and physical location.',
                  'Check that the property matches the listing.',
                  'Ask questions if any information appears inconsistent.'
                ].map(item => (
                  <div
                    key={item}
                    className='flex items-start gap-2 rounded-xl bg-[#F7FAFC] p-3'
                  >
                    <FiCheckCircle
                      size={18}
                      className='mt-0.5 shrink-0 text-[#002B5B]'
                    />

                    <span className='text-sm leading-6 text-gray-600'>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Transactions */}
        <section className='mt-8 rounded-2xl border border-[#D8E4EE] bg-white p-6 shadow-sm sm:p-8'>
          <div className='flex flex-col sm:flex-row items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF3FA]'>
              <FiCreditCard size={24} className='text-[#002B5B]' />
            </div>

            <div className='flex-1 w-full'>
              <h2 className='text-md font-bold text-[#002B5B] sm:text-lg'>
                Before Making a Transaction
              </h2>

              <p className='text-[12px] leading-6 text-gray-600'>
                Property transactions can involve significant amounts of money.
                Take the time to verify the details before proceeding.
              </p>

              <div className='mt-5 space-y-3'>
                {transactionSteps.map((step, index) => (
                  <div
                    key={step}
                    className='flex items-start gap-4 rounded-xl bg-[#F7FAFC] p-4'
                  >
                    <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#002B5B] text-xs font-bold text-white'>
                      {index + 1}
                    </div>

                    <p className='text-sm leading-6 text-gray-600'>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Personal Information */}
        <section className='mt-8 rounded-2xl border border-[#D8E4EE] bg-white p-6 shadow-sm sm:p-8'>
          <div className='flex flex-col sm:flex-row items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF3FA]' >
              <FiLock size={24} className='text-[#002B5B]' />
            </div>

            <div>
              <h2 className='text-lg font-bold text-[#002B5B] sm:text-xl'>
                Protect Your Personal Information
              </h2>

              <p className='mt-2 text-sm leading-6 text-gray-600'>
                Keep sensitive information private and never share information
                that another person does not legitimately need.
              </p>

              <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {[
                  'Never share passwords or OTPs.',
                  'Do not share banking credentials.',
                  'Be careful when sharing identity documents.',
                  'Do not disclose unnecessary personal information.'
                ].map(item => (
                  <div
                    key={item}
                    className='flex items-start gap-3 rounded-xl border border-[#D8E4EE] p-4'
                  >
                    <FiLock
                      size={17}
                      className='mt-1 shrink-0 text-[#002B5B]'
                    />

                    <span className='text-sm leading-6 text-gray-600'>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Report Suspicious Activity */}
        <section className='mt-8 rounded-2xl bg-[#002B5B] p-6 text-white sm:p-8'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10'>
              <FiFlag size={24} className='text-white' />
            </div>

            <div>
              <h2 className='text-lg font-bold sm:text-xl'>
                See Something Suspicious?
              </h2>

              <p className='mt-2 text-sm leading-6 text-white/80'>
                If you come across a suspicious listing, unusual request, or
                behaviour that appears fraudulent, do not proceed with the
                transaction. Report the activity to JustFlip so it can be
                reviewed.
              </p>

              <button
                onClick={() => setShowReportModal(true)}
                type='button'
                className='mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#002B5B] transition hover:bg-[#EAF3FA]'
              >
                <FiFlag size={17} />
                Report Suspicious Activity
              </button>
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className='mt-6 rounded-2xl border border-[#D8E4EE] bg-[#EAF3FA] p-6 sm:p-8'>
          <div className='flex items-start gap-4'>
            <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white'>
              <FiShield size={24} className='text-[#002B5B]' />
            </div>

            <div>
              <h2 className='text-base font-bold text-[#002B5B] sm:text-lg'>
                Important
              </h2>

              <p className='mt-2 text-sm leading-6 text-gray-600'>
                JustFlip provides a platform for property-related interactions.
                Always use your own judgment and take appropriate precautions
                before entering into any financial or legal transaction.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='py-10 text-center text-sm text-gray-400'>
          © {new Date().getFullYear()} JustFlip. All rights reserved.
        </footer>
      </div>
      <ReportModal isOpen={showReportModal} onClose={()=>setShowReportModal(false)}/>
    </main>
  )
}

export default SafetyGuideClient
