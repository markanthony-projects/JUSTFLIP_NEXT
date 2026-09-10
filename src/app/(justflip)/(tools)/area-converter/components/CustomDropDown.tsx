'use client'

import { useEffect, useRef, useState } from "react";
import { FiCheck, FiSearch } from "react-icons/fi";

interface Option {
    value: string;
    label: string;
}

interface CustomDropDownProps {
    searchIcon:boolean
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
}

function CustomDropDown({searchIcon = false, value, onChange, options, placeholder}:CustomDropDownProps){
  const [ open, setOpen ] = useState(false)
  const [ search, setSearch ] = useState('')

  const dropDownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find(option => option.value === value)

  const filteredOptions = options.filter( option => option.label.toLowerCase().includes(search.toLocaleLowerCase()))

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

  useEffect(() => {
    if(open){
      inputRef.current?.focus()
    }
  },[open])

  return(
    <div ref={dropDownRef} className='relative w-full'>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-lg bg-white px-4  text-left shadow-sm h-7"
      >
        {searchIcon && <FiSearch className="shrink-0 text-[#002B5B]" />}

        <span className="truncate text-[13px] font-medium text-[#002B5B]">
          {selectedOption?.label || placeholder}
        </span>

        <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
      <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
        {/* Search input */}
        {searchIcon && <div className="border-b border-gray-100 p-1">
            <div className="flex items-center gap-2 rounded-md border border-gray-200 px-3">
                <FiSearch className="shrink-0 text-gray-400" />

                <input ref={inputRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search state..." className="w-full py-2 text-[12px] outline-none"
                />
            </div>
        </div>}

        {/* Results */}
        <div className="max-h-25 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const selected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setSearch('');
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between border-b border-gray-100 px-4 py-1 text-left text-[12px] transition ${
                      selected
                        ? 'bg-[#002B5B]/10 font-bold text-[#002B5B]'
                        : 'text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{option.label}</span>

                    {selected && (
                      <FiCheck className="text-[#002B5B]" />
                    )}
                  </button>);
              }) ) : (
                <div className="px-4 py-6 text-center text-[12px] text-gray-500">
                  No conversions found
                </div>
            )}
        </div>
      </div>)}

    </div>
  );
}

export default CustomDropDown
