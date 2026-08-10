import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrokerPropertyMedia {
    url: string;
    type: string;
    title: string;
    alt?: string;
}

export interface BrokerPropertyFloorPlan {
    url: string;
    type: string;
    title: string;
    alt?: string;
    unit?: string;
}

export interface BrokerPropertyUnit {
    floorPlans: BrokerPropertyFloorPlan[];
    bedrooms?: string;
    commonBathrooms?: string;
    type?: string;
    [key: string]: any;
}

export interface BrokerPropertyFormData {
    residenceType: string;
    brokerId: string | null;
    type: string;
    transactionTag: string;
    name: string;
    linkedProjectId: string;
    possessionStatus: string;
    coordinates: { lat: number | null; lng: number | null };
    subLocality: string;
    address: string;
    cityId: string | null;
    locationId: string | null;
    medias: BrokerPropertyMedia[];
    units: BrokerPropertyUnit[];
    [key: string]: any; // allow dynamic properties like expectedPrice, etc.
}

const initialFormData: BrokerPropertyFormData = {
    residenceType: "Residential",
    brokerId: null,
    type: "",
    transactionTag: "",
    name: "",
    linkedProjectId: "",
    possessionStatus: "",
    coordinates: { lat: null, lng: null },
    subLocality: "",
    address: "",
    cityId: null,
    locationId: null,
    medias: [],
    units: [{ floorPlans: [] }],
};

export interface BrokerPropertyFormState {
    formData: BrokerPropertyFormData;
    currentStep: number;
    hydrated: boolean;
}

export interface BrokerPropertyFormActions {
    setHydrated: () => void;
    setFormData: (dataOrFn: BrokerPropertyFormData | ((prev: BrokerPropertyFormData) => BrokerPropertyFormData)) => void;
    setCurrentStep: (stepOrFn: number | ((prev: number) => number)) => void;
    clearStore: () => void;
}

export const useBrokerPropertyFormStore = create<BrokerPropertyFormState & BrokerPropertyFormActions>()(
    persist(
        (set, get) => ({
            formData: initialFormData,
            currentStep: 1,
            hydrated: false,
            
            setHydrated: () => set({ hydrated: true }),
            
            setFormData: (dataOrFn) => set((state) => ({
                formData: typeof dataOrFn === 'function' ? dataOrFn(state.formData) : dataOrFn
            })),
            
            setCurrentStep: (stepOrFn) => set((state) => ({
                currentStep: typeof stepOrFn === 'function' ? stepOrFn(state.currentStep) : stepOrFn
            })),
            
            clearStore: () => set({ formData: initialFormData, currentStep: 1 }),
        }),
        {
            name: 'broker-property-form-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
