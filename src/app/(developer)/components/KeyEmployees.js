'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const KeyEmployees = ({employees=[]}) => {    
    const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <div>
        <section className='w-full' aria-labelledby='key-people-heading' role='region'>
            <h2 id="key-people-heading"
                className="text-xl font-bold mb-1 text-start"
            >
                Key people
            </h2>
            <div className='text-xl font-bold md:font-normal border mb-4' />
            
            <div className="flex justify-start md:justify-center items-center flex-nowrap overflow-x-auto sm:overflow-x-scroll"
                role="list"
            >
                {employees.map((employee, index) => (
                    <figure key={index}
                        role='listitem'
                        onMouseEnter={ () => setHoverIndex(index) }
                        onMouseLeave={ () => setHoverIndex(null)}
                         className={`relative transition-all group duration-500 ease-in-out text-center min-h-44 shrink-0 md:shrink
                        ${
                            hoverIndex === index
                            ? "lg:w-1/3 custom-scale"
                            : hoverIndex !== null
                            ? "lg:w-1/6"
                            : "lg:w-1/2"
                        }
                        w-2/5 md:w-1/3 lg:w-1/2
                        `}
                    >
                        <div className="relative w-full h-44 md:h-60 lg:h-96">
                            <Image src={employee.image}
                                alt={`${employee.name}, ${employee.designation}`}
                                fill
                                sizes="(max-width: 768px) 40vw, (max-width: 1024px) 33vw, 50vw"
                                className="object-cover transform transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0"
                                priority={index === 0} 
                            />

                        </div>

                        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-linear-to-t from-black/80 to-transparent"></div>

                        <figcaption className="absolute bottom-2 right-2 w-full text-white text-right p-2 rounded-md">
                            <p className="text-base md:text-xl font-light capitalize">
                                {employee.name}
                            </p>
                            <p className="text-base md:text-xl font-medium capitalize">
                                {employee.designation}
                            </p>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </section>
    </div>
  )
}

export default KeyEmployees