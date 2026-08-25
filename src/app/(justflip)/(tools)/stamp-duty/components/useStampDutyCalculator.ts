import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from '@/src/utils/toast';
import rawStampDutyData from '../data.json';
import {
  StampDutyDataSet,
  BuyerGender,
  LocationType,
  StateConfig
} from '@/src/types/stampDuty';

const stampDutyData = rawStampDutyData as StampDutyDataSet;

export const MIN_PROPERTY_VALUE = 500000;      // 5 Lakh
export const MAX_PROPERTY_VALUE = 500000000;   // 50 Crore

export const PRESET_VALUES = [
  { label: '₹25L', value: 2500000 },
  { label: '₹50L', value: 5000000 },
  { label: '₹75L', value: 7500000 },
  { label: '₹1 Cr', value: 10000000 },
  { label: '₹2 Cr', value: 20000000 },
];

export function convertToIndianWords(num: number): string {
  if (!num || num <= 0) return 'Zero';
  if (isNaN(num)) return '';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const numToWordsLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return units[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + ' ' + (units[n % 10] ? units[n % 10] + ' ' : '');
    return units[Math.floor(n / 100)] + ' Hundred ' + numToWordsLessThanThousand(n % 100);
  };

  const convertIndianRecursive = (n: number): string => {
    if (n === 0) return '';
    if (n < 1000) return numToWordsLessThanThousand(n);

    let result = '';
    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const remainder = n % 1000;

    if (crore > 0) {
      result += (crore >= 1000 ? convertIndianRecursive(crore) : numToWordsLessThanThousand(crore)).trim() + ' Crore ';
    }
    if (lakh > 0) result += numToWordsLessThanThousand(lakh).trim() + ' Lakh ';
    if (thousand > 0) result += numToWordsLessThanThousand(thousand).trim() + ' Thousand ';
    if (remainder > 0) result += numToWordsLessThanThousand(remainder).trim();

    return result;
  };

  return convertIndianRecursive(num).trim();
}

export function useStampDutyCalculator() {
  const searchParams = useSearchParams();
  const [selectedState, setSelectedState] = useState<string>('Gujarat');
  const [propertyValue, setPropertyValue] = useState<number>(5000000);
  const [inputValue, setInputValue] = useState<string>('5000000');
  const [gender, setGender] = useState<BuyerGender>('male');
  const [locationType] = useState<LocationType>('urban');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentConfig: StateConfig | undefined = stampDutyData[selectedState];

  const validateAndSetPropertyValue = (val: number) => {
    let finalVal = val;

    if (isNaN(finalVal) || finalVal < MIN_PROPERTY_VALUE) {
      toast.error('Minimum property value allowed is ₹5 Lakh (₹5,00,000)');
      finalVal = MIN_PROPERTY_VALUE;
    } else if (finalVal > MAX_PROPERTY_VALUE) {
      toast.error('Maximum property value allowed is ₹50 Crore (₹50,00,00,000)');
      finalVal = MAX_PROPERTY_VALUE;
    }

    setPropertyValue(finalVal);
    setInputValue(finalVal.toString());
  };

  const updatePropertyValue = (val: number) => {
    validateAndSetPropertyValue(val);
  };

  // Intercept key presses to stop Backspace or Delete when already at or below 5 Lakh
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const numericVal = Number(inputValue);

    if ((e.key === 'Backspace' || e.key === 'Delete') && numericVal <= MIN_PROPERTY_VALUE) {
      e.preventDefault();
      toast.error('Minimum property value allowed is ₹5 Lakh (₹5,00,000)');
    }
  };

  // Prevent entering or pasting any number outside the range [500000, 500000000]
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;

    if (rawVal === '') {
      toast.error('Minimum property value allowed is ₹5 Lakh (₹5,00,000)');
      return;
    }

    const numericVal = Number(rawVal);

    if (isNaN(numericVal)) return;

    if (numericVal < MIN_PROPERTY_VALUE) {
      toast.error('Minimum property value allowed is ₹5 Lakh (₹5,00,000)');
      return;
    }

    if (numericVal > MAX_PROPERTY_VALUE) {
      toast.error('Maximum property value allowed is ₹50 Crore (₹50,00,00,000)');
      return;
    }

    setInputValue(rawVal);
    setPropertyValue(numericVal);
  };

  const handleInputBlur = () => {
    const numericVal = Number(inputValue);

    if (!inputValue || isNaN(numericVal) || numericVal < MIN_PROPERTY_VALUE) {
      toast.error('Minimum property value allowed is ₹5 Lakh (₹5,00,000)');
      setPropertyValue(MIN_PROPERTY_VALUE);
      setInputValue(MIN_PROPERTY_VALUE.toString());
    }
  };

  useEffect(() => {
    const amountParam = searchParams.get('amount');
    if (amountParam) {
      const parsedAmount = Number(amountParam);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        validateAndSetPropertyValue(parsedAmount);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRateForGender = (g: BuyerGender): number => {
    if (!currentConfig) return 0;
    let stampDutyRate = 0;
    let cessRate = 0;

    if (currentConfig.has_slabs && currentConfig.slabs) {
      const slab = currentConfig.slabs.find((s) => {
        const minOk = s.min_value !== undefined ? propertyValue >= s.min_value : true;
        const maxOk = s.max_value !== undefined ? propertyValue <= s.max_value : true;
        return minOk && maxOk;
      });
      stampDutyRate = slab?.rates[g] ?? 5.0;
    } else if (currentConfig.has_location_type && currentConfig.locations) {
      const loc = currentConfig.locations[locationType] || currentConfig.locations.urban;
      stampDutyRate = loc?.rates[g] ?? 5.0;
      cessRate = loc?.cess_percent || 0;
    } else if (currentConfig.rates) {
      stampDutyRate = currentConfig.rates[g] ?? 5.0;
      cessRate = currentConfig.cess_percent || 0;
    }

    return stampDutyRate + cessRate;
  };

  const genderBreakdown = useMemo(() => {
    if (!currentConfig) return [];

    const categories: { key: BuyerGender; label: string }[] = [
      { key: 'male', label: 'Male' },
      { key: 'female', label: 'Female' },
      { key: 'joint_mf', label: 'Joint' },
    ];

    return categories.map((cat) => {
      const rate = getRateForGender(cat.key);
      const amount = (propertyValue * rate) / 100;
      const isActive = currentConfig.has_gender_discount
        ? cat.key === gender || (gender.startsWith('joint') && cat.key === 'joint_mf')
        : true;

      return { ...cat, rate, amount, isActive };
    });
  }, [currentConfig, propertyValue, gender, locationType]);

  const activeRate = useMemo(() => {
    if (!currentConfig) return 0;
    const effectiveGender = currentConfig.has_gender_discount ? gender : 'male';
    return getRateForGender(effectiveGender);
  }, [currentConfig, gender, propertyValue, locationType]);

  const totalCalculatedDuty = (propertyValue * activeRate) / 100;

  return {
    selectedState,
    setSelectedState,
    propertyValue,
    inputValue,
    handleInputChange,
    handleKeyDown,
    handleInputBlur,
    updatePropertyValue,
    gender,
    setGender,
    isDropdownOpen,
    setIsDropdownOpen,
    dropdownRef,
    currentConfig,
    genderBreakdown,
    activeRate,
    totalCalculatedDuty,
    availableStates: Object.keys(stampDutyData),
    MIN_PROPERTY_VALUE,
    MAX_PROPERTY_VALUE,
  };
}