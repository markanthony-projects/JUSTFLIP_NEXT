export interface Location {
    name: string;
    zone?: Zone;
    [key: string]: any;
}

export interface City {
    id?: string;
    name: string;
    slug?: string;
    [key: string]: any;
}

export interface Zone {
    name: string;
    [key: string]: any;
}

export interface Amenity {
    name: string;
    image?: string;
    [key: string]: any;
}

export interface Media {
    title: string;
    url: string;
    alt?: string;
    type?: string;
    [key: string]: any;
}

export interface Unit {
    minPrice: number;
    maxPrice: number;
    type: string;
    floorPlans?: any[];
    [key: string]: any;
}

export interface Project {
    id: string;
    name: string;
    location?: Location;
    city?: City;
    zone?: Zone;
    banner?: Media;
    medias?: Media[];
    amenities?: Amenity[];
    minPrice?: number;
    maxPrice?: number;
    units?: Unit[];
    possessionDate?: string;
    tags?: string;
    summary?: string;
    address?: string;
    residenceType?: string;
    transactionTag?: string;
    priceRange?: string;
    status?: string;
    approval?: string;
    [key: string]: any;
}

export interface Review {
    id?: string;
    rating: number;
    comment?: string;
    userName?: string;
    createdAt?: string;
    [key: string]: any;
}

export interface Builder {
    id: string;
    name: string;
    description?: string;
    startedAt?: number | string;
    totalProjects?: number;
    activeProjects?: number;
    medias?: Media[];
    employees?: any[];
    histories?: any[];
}

export interface BlogSection {
    title?: string;
    image?: Media;
    content?: string;
    paragraphs?: Record<string, string>;
    comments?: { point: string }[];
}

export interface Blog {
    sections?: BlogSection[];
    id: string;
    _id?: string;
    heading: string;
    subHeading?: string;
    description?: string;
    date: string | number;
    image?: Media;
    slug?: string;
    tag?: string | { tag: string };
    meta?: {
        description?: string;
        [key: string]: any;
    };
    [key: string]: any;
}

export interface AuthUser {
    id: string;
    _id?: string;
    name?: string;
    email: string;
    role?: string;
    phone?: string;
    [key: string]: any;
}

export interface OperatedArea {
    locationId: string;
    name: string;
}

export interface BrokerOperatedCity {
    cityId: string | null;
    operatedAreas: OperatedArea[];
}

export interface RegistrationFormData {
    name: string;
    phone: string;
    alternatePhone: string;
    email: string;
    password: string;
    address: string;
    brokerOperatedCities: BrokerOperatedCity[];
    pincode: string;
    rera: string;
    teamSize: string;
    companyOwnership: string;
    companyDescription: string;
    startedAt: string;
    companyAddress: string;
    companyName: string;
    profilePhoto: string;
    officePhoto: string;
    annualIncome: string;
    companyLogo: string;
    expertiesIn: string[];
    missionAndVision: string;
}
