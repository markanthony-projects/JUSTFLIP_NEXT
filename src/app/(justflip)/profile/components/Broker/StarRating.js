import { svg } from 'leaflet'
import React from 'react'

const StarRating = ({rating = 0, size = 'w-4 h-4'}) => {
  return (
    <div className='flex items-center gap-0.5'>
      { Array.from({length:5}).map((_, index) =>{
        //for the stars that are complete
        if(index < Math.floor(rating)){
          return(
            <svg key={index} xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24" fill="#C7A51C" className={size}>
              <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
            </svg>
          )
        }
        //for half stars
        if(index < Math.ceil(rating)){
          return(
            <svg key={index} xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24" className={size}>
              <defs>
                <linearGradient id={`half-${index}`} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#C7A51C" />
                  <stop offset="50%" stopColor="white" />
                </linearGradient>
              </defs>
              <path fill={`url(#half-${index})`} stroke="#C7A51C" strokeWidth="1.5"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
            </svg>
          )
        }

        //for the empty stars
        return (
          <svg key={index} xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24" fill="none" stroke="#C7A51C" strokeWidth="1.5" className={size}>
            <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
          </svg>
        );
      
      })}
    </div>
  )
}

export default StarRating