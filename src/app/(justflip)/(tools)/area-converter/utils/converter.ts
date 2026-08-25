import { AREA_STANDARD, ConverterCategory, LENGTH_STANDARD, UnitDefinition } from '../data/standardUnit'

// function takes a value then it converts it to the base value which is (m square) for area and m for lengths
// the function basically changes the input to m by multiplying and then it devides it by to into meters
// the base values are mentioned in the standardUnit.ts file, so we fetch the values from there.
export function convertUnit(value:number, from:UnitDefinition, to:UnitDefinition) : number{
    const baseValue = value * from.toBase
    return baseValue / to.toBase;
}

//the function which rreturns the category the user has selected and then only those related units will be shown.
export function getUnitsCategory( category:ConverterCategory): UnitDefinition[]{
    switch(category){
        case 'area':
            return AREA_STANDARD;
        case 'length':
            return LENGTH_STANDARD
        default :
            return []
    }
}


//this function makes sure, if the user switches from length to area the selected unit also changes so as to keep it safe
export function resolveSafeUnitKey(
  units: UnitDefinition[],
  desiredKey: string,
  fallbackIndex: number
): string {
  if (units.some(unit => unit.key === desiredKey)) return desiredKey
  return units[fallbackIndex]?.key ?? ''
}


//a funtion to format the result to display 
export function formatREsult(value:number) : string{
    if( value === 0 ) return '0';
    const abs = Math.abs(value);

    if(abs >= 2e12 || (abs < 1e-8 && abs > 0)){
        return value.toExponential(6)
    }

    if(abs >= 1000){
        return value.toLocaleString('en-IN', {maximumFractionDigits: 6})
    }

    return parseFloat(value.toPrecision(10)).toString()
}

//function to validate the input so it is nothing but a number.
export function isValidNumericInput(v: string): boolean {
    if (v === '' || v === '-') return true
    return /^-?\d*\.?\d*([eE][+-]?\d*)?$/.test(v)
}