interface UnitDefinition{
    key: string
    label: string
    abbreviation: string
    toBase: number
}

interface StateUnits{
    state: string[]
    region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Pan-India' | 'North-East';
    units: UnitDefinition[]
}

export const LENGTH_BY_STATE: StateUnits[] = [
  // --- PAN-INDIA TRADITIONAL UNITS ---
  {
    state: ['Pan-India'],
    region: 'Pan-India',
    units: [
      { key: 'gaj', label: 'Gaj / Gaz (Yard)', abbreviation: 'gaj', toBase: 0.9144 },
      { key: 'hath', label: 'Hath / Haath (Cubit)', abbreviation: 'hath', toBase: 0.4572 },
      { key: 'gattha', label: 'Gattha / Latha', abbreviation: 'gattha', toBase: 2.5146 },
      { key: 'jarib_gunter', label: 'Jarib (Gunter\'s Chain)', abbreviation: 'jarib', toBase: 20.1168 },
      { key: 'kadi', label: 'Kadi (Chain Link)', abbreviation: 'kadi', toBase: 0.201168 },
      { key: 'bitta', label: 'Bitta (Handspan)', abbreviation: 'bitta', toBase: 0.2286 },
      { key: 'angul', label: 'Angul (Finger-width)', abbreviation: 'angul', toBase: 0.01905 },
    ],
  },

  // --- NORTH INDIA ---
  {
    state: ['Punjab', 'Haryana'],
    region: 'North',
    units: [
      { key: 'karam_pb_hr', label: 'Karam', abbreviation: 'karam', toBase: 1.4478 }, // 5.5 feet
      { key: 'sarsahi_len_pb', label: 'Sarsahi (Length)', abbreviation: 'sarsahi', toBase: 1.6764 },
      { key: 'gaj_pb_hr', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
    ],
  },
  {
    state: ['Jammu & Kashmir', 'Ladakh'],
    region: 'North',
    units: [
      { key: 'karam_jk', label: 'Karam', abbreviation: 'karam', toBase: 1.4478 },
      { key: 'sarsai_len_jk', label: 'Sarsai', abbreviation: 'sarsai', toBase: 1.6764 },
      { key: 'gaj_jk', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
    ],
  },
  {
    state: ['Uttar Pradesh', 'Delhi (NCR)'],
    region: 'North',
    units: [
      { key: 'gattha_up', label: 'Gattha / Gatha (5.5 Hath)', abbreviation: 'gattha', toBase: 2.5146 },
      { key: 'hath_up', label: 'Hath (Cubit)', abbreviation: 'hath', toBase: 0.4572 },
      { key: 'latha_up', label: 'Latha', abbreviation: 'latha', toBase: 2.5146 },
      { key: 'gaj_up', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
    ],
  },
  {
    state: ['Rajasthan'],
    region: 'North',
    units: [
      { key: 'gattha_rj', label: 'Gattha', abbreviation: 'gattha', toBase: 2.5146 },
      { key: 'gaj_rj', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
      { key: 'hath_rj', label: 'Hath', abbreviation: 'hath', toBase: 0.4572 },
    ],
  },
  {
    state: ['Himachal Pradesh', 'Uttarakhand'],
    region: 'North',
    units: [
      { key: 'hath_hp_uk', label: 'Hath', abbreviation: 'hath', toBase: 0.4572 },
      { key: 'gaj_hp_uk', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
    ],
  },

  // --- SOUTH INDIA ---
  {
    state: ['Tamil Nadu', 'Puducherry'],
    region: 'South',
    units: [
      { key: 'kai_tn', label: 'Kai (Cubit)', abbreviation: 'kai', toBase: 0.4572 },
      { key: 'kol_tn', label: 'Kol / Stick Length', abbreviation: 'kol', toBase: 0.9144 },
      { key: 'sanam_tn', label: 'Chaanam (Span)', abbreviation: 'chaanam', toBase: 0.2286 },
    ],
  },
  {
    state: ['Karnataka'],
    region: 'South',
    units: [
      { key: 'moora_ka', label: 'Moora (Cubit)', abbreviation: 'moora', toBase: 0.4572 },
      { key: 'gaja_ka', label: 'Gaja', abbreviation: 'gaja', toBase: 0.9144 },
      { key: 'bareda_ka', label: 'Bareda (Arm Span)', abbreviation: 'bareda', toBase: 1.8288 },
    ],
  },
  {
    state: ['Andhra Pradesh', 'Telangana'],
    region: 'South',
    units: [
      { key: 'moora_ap_ts', label: 'Moora (Cubit)', abbreviation: 'moora', toBase: 0.4572 },
      { key: 'gajamu_ap_ts', label: 'Gajamu', abbreviation: 'gajamu', toBase: 0.9144 },
      { key: 'bareda_ap_ts', label: 'Bareda', abbreviation: 'bareda', toBase: 1.8288 },
    ],
  },
  {
    state: ['Kerala'],
    region: 'South',
    units: [
      { key: 'kol_kl', label: 'Kol (Thatchu Kol)', abbreviation: 'kol', toBase: 0.72 },
      { key: 'viral_kl', label: 'Viral', abbreviation: 'viral', toBase: 0.03 },
      { key: 'moolam_kl', label: 'Moolam (Cubit)', abbreviation: 'moolam', toBase: 0.4572 },
    ],
  },

  // --- WEST & CENTRAL INDIA ---
  {
    state: ['Gujarat', 'Maharashtra', 'Goa'],
    region: 'West',
    units: [
      { key: 'kathi_gj_mh', label: 'Kathi (Survey Rod)', abbreviation: 'kathi', toBase: 2.5146 },
      { key: 'gaj_gj_mh', label: 'Gaj / Gaz', abbreviation: 'gaj', toBase: 0.9144 },
      { key: 'haath_gj_mh', label: 'Haath', abbreviation: 'haath', toBase: 0.4572 },
      { key: 'vaas_gj', label: 'Vaas', abbreviation: 'vaas', toBase: 3.048 },
    ],
  },
  {
    state: ['Madhya Pradesh', 'Chhattisgarh'],
    region: 'Central',
    units: [
      { key: 'latha_mp', label: 'Latha / Gattha', abbreviation: 'latha', toBase: 2.5146 },
      { key: 'hath_mp', label: 'Hath', abbreviation: 'hath', toBase: 0.4572 },
      { key: 'gaj_mp', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
    ],
  },

  // --- EAST & NORTH-EAST INDIA ---
  {
    state: ['West Bengal'],
    region: 'East',
    units: [
      { key: 'naltha_wb', label: 'Naltha / Nala', abbreviation: 'naltha', toBase: 2.4384 },
      { key: 'hath_wb', label: 'Hath', abbreviation: 'hath', toBase: 0.4572 },
      { key: 'gaj_wb', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
      { key: 'bighat_wb', label: 'Bighat', abbreviation: 'bighat', toBase: 0.2286 },
    ],
  },
  {
    state: ['Bihar', 'Jharkhand'],
    region: 'East',
    units: [
      { key: 'laggi_bihar', label: 'Laggi / Latha', abbreviation: 'laggi', toBase: 2.5146 },
      { key: 'hath_bihar', label: 'Hath', abbreviation: 'hath', toBase: 0.4572 },
      { key: 'gaj_bihar', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
    ],
  },
  {
    state: ['Assam', 'Meghalaya', 'Nagaland', 'Manipur', 'Mizoram', 'Arunachal', 'Sikkim '],
    region: 'North-East',
    units: [
      { key: 'tora_assam', label: 'Tora / Lathi', abbreviation: 'tora', toBase: 2.4384 },
      { key: 'hat_assam', label: 'Hat', abbreviation: 'hat', toBase: 0.4572 },
      { key: 'gaj_assam', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
    ],
  },
  {
    state: ['Odisha'],
    region: 'East',
    units: [
      { key: 'hath_od', label: 'Hath', abbreviation: 'hath', toBase: 0.4572 },
      { key: 'gaj_od', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
      { key: 'kadi_od', label: 'Kadi', abbreviation: 'kadi', toBase: 0.201168 },
    ],
  },
  {
    state: ['Tripura'],
    region: 'East',
    units: [
      { key: 'hat_tripura', label: 'Hat', abbreviation: 'hat', toBase: 0.4572 },
      { key: 'gaj_tripura', label: 'Gaj', abbreviation: 'gaj', toBase: 0.9144 },
      { key: 'nal_tripura', label: 'Nal', abbreviation: 'nal', toBase: 2.4384 },
    ],
  },
]