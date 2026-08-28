import React from 'react'
import FeedbackClient from './FeedbackClient';

export const metadata = {
  title: "Feedback | JustFlip",
  description: "Share your feedback, suggestions, or experience to help us improve JustFlip.",
};

const page = () => {
  return (
    <div>
        <FeedbackClient />
    </div>
  )
}

export default page