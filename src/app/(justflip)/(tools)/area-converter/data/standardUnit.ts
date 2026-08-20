export type UnitDefinition = { 
    key: string; 
    label: string; 
    abbreviation: string; 
    toBase: number 
}

export type ConverterCategory = 'area' | 'length'

//For Area, the base unit is: Square Meter (m²)
export const AREA_STANDARD: UnitDefinition[] = [
  { key: 'sqm', label: 'Square Meter', abbreviation: 'm²', toBase: 1 },
  { key: 'sqkm', label: 'Square Kilometer', abbreviation: 'km²', toBase: 1_000_000 },
  { key: 'sqcm', label: 'Square Centimeter', abbreviation: 'cm²', toBase: 0.0001 },
  { key: 'sqmm', label: 'Square Millimeter', abbreviation: 'mm²', toBase: 0.000001 },
  { key: 'sqft', label: 'Square Foot', abbreviation: 'ft²', toBase: 0.09290304 },
  { key: 'sqin', label: 'Square Inch', abbreviation: 'in²', toBase: 0.00064516 },
  { key: 'sqyd', label: 'Square Yard', abbreviation: 'yd²', toBase: 0.83612736 },
  { key: 'sqmi', label: 'Square Mile', abbreviation: 'mi²', toBase: 2_589_988.11 },
  { key: 'acre', label: 'Acre', abbreviation: 'ac', toBase: 4046.86 },
  { key: 'hectare', label: 'Hectare', abbreviation: 'ha', toBase: 10_000 },
]
export const DEFAULT_AREA_FROM = 'sqm'
export const DEFAULT_AREA_TO = 'sqft'

//For Area, the base unit is: Square Meter (m)
export const LENGTH_STANDARD: UnitDefinition[] = [
  { key: 'm', label: 'Meter', abbreviation: 'm', toBase: 1 },
  { key: 'km', label: 'Kilometer', abbreviation: 'km', toBase: 1000 },
  { key: 'cm', label: 'Centimeter', abbreviation: 'cm', toBase: 0.01 },
  { key: 'mm', label: 'Millimeter', abbreviation: 'mm', toBase: 0.001 },
  { key: 'ft', label: 'Foot', abbreviation: 'ft', toBase: 0.3048 },
  { key: 'in', label: 'Inch', abbreviation: 'in', toBase: 0.0254 },
  { key: 'yd', label: 'Yard', abbreviation: 'yd', toBase: 0.9144 },
  { key: 'mi', label: 'Mile', abbreviation: 'mi', toBase: 1609.344 },
  { key: 'nm', label: 'Nautical Mile', abbreviation: 'nmi', toBase: 1852 },
]
export const DEFAULT_LENGTH_FROM = 'm'
export const DEFAULT_LENGTH_TO = 'ft'

