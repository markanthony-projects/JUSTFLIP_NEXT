export interface AdministrativeRegion {
  name: string;
  type: 'State' | 'Union Territory' | 'default_value';
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East' | '';
}

export const DEFAULT_STATE = 'SELECT STATE'

export const INDIAN_STATES_AND_UTS: AdministrativeRegion[] = [
  { name: 'SELECT STATE', type:'default_value', region: ''},
  // --- North India ---
  { name: 'Punjab', type: 'State', region: 'North' },
  { name: 'Haryana', type: 'State', region: 'North' },
  { name: 'Uttar Pradesh', type: 'State', region: 'North' },
  { name: 'Rajasthan', type: 'State', region: 'North' },
  { name: 'Himachal Pradesh', type: 'State', region: 'North' },
  { name: 'Uttarakhand', type: 'State', region: 'North' },
  { name: 'Jammu & Kashmir', type: 'Union Territory', region: 'North' },
  { name: 'Ladakh', type: 'Union Territory', region: 'North' },
  { name: 'Delhi (NCR)', type: 'Union Territory', region: 'North' },
  { name: 'Chandigarh', type: 'Union Territory', region: 'North' },

  // --- South India ---
  { name: 'Tamil Nadu', type: 'State', region: 'South' },
  { name: 'Andhra Pradesh', type: 'State', region: 'South' },
  { name: 'Telangana', type: 'State', region: 'South' },
  { name: 'Karnataka', type: 'State', region: 'South' },
  { name: 'Kerala', type: 'State', region: 'South' },
  { name: 'Puducherry', type: 'Union Territory', region: 'South' },
  { name: 'Lakshadweep', type: 'Union Territory', region: 'South' },
  { name: 'Andaman & Nicobar Islands', type: 'Union Territory', region: 'South' },

  // --- West & Central India ---
  { name: 'Gujarat', type: 'State', region: 'West' },
  { name: 'Maharashtra', type: 'State', region: 'West' },
  { name: 'Goa', type: 'State', region: 'West' },
  { name: 'Dadra & Nagar Haveli and Daman & Diu', type: 'Union Territory', region: 'West' },
  { name: 'Madhya Pradesh', type: 'State', region: 'Central' },
  { name: 'Chhattisgarh', type: 'State', region: 'Central' },

  // --- East & North-East India ---
  { name: 'West Bengal', type: 'State', region: 'East' },
  { name: 'Bihar', type: 'State', region: 'East' },
  { name: 'Jharkhand', type: 'State', region: 'East' },
  { name: 'Odisha', type: 'State', region: 'East' },
  { name: 'Assam', type: 'State', region: 'North-East' },
  { name: 'Tripura', type: 'State', region: 'East' },
  { name: 'Meghalaya', type: 'State', region: 'North-East' },
  { name: 'Mizoram', type: 'State', region: 'North-East' },
  { name: 'Nagaland', type: 'State', region: 'North-East' },
  { name: 'Manipur', type: 'State', region: 'North-East' },
  { name: 'Arunachal Pradesh', type: 'State', region: 'North-East' },
  { name: 'Sikkim', type: 'State', region: 'North-East' },
];