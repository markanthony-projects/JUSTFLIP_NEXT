import React from 'react'
import TermsAndConditions from './TermsAndConditions';

export const metadata = {
  title: "Terms & Conditions | JustFlip",
  description: "Read the terms and conditions governing the access and use of the JustFlip platform.",
};

const page = () => {
  return (
    <div>
        <TermsAndConditions/>
    </div>
  )
}

export default page