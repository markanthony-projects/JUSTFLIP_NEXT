'use client'

import { useEffect, useRef, useState } from "react";
import { FiCheck } from "react-icons/fi";

function CustomDropDown({value, onChange, options, placeholder}:{
  value:string 
  onChange: (value:string) => void 
  options: {value:string, label:string}[]
  placeholder?: string
}){
  const[ open, setOpen ] = useState(false)
  const selectedOption = options.find(option => option.value === value)

  const dropDownRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    const handleClickOutside = ( event:MouseEvent ) =>{
      if( dropDownRef.current && !dropDownRef.current.contains(event.target as Node)){
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return()=>{
      document.removeEventListener('mousedown', handleClickOutside)
    }

  },[])

  return(
    <div ref={dropDownRef} className='relative w-full'>
      
      <button type="button"
        onClick={() => setOpen((prev) => !prev)}
        className='flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-1.5 py-3 pr-11  text-left shadow-sm font-medium text-[#002B5B] outline-none transition-all duration-200 cursor-pointer 
        hover:border-[#9db5d3] focus:border-[#153e6d] focus:ring-2 focus:ring-[#002B5B]/10'>
        
        <span className={`text-[12px] selectedOption? 'text-[#002B5B]' : 'text-gray-300' `}>
          {selectedOption?.label || placeholder}
        </span>
        <div className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#002B5B]' >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" >
              <path d="M6 9l6 6 6-6" />
            </svg>
        </div>
      </button>

      {open && (
        <div className='absolute z-250 mt-1 w-full max-h-30 overflow-y-auto overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg'>
          {options.map((option) =>{
            const selected = option.value === value

            return(
              <button
                key={option.value}
                type='button'
                onClick={() => {onChange(option.value); setOpen(false)}}
                className={`flex w-full items-center border-b border-gray-100 justify-between px-4 py-2 text-left text-[11px] font-semibold transition ${
                  selected
                    ? "bg-[#002B5B]/10 text-[#002B5B]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span>{option.label}</span>

                {selected && (
                  <FiCheck className='text-[#002B5B]'/>
                )}
                
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CustomDropDown
