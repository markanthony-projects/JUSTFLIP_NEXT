import React from 'react'

import Breadcrumb from '@/src/components/organisms/breadCrumb';
import termsData from './data/termsAndConditions.json'

const TermsAndConditions = () => {
    const breadcrumbItems = [{ label: "Terms & Conditions", href: "/terms-conditions" }];

  return (
  <main className="min-h-screen bg-white">

    {/* Page container */}
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems}/>

      {/* Hero Header */}
      <header className="mt-6 flex min-h-[180px] flex-col items-center justify-center rounded-2xl bg-[#EAF3FA] px-4 py-10 text-center">

        {/* Document Icon */}
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
          >
            <path
              d="M6 3.5C6 2.672 6.672 2 7.5 2H14L18 6V20.5C18 21.328 17.328 22 16.5 22H7.5C6.672 22 6 21.328 6 20.5V3.5Z"
              fill="#002B5B"
            />

            <path
              d="M14 2V6H18"
              fill="#5DB8ED"
            />

            <path
              d="M9 10H15M9 13H15M9 16H13"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#002B5B] sm:text-3xl">
            {termsData.metadata.title}
        </h1>

      </header>


    {/* Introduction Card */}
    <section className="mt-10 rounded-2xl border border-[#D8E4EE] bg-white p-6 shadow-sm sm:p-8">

        <div className="flex items-start gap-4">

          {/* Shield Icon */}
            <div className="mt-0.5 shrink-0">
                <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#002B5B]"
                >
                <path
                    d="M12 3L19 6V11.5C19 16.2 16.1 20.1 12 21C7.9 20.1 5 16.2 5 11.5V6L12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                />

                <path
                    d="M12 8V12"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                />

                <circle
                    cx="12"
                    cy="15"
                    r="0.8"
                    fill="currentColor"
                />
                </svg>
            </div>


            {/* Text */}
            <div className="space-y-4 text-xs leading-6 text-gray-700 sm:text-sm">

                <p>
                Please read this document carefully. By accessing or using
                <strong className="font-semibold text-gray-900">
                    {" "}JustFlip
                </strong>
                , you agree to be bound by the terms and conditions set forth
                below. If you do not agree with any of these terms and
                conditions, you should not access or use JustFlip.
                </p>

                <p>
                If you have any questions about these terms, please contact
                <a
                    href="mailto:support@justflip.in"
                    aria-label="Contact JustFlip Support via email"
                    className="ml-1 font-semibold text-[#002B5B] transition-colors hover:text-[#001F42] hover:underline"
                >
                    support@justflip.in
                </a>
                </p>

            </div>

        </div>

    </section>


       {/* Terms Card */}
      <div className="mt-10 overflow-hidden bg-white">

        {termsData.sections.map((section, index) => (
            <section
            key={section.id}
            id={`section-${section.id}`}
            className={`p-4 sm:p-6 ${
                index !== termsData.sections.length - 1
                ? "border-b border-gray-100"
                : ""
            }`}
            >
            <div className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF3FA] text-sm font-bold text-[#002B5B]">
                {String(section.id).padStart(2, "0")}
                </span>

                <div className="w-full">
                <h2 className="text-lg font-semibold text-[#002B5B]">
                    {section.title}
                </h2>

                <ul className="mt-3 space-y-2 text-xs leading-6 text-gray-700 sm:text-sm">
                    {section.content.map((paragraph, paragraphIndex) => (
                    <li key={paragraphIndex} className="flex items-start gap-2">
                        <span className="shrink-0 text-[#002B5B] font-bold">→</span>
                        <span>{paragraph}</span>
                    </li>
                    ))} 
                </ul>
                </div>
            </div>
            </section>
        ))}
      </div>

      {/* Contact */}
      <section className="mt-8 rounded-2xl border border-[#D8E4EE] bg-[#EAF3FA] p-6 text-center sm:p-8">
        <h3 className="text-lg font-semibold text-[#002B5B]">
          Have questions?
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-700">
            {termsData.ContactUs.description}
        </p>

        <a
          href="mailto:support@justflip.in"
          aria-label="Contact JustFlip Support via email"
          className="mt-4 inline-block font-semibold text-[#002B5B] transition-colors hover:text-[#001F42] hover:underline"
        >
            {termsData.ContactUs.Email}
        </a>
      </section>

      {/* Footer */}
      <footer className="mt-10 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} JustFlip. All rights reserved.
        </p>
      </footer>

    </div>
  </main>
);
}

export default TermsAndConditions