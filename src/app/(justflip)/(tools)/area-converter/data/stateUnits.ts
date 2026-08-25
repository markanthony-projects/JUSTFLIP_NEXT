interface UnitDefinition{
    key: string
    label: string
    abbreviation: string
    toBase: number  //the base unit factor is m^2
}

interface StateUnits{
    state: string
    region: 'North' | 'South' | 'East' | 'West' | 'Central';
    units: UnitDefinition[]
}

export const AREA_INDIA_BY_STATE: StateUnits[] = [
    // --- NORTH INDIA ---
  {
    state: 'Punjab & Haryana',
    region: 'North',
    units: [
      { key: 'kanal_pb_hr', label: 'Kanal', abbreviation: 'kanal', toBase: 505.857 },
      { key: 'marla_pb_hr', label: 'Marla', abbreviation: 'marla', toBase: 25.29285 },
      { key: 'bigha_pb_hr', label: 'Bigha', abbreviation: 'bigha', toBase: 842.645 },
      { key: 'killa_pb_hr', label: 'Killa / Ghumaon', abbreviation: 'killa', toBase: 4046.86 },
      { key: 'sarsahi_pb_hr', label: 'Sarsahi', abbreviation: 'sarsahi', toBase: 2.8103 },
    ],
  },
  {
    state: 'Uttar Pradesh',
    region: 'North',
    units: [
      { key: 'bigha_pucca_up', label: 'Pucca Bigha', abbreviation: 'bigha (P)', toBase: 2529.285 },
      { key: 'bigha_kaccha_up', label: 'Kaccha Bigha', abbreviation: 'bigha (K)', toBase: 843.095 },
      { key: 'biswa_pucca_up', label: 'Biswa (Pucca)', abbreviation: 'biswa (P)', toBase: 126.464 },
      { key: 'biswa_kaccha_up', label: 'Biswa (Kaccha)', abbreviation: 'biswa (K)', toBase: 42.155 },
      { key: 'biswansi_up', label: 'Biswansi', abbreviation: 'biswansi', toBase: 6.27096 },
    ],
  },
  {
    state: 'Rajasthan',
    region: 'North',
    units: [
      { key: 'bigha_pucca_rj', label: 'Pucca Bigha', abbreviation: 'bigha (P)', toBase: 2529.285 },
      { key: 'bigha_kaccha_rj', label: 'Kaccha Bigha', abbreviation: 'bigha (K)', toBase: 1618.742 },
      { key: 'biswa_pucca_rj', label: 'Biswa (Pucca)', abbreviation: 'biswa (P)', toBase: 126.464 },
      { key: 'biswa_kaccha_rj', label: 'Biswa (Kaccha)', abbreviation: 'biswa (K)', toBase: 80.937 },
    ],
  },
  {
    state: 'Himachal Pradesh & Uttarakhand',
    region: 'North',
    units: [
      { key: 'bigha_hp_uk', label: 'Bigha', abbreviation: 'bigha', toBase: 809.371 },
      { key: 'biswa_hp_uk', label: 'Biswa', abbreviation: 'biswa', toBase: 40.468 },
      { key: 'biswansi_hp_uk', label: 'Biswansi', abbreviation: 'biswansi', toBase: 2.023 },
    ],
  },

  // --- SOUTH INDIA ---
  {
    state: 'Tamil Nadu',
    region: 'South',
    units: [
      { key: 'ground_tn', label: 'Ground', abbreviation: 'ground', toBase: 222.967 },
      { key: 'cent_tn', label: 'Cent', abbreviation: 'cent', toBase: 40.4686 },
    ],
  },
  {
    state: 'Andhra Pradesh & Telangana',
    region: 'South',
    units: [
      { key: 'kuncham_ap', label: 'Kuncham', abbreviation: 'kuncham', toBase: 404.686 },
      { key: 'guntha_ap_ts', label: 'Guntha / Gunta', abbreviation: 'guntha', toBase: 101.1714 },
      { key: 'cent_ap_ts', label: 'Cent', abbreviation: 'cent', toBase: 40.4686 },
      { key: 'ankanam_ap_ts', label: 'Ankanam', abbreviation: 'ankanam', toBase: 6.689 },
    ],
  },
  {
    state: 'Karnataka & Kerala',
    region: 'South',
    units: [
      { key: 'guntha_ka', label: 'Guntha / Gunta', abbreviation: 'guntha', toBase: 101.1714 },
      { key: 'cent_ka_kl', label: 'Cent', abbreviation: 'cent', toBase: 40.4686 },
    ],
  },

  // --- EAST & NORTH-EAST INDIA ---
  {
    state: 'West Bengal',
    region: 'East',
    units: [
      { key: 'bigha_wb', label: 'Bigha', abbreviation: 'bigha', toBase: 1337.803 },
      { key: 'katha_wb', label: 'Katha', abbreviation: 'katha', toBase: 66.890 },
      { key: 'decimal_wb', label: 'Decimal / Shatak', abbreviation: 'dec', toBase: 40.4686 },
      { key: 'chatak_wb', label: 'Chatak', abbreviation: 'chatak', toBase: 4.1806 },
    ],
  },
  {
    state: 'Bihar & Jharkhand',
    region: 'East',
    units: [
      { key: 'bigha_bihar', label: 'Bigha', abbreviation: 'bigha', toBase: 2528.82 },
      { key: 'katha_bihar', label: 'Katha', abbreviation: 'katha', toBase: 126.464 },
      { key: 'dhur_bihar', label: 'Dhur', abbreviation: 'dhur', toBase: 6.323 },
    ],
  },
  {
    state: 'Assam',
    region: 'East',
    units: [
      { key: 'bigha_assam', label: 'Bigha', abbreviation: 'bigha', toBase: 1337.803 },
      { key: 'katha_assam', label: 'Katha', abbreviation: 'katha', toBase: 267.560 },
      { key: 'lecha_assam', label: 'Lecha', abbreviation: 'lecha', toBase: 13.378 },
    ],
  },
  {
    state: 'Odisha',
    region: 'East',
    units: [
      { key: 'guntha_od', label: 'Guntha', abbreviation: 'guntha', toBase: 101.1714 },
      { key: 'decimal_od', label: 'Decimal', abbreviation: 'dec', toBase: 40.4686 },
    ],
  },
  {
    state: 'Tripura',
    region: 'East',
    units: [
      { key: 'kranta_tripura', label: 'Kranta', abbreviation: 'kranta', toBase: 6.689 },
      { key: 'dhur_tripura', label: 'Dhur', abbreviation: 'dhur', toBase: 0.3344 },
    ],
  },

  // --- WEST & CENTRAL INDIA ---
  {
    state: 'Gujarat & Maharashtra',
    region: 'West',
    units: [
      { key: 'vigha_gj_mh', label: 'Vigha / Bigha', abbreviation: 'vigha', toBase: 1618.742 },
      { key: 'guntha_gj_mh', label: 'Guntha', abbreviation: 'guntha', toBase: 101.1714 },
      { key: 'vasah_gj', label: 'Vasah', abbreviation: 'vasah', toBase: 80.937 },
    ],
  },
  {
    state: 'Madhya Pradesh & Chhattisgarh',
    region: 'Central',
    units: [
      { key: 'bigha_mp', label: 'Bigha', abbreviation: 'bigha', toBase: 1114.836 },
      { key: 'katha_mp', label: 'Katha', abbreviation: 'katha', toBase: 55.741 },
    ],
  },
]


