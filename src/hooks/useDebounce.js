'use client'
import { useCallback, useEffect, useRef } from 'react';

const useDebounce = ({callback, delay = 300}) => {
    //a mutable reference to the current timer.
    const timerRef = useRef(null);
    //a mutable reference to the latest callback to prevent the debounce timer from resetting if the cllback function changes on a parent re-render.
    const callbackRef = useRef(null)
    // const [ debouncedValue, setDebouncedValue ] = useState(value)

    useEffect(() => {
        callbackRef.current = callback
    },[callback])

    //we have to clean up the timer if the component unmounts.
    useEffect(()=> {
        return () =>{
            if(timerRef.current) clearTimeout(timerRef.current);
        }
    },[])

    //return a memoized function that haandles debouncing.
    return useCallback((...args) => {
        if(timerRef.current){
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(()=>{
            callbackRef.current(...args)
        },delay)
    }, [delay])

    // useEffect(() =>{
    //     const timer = setTimeout(() =>{
    //         setDebouncedValue(value)
    //     }, delay)

    //     return () => clearTimeout(timer);
    // })

//   return debouncedValue
}

export default useDebounce