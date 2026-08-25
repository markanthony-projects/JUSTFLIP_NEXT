import React from 'react'
import { CONVERSION_ROUTES } from '../data/conversionRoutes';
import { notFound } from 'next/navigation';
import UnitConverter from '../components/UnitConverter';


type pageProps = {
    params: Promise<{ conversion: string }>
}

const page = async ({ params } : pageProps) => {
    const { conversion } = await params

    const config = CONVERSION_ROUTES[conversion]

    if(!config){
        notFound()
    }

  return (
    <div>
        <UnitConverter 
            initialCategory={config.category}
            initialFrom={config.from}
            initialTo={config.to}
        />
    </div>
  )
}

export default page