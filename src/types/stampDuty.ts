export type BuyerGender = 'male' | 'female' | 'joint_mf' | 'joint_ff' | 'joint_mm';
export type LocationType = 'urban' | 'rural';

export interface GenderRates {
  male: number;
  female: number;
  joint_mf: number;
  joint_ff: number;
  joint_mm: number;
}

export interface Slab {
  min_value?: number;
  max_value?: number;
  rates: GenderRates;
}

export interface LocationData {
  cess_percent: number;
  rates: GenderRates;
}

export interface RegistrationConfig {
  type: 'cap' | 'percentage';
  value_percent: number;
  max_cap?: number;
}

export interface StateConfig {
  has_location_type: boolean;
  has_slabs: boolean;
  has_gender_discount: boolean;
  cess_percent?: number;
  rates?: GenderRates;
  locations?: Record<LocationType, LocationData>;
  slabs?: Slab[];
  registration: RegistrationConfig;
}

export type StampDutyDataSet = Record<string, StateConfig>;

export interface CalculationResult {
  taxableValue: number;
  stampDutyRate: number;
  cessRate: number;
  effectiveDutyRate: number;
  stampDutyAmount: number;
  regAmount: number;
  totalCost: number;
}