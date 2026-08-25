import React from 'react'

import Breadcrumb from '@/src/components/organisms/breadCrumb'
import { FiArrowRight, FiShield, FiMail } from 'react-icons/fi'
import { SiGnuprivacyguard } from "react-icons/si";
import rawPrivacyPolicy from './data/privacyPolicy.json'

interface PrivacySubsection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

interface PrivacySection {
  id: string;
  number: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  subsections?: PrivacySubsection[];
  footerParagraph?: string;
}

interface PrivacyPolicyData {
  title: string;
  lastUpdated?: string;
  intro?: {
    title?: string;
    paragraphs?: string[];
  };
  sections: PrivacySection[];
}

const privacyPolicy = rawPrivacyPolicy as unknown as PrivacyPolicyData;

const PrivacyPolicy = () => {
  const breadcrumbItems = [{ label: 'JustFlip Policy', href: '/privacy-policy' }]

  return (
    <main className='min-h-screen bg-white'>
        <div className='mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'>
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Hero Header */}
            <header className='mt-6 flex min-h-[170px] flex-col items-center justify-center rounded-2xl bg-[#EAF3FA] px-6 py-5 text-center'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm'>
                    <SiGnuprivacyguard size={28} className='text-[#002B5B]' />
                </div>

                <h1 className='text-2xl font-bold tracking-tight text-[#002B5B] sm:text-3xl'>
                    {privacyPolicy.title}
                </h1>

                <p className='mt-3 max-w-2xl text-[14px] text-gray-600'>
                    Learn how JustFlip collects, uses, protects, and manages your
                    personal information.
                </p>

                {privacyPolicy.lastUpdated && (
                    <p className='mt-2 text-xs text-gray-500'>
                    Last updated: {privacyPolicy.lastUpdated}
                    </p>
                )}
            </header>

            {/* Introduction */}
            <section className='mt-10 rounded-2xl border border-[#D8E4EE] bg-white p-6 shadow-sm sm:p-8'>
                <div className='flex items-start gap-4'>
                    <div className='mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FA]'>
                        <FiShield className='text-[#002B5B]' size={19} />
                    </div>

                    <div className='text-[10px] leading-6 text-gray-600 sm:text-[12px]'>
                        {privacyPolicy.intro?.paragraphs?.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* Privacy Sections */}
            <div className='mt-10 overflow-hidden bg-white'>
                {privacyPolicy.sections.map((section, index) => (
                <section
                    key={section.id}
                    id={section.id}
                    className={`p-2 sm:p-4 ${
                        index !== privacyPolicy.sections.length - 1
                        ? 'border-b border-gray-100'
                        : ''
                    }`}
                >
                    {/* Section Header */}
                    <div className='flex items-start gap-4'>
                        <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FA] text-sm font-bold text-[#002B5B]'>
                        {section.number}
                        </span>

                        <div className='min-w-0 flex-1'>
                        <h2 className='text-lg font-semibold text-[#002B5B] sm:text-xl'>
                            {section.title}
                        </h2>

                        {/* Paragraphs */}
                        {section.paragraphs?.map((paragraph, paragraphIndex) => (
                            <p
                            key={paragraphIndex}
                            className='mt-3 text-[10px] text-gray-600 sm:text-sm'
                            >
                            {paragraph}
                            </p>
                        ))}

                        {/* Items */}
                        {Boolean(section.items && section.items.length > 0) && (
                            <ul className='mt-3 space-y-1'>
                            {section.items!.map((item, itemIndex) => (
                                <li
                                key={itemIndex}
                                className='flex items-start gap-3 text-[10px] leading-7 text-gray-600 sm:text-sm'
                                >
                                <FiArrowRight
                                    size={15}
                                    className='mt-1.5 shrink-0 text-[#002B5B]'
                                />

                                <span>{item}</span>
                                </li>
                            ))}
                            </ul>
                        )}

                        {/* Subsections */}
                        {Boolean(section.subsections && section.subsections.length > 0) && (
                        <div className='mt-4 space-y-4'>
                            {section.subsections!.map(
                                (subsection, subsectionIndex) => (
                                <div key={subsectionIndex}>
                                    <h3 className='text-lg font-semibold text-[#002B5B]'>
                                        {subsection.title}
                                    </h3>

                                    {subsection.paragraphs?.map(
                                    (paragraph, paragraphIndex) => (
                                        <p
                                            key={paragraphIndex}
                                            className='mt-2 text-[10px] text-gray-600 sm:text-sm'
                                        >
                                            {paragraph}
                                        </p>
                                    )
                                    )}

                                    {Boolean(subsection.items && subsection.items.length > 0) && (
                                    <ul className='mt-2 space-y-1'>
                                        {subsection.items!.map((item, itemIndex) => (
                                        <li
                                            key={itemIndex}
                                            className='flex items-start gap-3 text-[10px] leading-7 text-gray-600 sm:text-sm'
                                        >
                                            <FiArrowRight
                                                size={17}
                                                className='mt-1.5 shrink-0 text-[#002B5B]'
                                            />
                                            <span>{item}</span>
                                        </li>
                                        ))}
                                    </ul>
                                    )}
                                </div>
                                )
                            )}
                        </div>
                        )}

                        {/* Footer paragraph */}
                        {section.footerParagraph && (
                            <p className='mt-5 text-[10px] leading-7 text-gray-600 sm:text-sm'>
                                {section.footerParagraph}
                            </p>
                        )}
                        </div>
                    </div>
                </section>
            ))}
            </div>

            {/* Contact Card */}
            <section className='mt-8 rounded-2xl border border-[#D8E4EE] bg-[#EAF3FA] p-6 text-center sm:p-8'>
                <h3 className='text-lg font-semibold text-[#002B5B]'>
                    Questions about your privacy?
                </h3>

                <p className='mt-2 text-sm leading-6 text-gray-600'>
                    If you have any questions or concerns about how JustFlip handles
                    your information, our support team is available to help.
                </p>

                <a
                    href='mailto:support@justflip.in'
                    className='mt-4 inline-flex items-center gap-2 font-medium text-[#002B5B] transition-colors hover:text-[#001F42] hover:underline'
                >
                    <FiMail size={16} />
                    support@justflip.in
                </a>
            </section>

            {/* Footer */}
            <footer className='py-10 text-center text-sm text-gray-400'>
                <p>© {new Date().getFullYear()} JustFlip. All rights reserved.</p>
            </footer>
        </div>
    </main>
  )
}

export default PrivacyPolicy
