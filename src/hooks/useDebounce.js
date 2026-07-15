'use client'
// created the hook and this hook helps us reduce the number of API calls, that takes place when a user tries searching in the 
// search bar for a property, place or projects and builder. when the user stops typing for 3 secs then only the API is called
// so the search is clean and clear.

import React, { useEffect, useState } from 'react'

const useDebounce = ({value, delay = 300}) => {
    const [ debouncedValue, setDebouncedValue ] = useState(value)

    useEffect(() =>{
        const timer = setTimeout(() =>{
            setDebouncedValue(value)
        }, delay)

        return () => clearTimeout(timer);
    })

  return debouncedValue
}

export default useDebounce