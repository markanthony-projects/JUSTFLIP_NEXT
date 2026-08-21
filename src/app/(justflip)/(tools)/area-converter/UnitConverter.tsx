'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ConverterCategory, DEFAULT_AREA_FROM, DEFAULT_AREA_TO, DEFAULT_LENGTH_FROM, DEFAULT_LENGTH_TO } from './data/standardUnit';
import { convertUnit, formatREsult, getUnitsCategory, isValidNumericInput, resolveSafeUnitKey } from './converter';
//icons import
import {
    FiArrowRight,
    FiCheck,
    FiCheckCircle,
    FiCopy,
    FiInfo,
    FiRefreshCw,
    FiShield,
    FiZap,
} from 'react-icons/fi'
import { PiCalculator } from "react-icons/pi";


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
        <div className='absolute z-50 mt-1 w-full max-h-50 overflow-y-auto overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg'>
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


const UnitConverter = () => {
    const [ category, setCategory ] = useState<ConverterCategory>('area')
    const [ inputValue, setInputValue ] = useState('')
    const [ fromKey, setFromKey ] = useState(DEFAULT_AREA_FROM)
    const [ toKey, setToKey ] = useState(DEFAULT_AREA_TO)
    const [ converted, setConverted ] = useState<number | null >(null)
    const [ copied, setCopied ] = useState(false)

    //units-----------------------
    const units = useMemo(()=> getUnitsCategory(category), [category])

    const safeFrom = resolveSafeUnitKey(units, fromKey, 0)
    const safeTo = resolveSafeUnitKey(units, toKey, 1)

    const unitOptions = units.map( unit => ({ value: unit.key, label: `${unit.label}`}) )
    const fromUnit = units.find( unit => unit .key === safeFrom )
    const toUnit = units.find( unit => unit.key === safeTo )


    function handleCategoryChange( next : ConverterCategory){
        setCategory(next)
        setInputValue('')
        setConverted(null)
        setCopied(false)

        if( next === 'area'){
            setFromKey(DEFAULT_AREA_FROM)
            setToKey(DEFAULT_AREA_TO)
        } else {
            setFromKey(DEFAULT_LENGTH_FROM)
            setToKey(DEFAULT_LENGTH_TO)
        }
    }

    function handleConvert (){
      const number = parseFloat(inputValue)

      if(Number.isNaN(number) || !safeFrom || !safeTo){
        setConverted(null)
        return
      }
      const from = units.find((unit) => unit.key === safeFrom)
      const to = units.find((unit) => unit.key === safeTo)

      if(!from || !to){
        setConverted(null)
        return
      }

      const result = convertUnit(number, from, to)
      setConverted(result)
      setCopied(false)
    }

    function swapUnits(){
        const prevFrom = safeFrom
        const prevTo = safeTo
        setFromKey(prevTo)
        setToKey(prevFrom)

        setConverted(null)
        setCopied(false)
    }

    function handleReset(){
      setInputValue('')
      setConverted(null)
      setCopied(false)
    }

    async function handleCopyResult(){
      if(converted === null){
        return
      }

      const text = `${formatREsult(converted)}  ${toUnit?.abbreviation ?? ''}`

      try{
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(()=>{
          setCopied(false)
        },1500)
      }catch(err){
        console.error('failed to copy',err);
      }
    }

  return (
    <section className='relative flex h-[80vh] sm:h-full w-full flex-col items-center justify-center overflow-hidden px-5 py-10  mb-15 bg-white md:px-8'>
      <div className='pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-[#edf4fc]'/>
      <div className= 'pointer-events-non absolut left- top-2 hidde h-2 w-  opacity-60md:block' 
        style={{
          backgroundImage: 'radial-gradient(#c8d8ec 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px'
        }}
      />
      <div className=' pointer-events-none absolute bottom-28 right-5 hidden h-20 w-20 opacity-60 md:block'
        style={{
          backgroundImage:
              'radial-gradient(#c8d8ec 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
        }}
      />


      {/* main content */}
      <div className='relative z-10 w-full max-w-lg'>

        {/* -------------------------------------------- */}
        <div className='overflow-hidden rounded-xl border-2 border-[#e1e8f2] bg-white shadow-[0_20px_60px_rgba(0,43,91,0.10)]'>
          
          {/* -----------------header----------------------- */}
          <div className='flex items-center justify-between border-b border-[#e8edf4] px-5 py-4 md:px-7'>

            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-l-lg rounded-br-lg bg-[#002B5B] text-white'>
                <PiCalculator size={24} />
              </div>

              <div>
                <h2 className='text-base font-bold text-[#002B5B] md:text-md uppercase'>
                  conversion calculator
                </h2>
                <p className='text-[10px] text-[#7a879b]'>
                  select units and enter your value 
                </p>
              </div>
            </div>

            {/* --reset---- */}
            <button type='button'
              onClick={handleReset}
              className='flex items-center gap-2 rounded-lg border border-[#d9e2ef] bg-white px-3 py-2 text-xs   
                font-semibold text-[#002B5B] transition-all duration-200 hover:border-[#b8c9df] hover:bg-[#f7faff] active:scale-95 md:px-4'
            >
              <FiRefreshCw size={14} />

              <span className="hidden sm:inline">
                  Reset
              </span>
            </button>
          </div>

          {/* --------form---------------- */}
          <div className='space-y-6 px-5 py-4 md:px-7 md:space-y-4'>
            
            <div>
              <span className='mb-0.5 block text-[13px] font-semibold text-[#27364b] uppercase'>
                conversion type
              </span>

              <div className='grid grid-cols-2 gap-1 rounded-lg border border-[#e0e7f0] bg-[#f8fafd] p-0.5'>
                { [ { value: 'area', label: 'Area',}, { value: 'length', label: 'Length',} ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                        handleCategoryChange(
                            item.value as ConverterCategory
                        )
                    }
                    className={`rounded-lg py-2 text-sm font-semibold transition-all duration-200
                      ${
                          category === item.value
                              ? ` bg-[#002B5B] text-white shadow-[0_4px_12px_rgba(0,43,91,0.18)]`
                              : ` text-[#66758b] hover:text-[#002B5B]`
                      }`}
                  >
                    {item.label}
                  </button>
                )) }
              </div>

            </div>

            {/* -----------input--------------------- */}
            <div>
              <label htmlFor="conversion-value-input" className='mb-0.5 block text-[13px] font-semibold text-[#27364b] uppercase'>enter value</label>
              
              <div className='flex items-center overflow-hidden rounded-lg border border-[#d9e2ef] bg-white transition-all 
                duration-200 focus-within:border-[#002B5B] focus-within:ring-4 focus-within:ring-[#002B5B]/10'>
                  <input
                    id="conversion-value-input"
                    name="conversionValue"
                    aria-label="Enter value to convert"
                    type="text" 
                    inputMode="decimal"
                    value={inputValue}
                    onChange={(e) => {
                       const value = e.target.value
                        if ( isValidNumericInput(value) ) {
                          setInputValue(value)
                          setConverted(null)
                          setCopied(false)
                        }}}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleConvert()
                        }}}
                    placeholder="0.00"
                    className='min-w-0 flex-1 bg-transparent px-5 py-2 text-lg font-semibold tracking-tight text-[#002B5B] outline-none placeholder:text-[#b9c4d3] md:text-xl'
                  />

                  <div className='mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f2f6fb] text-[#002B5B]'>
                    <PiCalculator size={20} />
                  </div>
              </div>
            </div>

            <div>

              <div className='flex gap-3 flex-row items-end justify-center'>
                <div className='min-w-0 flex-1'>
                  <p className='ml-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a96a8]'>
                    from
                  </p>
                  <CustomDropDown value={safeFrom} onChange={setFromKey} options={unitOptions}/>
                </div>

                <button type="button"
                    onClick={swapUnits}
                    title="Swap units"
                    className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-3 border-white bg-[#f4f8fd] text-[#002B5B] transition-all duration-200 hover:border-[#9db5d3] hover:bg-[#eaf1fa] active:scale-90 md:self-end shadow-md shadow-[#cbd9eb]
                    '>
                      <span className="text-lg font-bold"> ⇄ </span>
                </button>

                <div className='min-w-0 flex-1'>
                    <p className='mb-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a96a8]'>
                      To
                    </p>
                    <CustomDropDown
                        value={safeTo}
                        onChange={setToKey}
                        options={unitOptions}
                    />
                </div>
              </div>
            </div>

            {/* ------------------------------------------convert-------------- */}
            <button type="button"
              onClick={handleConvert}
              disabled={!inputValue}
              className='group flex w-full items-center justify-center gap-3 rounded-lg bg-[#002B5B] px-5 py-3 text-base font-bold text-white shadow-[0_8px_20px_rgba(0,43,91,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#003b7c] hover:shadow-[0_12px_25px_rgba(0,43,91,0.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 md:py-3'
            >
              <span> Convert </span>
              <FiArrowRight size={19}
                  className='transition-transfor duration-20 group-hover:translate-x-1'
              />
            </button>
          </div>

          {/* -------------------------result------------ */}
          <div className={`mx-5 mb-5 rounded-lg border md:mx-7 md:mb-7
            ${
              converted !== null
                  ? ` border-[#d7e4f3] bg-[#f1f6fc] `
                  : ` border-[#e6ecf4] bg-[#f8fafd] `
            }`}
          >
          <div className='p-5'>
            {/* <div className="mb-0.5 flex items-center justify-between">
              <span className='text-xs font-bold uppercase tracking-[0.08em] text-[#1d5da3]'>Result</span>
                {converted !== null && (
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    title="Copy result"
                    className=' flex h-7 w-7 items-center justify-center rounded-lg border border-[#d4e0ef] bg-white text-[#002B5B] transition hover:bg-[#f4f8fd]
                    '
                  >
                    {copied ? ( <FiCheckCircle size={14} />) : ( <FiCopy size={14} /> )}
                  </button>
                )}
            </div> */}

            {converted !== null ? (
              <div className='flex justify-between'>
                <div>
                  <div className='flex flex-wrap items-baseline gap-2' >
                    <span className='text-md font-bold tracking-tight text-[#002B5B] md:text-xl' >
                        {formatREsult( converted )}
                    </span>
                    <span className='text-lg font-semibold text-[#1d5da3]'>
                        {toUnit?.abbreviation}
                    </span>
                  </div>

                  <div className='flex flex-wrap items-center gap-2 text-[10px] text-[#61718a]' >
                    <span>
                        {inputValue}{' '}
                        {fromUnit?.abbreviation}
                    </span>
                    <FiArrowRight size={15} className="text-[#1d5da3]" />
                    <span>
                        {formatREsult( converted)}{' '}
                        {toUnit?.abbreviation}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyResult}
                  title="Copy result"
                  className=' flex h-7 w-7 items-center justify-center rounded-lg border border-[#d4e0ef] bg-white text-[#002B5B] transition hover:bg-[#f4f8fd]
                  '
                >
                  {copied ? ( <FiCheckCircle size={14} />) : ( <FiCopy size={14} /> )}
                </button>
              </div>
                
                ) :
                (<div className='flex items-center gap-2 text-sm text-[#8996a8]' >
                  <FiInfo size={15}/>
                  Enter a value and click Convert
                </div>)
              }
          </div>
        </div>

          {/* -----------------information-------------------------- */}
          <div className='mx-5 mb-5 flex items-center gap-2.5 rounded-lg border border-[#e4ebf4] bg-[#f8fafd] px-4 py-2 text-[10px]
            text-[#63738a] md:mx-7 md:mb-7'>
              <FiInfo size={15} className='shrink-0text-[#1d5da3]'/>
              <span> All conversions are based on standard international units.</span>
          </div>
        </div>

        {/* ---------------------------feature ----------------- */}
        <div className='mt-7 flex items-center justify-center gap-4 text-xs text-[#607089]  sm:gap-0'>
          <div className='flex items-center gap-2 px-5'>
             <FiShield size={16} className='text-[#002B5B]' />
             <span> Standard Units</span>
          </div>

          <div className='hidden h-4 w-px bg-[#dbe3ed] sm:block'/>
          <div className='flex items-center gap-2 px-5'>
            <FiZap size={16} className="text-[#002B5B]" />
            <span>Fast Conversion</span>
          </div>

          <div className='hidden h-4 w-px bg-[#dbe3ed] sm:block'/>
          <div className='flex items-center gap-2 px-5'>
            <FiCheckCircle size={16} className="text-[#002B5B]" /> 
            <span> Accurate Results </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UnitConverter