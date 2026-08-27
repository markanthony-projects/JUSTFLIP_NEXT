'use client'
import React from 'react'
import Image from 'next/image'

export interface KeyEmployeesProps {
    employees?: any[];
}

const KeyEmployees = ({ employees = [] }: KeyEmployeesProps) => {

    if (!employees || employees.length === 0) return null;

    const EmployeeCard = ({ employee, index }: { employee: any, index: number }) => (
        <figure
            role='listitem'
            className="group relative shrink-0 w-64 md:w-72 lg:w-80 h-80 md:h-96 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.2)] transition-all duration-500 ease-out hover:-translate-y-2 cursor-pointer"
        >
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={employee.image}
                    alt={`${employee.name}, ${employee.designation}`}
                    fill
                    sizes="(max-width: 768px) 256px, 320px"
                    className="object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                    priority={index < 3}
                />
            </div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#001f42] via-[#001f42]/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300"></div>
            
            {/* Info Container */}
            <figcaption className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#001f42]/70 border border-white/10 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                <p className="text-white text-lg md:text-xl font-bold capitalize truncate mb-0.5">
                    {employee.name}
                </p>
                <p className="text-blue-200 text-xs md:text-sm font-medium tracking-wide uppercase truncate">
                    {employee.designation}
                </p>
            </figcaption>
        </figure>
    )

    return (
        <section className='w-full' aria-labelledby='key-people-heading' role='region'>
            <div className="md:mb-4 mb-3 flex items-center justify-between">
                <h2 id="key-people-heading" className="text-xl md:text-2xl lg:text-3xl font-bold text-[#002B5B] tracking-tight">
                    Key People
                </h2>
            </div>
            
            {/* Native smooth horizontal scroll container */}
            <div 
                role="list"
                className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 -mx-2 snap-x snap-mandatory scrollbar-modern"
                style={{ scrollbarWidth: 'thin' }}
            >
                {employees.map((employee, index) => (
                    <div key={`${employee.id ?? employee.name}-${index}`} className="snap-start">
                        <EmployeeCard employee={employee} index={index} />
                    </div>
                ))}
            </div>
        </section>
    )
}

export default KeyEmployees