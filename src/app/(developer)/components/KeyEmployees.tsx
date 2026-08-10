'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export interface KeyEmployeesProps {
    employees?: any[];
}

const KeyEmployees = ({employees=[]}: KeyEmployeesProps) => {    
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null)
    const isHoveredRef = useRef(false)
    const isProgrammaticRef = useRef(false)

    const loopedEmployees = [ ...employees, ...employees]

    //--------------------------for horizontal scroll --------------------------------------------------------------------------
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return
        // console.log(container.scrollWidth, container.clientWidth)

        const mediaQuery = window.matchMedia('(max-width: 767px)')
        if (!mediaQuery.matches) return
        
        container.style.scrollBehavior = 'auto'
        const half = container.scrollWidth/2
        const maxUserScroll = half - container.clientWidth  //length when the user tries to scroll
        
        const interval = setInterval(() => {
            if (!container || isHoveredRef.current) return

            isProgrammaticRef.current = true 
            container.scrollLeft += 1

            if (container.scrollLeft >= half) {
                container.scrollLeft -= half 
            }
            
            requestAnimationFrame(() => { isProgrammaticRef.current = false })
        }, 30)

        const handleScroll = () => {
            if (isProgrammaticRef.current) return 

            //this scroll came from the USER — clamp it so they can never scroll into the duplicate half
            if(container.scrollLeft >= maxUserScroll){
                container.scrollLeft = maxUserScroll
            }else if(container.scrollLeft < 0){
                container.scrollLeft = 0
            }
        }
        container.addEventListener('scroll',handleScroll)

       return () => {
        clearInterval(interval)
        container.removeEventListener('scroll', handleScroll)
       }
    }, [employees]);

    //-----------------------------------employeeCard component --------------------------------------------------------------
    const EmployeeCard = ({ employee, index }: { employee: any, index: number }) => (
        <figure
            role='listitem'
            onMouseEnter={ () => setHoverIndex(index) }
            onMouseLeave={ () => setHoverIndex(null) }
            className={`relative transition-all group duration-500 ease-in-out shrink-0 min-h-44 md:shrink w-2/5 sm:w-[45%] md:w-1/3 lg:w-1/2
            ${
                hoverIndex === index
                ? "lg:w-1/3 scale-102"
                : hoverIndex !== null
                ? "lg:w-1/4"
                : "lg:w-1/2"
            }
            `}
        >
            <div className="relative w-full h-60 sm:h-75 md:h-60 lg:h-96">
                <Image src={employee.image}
                    alt={`${employee.name}, ${employee.designation}`}
                    fill
                    sizes="(max-width: 768px) 40vw, (max-width: 1024px) 33vw, 50vw"
                    className="object-cover transform transition-all duration-700 ease-in-out"
                    priority={index === 0} 
                />
            </div>
            <div className="absolute bg-linear-to-t inset-0 from-black/90 via-black/40 to-transparent"></div>
            <figcaption className="absolute bottom-2 right-2 w-full text-white text-right p-2 rounded-md ">
                <p className="text-[15px] md:text-xl font-semibold capitalize truncate text-start ml-1">
                    {employee.name}
                </p>
                <p className="text-[15px] md:text-xl capitalize truncate text-start ml-1">
                    {employee.designation}
                </p>
            </figcaption>
        </figure>
    )

  return (
    <div>
        <section className='w-full' aria-labelledby='key-people-heading' role='region'>
            <h2 id="key-people-heading" className="text-xl font-bold mb-1 text-start">
                Key people
            </h2>
            <div className='text-xl font-bold md:font-normal border mb-4' />
            
            {/* ADDED: mobile-only marquee — visible below md, has the ref + all scroll JS attached */}
            <div role="list"
                ref={scrollRef}
                onMouseEnter={() => { isHoveredRef.current = true }} 
                onMouseLeave={() => { isHoveredRef.current = false; setHoverIndex(null) }}
                className="md:hidden flex gap-0.5 justify-start items-center flex-nowrap overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            >
                {loopedEmployees.map((employee, index) => (
                    <EmployeeCard key={`${employee.id ?? employee.name}-${index}`} employee={employee} index={index} />
                ))}
            </div>

            {/* ADDED: desktop-only static row — visible md and up, NO ref, NO scroll JS, pure hover-grow like your original */}
            <div role="list"
                className="hidden md:flex gap-0.5 justify-center items-center flex-nowrap"
            >
                {employees.map((employee, index) => (
                    <EmployeeCard key={`${employee.id ?? employee.name}-desktop-${index}`} employee={employee} index={index} />
                ))}
            </div>
        </section>
    </div>
  )
}




export default KeyEmployees