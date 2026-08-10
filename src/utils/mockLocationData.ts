export interface RecentlySearched {
  id: string;
  name: string;
  type: string;
}

export interface Locality {
  id: string;
  name: string;
  city: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  city: string;
  image: string;
}

export interface City {
  id: string;
  name: string;
}

export const RECENTLY_SEARCHED: RecentlySearched[] = [
  { id: 'recent-1', name: 'Noida', type: 'city' },
];

export const TOP_LOCALITIES: Locality[] = [
  { id: 'loc-1', name: 'Noida Extension, Noida', city: 'Noida' },
  { id: 'loc-2', name: 'Sector 150, Noida', city: 'Noida' },
  { id: 'loc-3', name: 'Sector 107, Noida', city: 'Noida' },
  { id: 'loc-4', name: 'Sector 75, Noida', city: 'Noida' },
  { id: 'loc-5', name: 'Sector 140A, Noida', city: 'Noida' },
  // Additional localities for other cities if needed
  { id: 'loc-6', name: 'Whitefield, Bengaluru', city: 'Bengaluru' },
  { id: 'loc-7', name: 'Koramangala, Bengaluru', city: 'Bengaluru' },
  { id: 'loc-8', name: 'Indiranagar, Bengaluru', city: 'Bengaluru' },
  { id: 'loc-9', name: 'Jayanagar, Bengaluru', city: 'Bengaluru' },
  { id: 'loc-10', name: 'Malleswaram, Bengaluru', city: 'Bengaluru' },
  { id: 'loc-11', name: 'Electronic City, Bengaluru', city: 'Bengaluru' },
];

export const TOP_PROJECTS: Project[] = [
  { 
    id: 'proj-1', 
    name: 'ACE Divino', 
    location: 'Noida Extension, Noida', 
    city: 'Noida',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&h=300&fit=crop'
  },
  { 
    id: 'proj-2', 
    name: 'Gulshan Dynasty', 
    location: 'Sector 144, Noida', 
    city: 'Noida',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=300&fit=crop'
  },
  { 
    id: 'proj-3', 
    name: 'ATS Knightsbridge', 
    location: 'Sector 124, Noida', 
    city: 'Noida',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=300&h=300&fit=crop'
  }
];

export const POPULAR_CITIES: City[] = [
  { id: 'city-1', name: 'Noida' },
  { id: 'city-2', name: 'Mumbai' },
  { id: 'city-3', name: 'Bangalore' },
  { id: 'city-4', name: 'New Delhi' },
  { id: 'city-5', name: 'Ahmedabad' },
  { id: 'city-6', name: 'Pune' },
  { id: 'city-7', name: 'Gurgaon' },
  { id: 'city-8', name: 'Ghaziabad' },
  { id: 'city-9', name: 'Greater Noida' },
  { id: 'city-10', name: 'Kolkata' },
  { id: 'city-11', name: 'Chennai' },
  { id: 'city-12', name: 'Hyderabad' },
  { id: 'city-13', name: 'Other' }
];
