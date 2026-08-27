'use client'

import React, { useMemo, useState } from 'react'
import { ConverterCategory, DEFAULT_AREA_FROM, DEFAULT_AREA_TO, DEFAULT_LENGTH_FROM, DEFAULT_LENGTH_TO } from '../data/standardUnit';
import { convertUnit, formatREsult, getUnitsCategory, isValidNumericInput, resolveSafeUnitKey } from '../utils/converter';
import Image from 'next/image'

//icons import
import {
    FiArrowRight,
    FiCheckCircle,
    FiCopy,
    FiInfo,
    FiRefreshCw,
} from 'react-icons/fi'
import { PiCalculator } from "react-icons/pi";
import Breadcrumb from '@/src/components/organisms/breadCrumb';
import CustomDropDown from './CustomDropDown';
import ConversionLinks from './ConversionLinks';
import { INDIAN_STATES_AND_UTS } from '../data/states';

type UnitConverterProps = {
  initialCategory?: ConverterCategory;
  initialFrom?: string
  initialTo?: string
}


const UnitConverter = ({
  initialCategory = 'area',
  initialFrom = DEFAULT_AREA_FROM,
  initialTo = DEFAULT_AREA_TO
}: UnitConverterProps) => {

    const [ category, setCategory ] = useState<ConverterCategory>(initialCategory)
    const [ inputValue, setInputValue ] = useState('')
    const [ fromKey, setFromKey ] = useState(initialFrom)
    const [ toKey, setToKey ] = useState(initialTo)
    const [ converted, setConverted ] = useState<number | null >(null)
    const [ copied, setCopied ] = useState(false)
    const [ state, setState ] = useState('SELECT STATE')

    //units-----------------------
    const units = useMemo(()=> getUnitsCategory(category, state), [category,state])
    const breadcrumbItems = [{ label: "area-converter", href: "/area-converter" }];


    const safeFrom = resolveSafeUnitKey(units, fromKey, 0)
    const safeTo = resolveSafeUnitKey(units, toKey, 1)

    const unitOptions = units.map( unit => ({ value: unit.key, label: `${unit.label}`}) )
    const fromUnit = units.find( unit => unit .key === safeFrom )
    const toUnit = units.find( unit => unit.key === safeTo )

    const states = INDIAN_STATES_AND_UTS.map( state => ({ value: state.name, label: `${state.name}`})) 
  

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

    function handleConvert (value:string = inputValue, 
      nextFromKey: string = safeFrom,
      nextToKey: string = safeTo
    ){
      const number = parseFloat(value)

      if(Number.isNaN(number) || !value.trim() || !nextFromKey || !nextToKey ){
        setConverted(null)
        return
      }
      const from = units.find((unit) => unit.key === nextFromKey)
      const to = units.find((unit) => unit.key === nextToKey)

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
    <section className='mb-20 sm:mb-30 mt-2'>

      <Breadcrumb items={breadcrumbItems} /> 
      
      <div className='w-screen overflow-hidden px-4 py-6 sm:pt-0 sm:px-6 md:px-10 lg:px-12 sm:mt-2'>

        <div className='pointer-events-none absolute inset-x-0 top-40 sm:top-35 h-110 overflow-hidden bg-linear-to-r from-[#f1f6fc] via-white to-[#f1f6fc]'>

          <Image src='/banners/calculator.svg'   
            alt=""
            aria-hidden="true"
            width={500}
            height={240}
            className='absolute right-25 top-1/2 hidden w-[520px] -translate-y-1/2 opacity-90 lg:block xl:w-[650px]'
          />
        </div>
        

        {/* main content */}
        <div className='sm:ml-20 relative  w-full max-w-md'>

          {/* -------------------------------------------- */}
          <div className='overflow-hidden rounded-xl border-2 border-[#e1e8f2] bg-white shadow-[0_20px_60px_rgba(0,43,91,0.10)]'>
            
            {/* -----------------header----------------------- */}
            <div className='flex items-center justify-between border-b border-[#e8edf4] px-5 py-4 md:px-7'>

              <div className='flex items-center gap-2'>
                <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-l-lg rounded-br-lg bg-[#002B5B] text-white'>
                  <PiCalculator size={24} />
                </div>

                <div>
                  <h1 className='text-base font-bold text-[#002B5B] md:text-md uppercase'>
                    Conversion Calculator
                  </h1>
                  <p className='text-xs text-slate-700 font-medium'>
                    Select units and enter your value 
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
                <label htmlFor="" className='mb-0.5 block text-[13px] font-bold text-[#27364b] uppercase'>select state</label>
                <CustomDropDown value={state}
                    onChange={(state) =>{
                      setState(state)
                    }} 
                    options={states}
                />
              </div>
              
              <div>
                <label htmlFor="" className='mb-0.5 block text-[13px] font-bold text-[#27364b] uppercase'>
                  conversion type
                </label>

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
                                : ` text-slate-700 font-bold hover:text-[#002B5B]`
                        }`}
                    >
                      {item.label}
                    </button>
                  )) }
                </div>

              </div>

              {/* -----------input--------------------- */}
              <div>
                <label htmlFor="" className='mb-0.5 block text-[13px] font-bold text-[#27364b] uppercase'>enter value</label>
                
                <div className='flex items-center overflow-hidden rounded-lg border border-[#d9e2ef] bg-white transition-all 
                  duration-200 focus-within:border-[#002B5B] focus-within:ring-4 focus-within:ring-[#002B5B]/10'>
                    <input type="text" 
                      inputMode="decimal"
                      value={inputValue}
                      onChange={(e) => {
                        const value = e.target.value

                          if ( !isValidNumericInput(value) ) {
                            return  
                          }

                          setInputValue(value)
                          setCopied(false)

                          if(value.trim() === '' || value === '.'){
                            setConverted(null)
                            return
                          }
                        handleConvert(value)
                        }}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleConvert()
                          }}}
                      placeholder="0.00"
                      className='min-w-0 flex-1 bg-transparent px-5 py-2 text-md font-bold tracking-tight text-[#002B5B] outline-none placeholder:text-slate-400'
                    />

                    <div className='mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[#f2f6fb] text-[#002B5B]'>
                      <PiCalculator size={20} />
                    </div>
                </div>
              </div>

              <div>

                <div className='flex gap-3 flex-row items-end justify-center'>
                  <div className='min-w-0 flex-1'>
                    <p className='ml-2 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700'>
                      from
                    </p>
                    <CustomDropDown value={safeFrom} 
                      onChange={(nextFrom) =>{
                        setFromKey(nextFrom)

                        if(inputValue.trim()){
                          handleConvert(inputValue, nextFrom, safeTo)
                        }
                      }} 
                      options={unitOptions}/>
                  </div>

                  <button type="button"
                      onClick={swapUnits}
                      title="Swap units"
                      className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-3 border-white bg-[#f4f8fd] text-[#002B5B] transition-all duration-200 hover:border-[#9db5d3] hover:bg-[#eaf1fa] active:scale-90 md:self-end shadow-md shadow-[#cbd9eb]
                      '>
                        <span className="text-lg font-bold"> ⇄ </span>
                  </button>

                  <div className='min-w-0 flex-1'>
                      <p className='mb-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-700'>
                        To
                      </p>
                      <CustomDropDown
                        value={safeTo}
                        onChange={(nextTo)=>{
                          setToKey(nextTo)

                          if(inputValue.trim()){
                            handleConvert(inputValue, safeFrom, nextTo)
                          }
                        }}
                        options={unitOptions}
                      />
                  </div>
                </div>
              </div>
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
              
              {converted !== null ? (
                <div className='flex justify-between'>
                  <div>
                    <div className='flex flex-wrap items-baseline gap-2' >
                      <span className='text-md font-bold tracking-tight text-[#002B5B] md:text-xl' >
                          {formatREsult( converted )}
                      </span>
                      <span className='text-lg font-bold text-[#1d5da3]'>
                          {toUnit?.abbreviation}
                      </span>
                    </div>

                    <div className='flex flex-wrap items-center gap-2 text-xs text-slate-700 font-medium' >
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
                  (<div className='flex items-center gap-2 text-sm text-slate-700 font-medium' >
                    <FiInfo size={15}/>
                    Enter a value and click Convert
                  </div>)
                }
            </div>
          </div>

          </div>

        </div>
      </div>

      <ConversionLinks/>
    </section>
  )
}

export default UnitConverter