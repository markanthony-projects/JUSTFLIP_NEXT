'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { BsBuildingFillGear } from 'react-icons/bs'
import { PiBuildingApartment } from 'react-icons/pi'
import { SlLocationPin } from 'react-icons/sl'
import { FaSearch } from 'react-icons/fa'
import { fetchSuggestionsAction } from './search.actions'
import { formatUrl } from '@/src/utils/URLFormatter'
import { TextField } from '../Inputs'
import useDebounce from '@/src/hooks/useDebounce'
import { useRouter } from 'next/router'

//this list should be outside so that it doesn't gets recreated on every render.
//if this is ketp inside the useEffect tha depends on it will run infinitely.
const searchPlaceholderList = [
  {
    title: 'Projects in Bengaluru',
    placeholder: "Search projects like 'Sobha Dream Acres'…",
    aria: 'Search Real Estate Projects in Bengaluru'
  },
  {
    title: 'New Launch in Bengaluru',
    placeholder: 'Search new launch projects in Bengaluru…',
    aria: 'Search New Launch Projects in Bengaluru'
  },
  {
    title: 'Luxury Homes',
    placeholder: 'Search luxury homes in Bengaluru…',
    aria: 'Search Luxury Properties'
  },
  {
    title: 'Top Localities',
    placeholder: 'Search Indiranagar, Whitefield, Koramangala, HSR Layout…',
    aria: 'Search Popular Localities in Bengaluru'
  },
  {
    title: 'IT Hub Locations',
    placeholder: 'Search Whitefield, Electronic City, ORR Belt…',
    aria: 'Search IT Hub Locations'
  },
  {
    title: 'Near Tech Parks',
    placeholder: 'Search near Ecospace, Manyata Tech Park, ITPL…',
    aria: 'Search Properties Near Tech Parks'
  },
  {
    title: 'Near Metro',
    placeholder: 'Search near Metro stations like MG Road, KR Puram…',
    aria: 'Search Properties Near Metro'
  },
  {
    title: 'Near Landmarks',
    placeholder: 'Search near Airport, Silk Board, Majestic…',
    aria: 'Search Properties Near Landmarks'
  },
  {
    title: 'Flats / Apartments',
    placeholder: 'Search Flats & Apartments in Bengaluru…',
    aria: 'Search Flats and Apartments'
  },
  {
    title: 'Villas / Row Houses',
    placeholder: 'Search Villas & Row Houses…',
    aria: 'Search Villas'
  },
  {
    title: 'Top Developers',
    placeholder: 'Search Prestige, Sobha, Brigade, Puravankara…',
    aria: 'Search Developers in Bengaluru'
  },
  {
    title: 'Ready to Move',
    placeholder: 'Search Ready-to-Move Homes in Bengaluru…',
    aria: 'Search Ready to Move Homes'
  }
]

const emptySuggestions = {
  projects: [],
  builders: [],
  locations: []
}

// helper functions
const buildhref = (type, data) => {
    if(type === 'project') {
        return formatUrl(`/properties/${data?.city?.name}/${data?.zone?.name}/${data?.location?.name}/${data?.name}/${data?.id}`)
    }
    if(type === 'location') {
        return `/listings?locationId=${data?.id}`
    }
    if(type === 'builder') {
        return formatUrl(`/developer/${data?.name}/${data?.id}`)
    }
}



const InputBar = () => {
//  const router = useRouter() //to route

  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState(emptySuggestions)
  const [isPending, startTransition] = useTransition()
  //tracks the placeholder index
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  //tracks which result is currently highlighted via keyboard.
  const [activeIndex, setActiveIndex] = useState(-1)

  // Controls dropdown visibility separately from whether suggestions exist.
  // Needed so we can show "no results" state and recent searches even when suggestions array is empty.
  const [isOpen, setIsOpen] = useState(false)

  const debounceRef = useRef(null) //holds the setTimeout id for debounceing.
  const containerRef = useRef(null) //it refers to the whole search bar wrapper.
  const inputRef = useRef(null) //the text input that the user gives.

  //flat suggestions list.
  const flatSuggestions = [
    ...suggestions.projects.map(p => ({ type: 'project', data: p })),
    ...suggestions.locations.map(l => ({ type: 'location', data: l })),
    ...suggestions.builders.map(b => ({ type: 'builder', data: b }))
  ]

  const hasResults = flatSuggestions.length > 0
  //dropdown only shows when we have flat suggestions or isLoading or search has text
  const showDropdown = isOpen && (hasResults || isPending || search.length > 0)

  //handlers
  const handleClose = () => {
    setIsOpen(false)
    setActiveIndex(-1)

    setSuggestions(emptySuggestions)
  }

  //the placeholder rotation
  useEffect(() => {
    if (search.length > 0) return

    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % searchPlaceholderList.length)
    }, 3000)

    return () => {
      clearInterval(interval)
    }
  }, [search])

  //we have a useDebounce hook where we send a callback functiona and a time in secs.
  const debouncedFetch = useDebounce(search => {
    if (!search) {
      setSuggestions(emptySuggestions)
      return
    }

    startTransition(async () => {
      const res = await fetchSuggestionsAction(search)
      console.log('res', res)
      setSuggestions(res)
    })
  }, 300)

  //an outside click handler closes the dropdown if a user clicks outside the dropdown box.
  useEffect(() => {
    const handler = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSuggestions(emptySuggestions)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])


  // handles arrow keys, Enter, Escape. activeIndex tracks which result is "highlighted".
  // -1 = nothing highlighted
