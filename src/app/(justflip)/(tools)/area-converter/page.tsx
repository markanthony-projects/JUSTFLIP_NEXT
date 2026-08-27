import React from 'react'
import UnitConverter from './components/UnitConverter';
import type { Metadata } from 'next';
import { constructMetadata } from '@/src/utils/seo';
import ScrollToTop from '@/src/components/atoms/ScrollToTop';


export const dynamic = "force-static";

export const metadata: Metadata = constructMetadata({
  title: "Real Estate Land & Area Unit Converter | Justflip",
  description: "Convert land and area measurements between Sq.ft, Sq.yards, Acres, Guntha, Bigha, Marla, and Hectares with Justflip's Unit Converter.",
  canonical: "/area-converter",
});

const AreaConverterPage = () => {
  return (
    <div>
      <UnitConverter />
    </div>
  );
};

export default AreaConverterPage;