//   const handleKeyDown = useCallback(e => {
//     if (!showDropdown) return

//     if (e.key === 'ArrowDown') {
//       e.preventDefault() //to stop the natural behaviour of scrolling the page.
//       setActiveIndex(prev => (prev < flatSuggestions.length - 1 ? prev + 1 : 0))
//     }

//     if (e.key === 'ArrowUp') {
//       e.preventDefault()
//       setActiveIndex(prev => (prev > 0 ? prev - 1 : flatSuggestions.length - 1))
//     }

//     if (e.key === 'Enter') {
//       e.preventDefault()
//       if (activeIndex > 0 && flatSuggestions[activeIndex]) {
//         const item = flatSuggestions[activeIndex]
//         router.push(buildhref(item.type, item.data))
//         handleClose()
//       }
//     }
//   })


  return (
    <div ref={containerRef} className='relative w-full max-w-4xl'>
      {/* input row */}
      <div className='relative w-full bg-white rounded-lg flex shadow-lg h-10 lg:h-12 border border-gray-300'>
        <div className='flex-1 flex items-center px-3 gap-2'>
          {/* a search icon inside the searchbar at the starting point */}
          <FaSearch className='text-gray-400 shrink-0 text-sm' />

          {/* Input wrapper — relative so the animated placeholder can overlay it */}
          <div className='relative flex-1 overflow-hidden'>
            <TextField
              ref={inputRef}
              value={search}
              onChange={e => {
                setSearch(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={() => handleKeyDown()}
              // aria-label = {searchPlaceholderList[aria].aria}
              className='border-none focus:ring-0 text-xs md:text-sm'
            />

            {!search && (
              <span
                key={placeholderIndex}
                className='absolute left-[12px] top-1/2 -translate-y-1/2 text-[#585858] text-xs md:text-sm pointer-events-none animate-slide-up line-clamp-1  md:max-w-[180px] lg:max-w-[290px] md:my-[3px] lg:mt-0'
              >
                {searchPlaceholderList[placeholderIndex].placeholder}
              </span>
            )}
          </div>
        </div>
        <div className='border border-gray-400 h-6 lg:h-8 mx-2' />

        <button
          type='submit'
          aria-label='Search'
          className=' transition-all duration-200 ease-in-out  transform hover:scale-[1.03] active:scale-95 inline-flex items-center justify-center gap-2 px-4 h-full rounded-lg bg-[#002B5B] text-white text-sm font-medium       transition-all duration-200     '
        >
          {/* <FaSearch className="text-lg" /> */}

          <span className='hidden sm:inline'>Search</span>
        </button>

        {!!flatSuggestions.length && (
          <div className='absolute top-full left-0 mt-1 w-full bg-white border-none rounded-lg shadow-xl z-50 max-h-60 overflow-auto scrollbar-xs'>
            {flatSuggestions.map(item => {
              let label, icon, href

              if (item.type === 'project') {
                const p = item.data
                label = p.name
                icon = <PiBuildingApartment />
                href = formatUrl(
                  `/properties/${p.city?.name}/${p.zone?.name}/${p.location?.name}/${p.name}/${p.id}`
                )
              }

              if (item.type === 'location') {
                const l = item.data
                label = l.name
                icon = <SlLocationPin />
                href = `/listings?locationId=${l.id}`
              }

              if (item.type === 'builder') {
                const b = item.data
                label = b.name
                icon = <BsBuildingFillGear />
                href = formatUrl(`/developer/${b.name}/${b.id}`)
              }

              return (
                <Link
                  key={`${item.type}-${item.data.id}`}
                  href={href}
                  className='flex justify-between px-4 py-2 text-xs hover:bg-gray-100'
                >
                  <span>{label}</span>
                  <span className='flex gap-1 text-gray-500'>
                    {icon} {item.type}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}


export default InputBar