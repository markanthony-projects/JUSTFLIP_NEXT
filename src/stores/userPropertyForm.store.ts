import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PropertyUnit {
    flatsCount: number | null;
    furnishing: string;
    interiorArea: number | null;
    exteriorArea: number | null;
    facing: string;
    bedrooms: number | null;
    balconies: number | null;
    commonBathrooms: number | null;
    attachedBathrooms: number | null;
    unit_type: string;
    advanceAmount: number | null;
    expectedPrice: number | null;
    maxPrice: number | null;
    isNegotiable: boolean;
    floorPlans: any[];
}

export interface UserPropertyFormData {
    residenceType: string;
    ownerId: string | null;
    uploadedBy: string | null;
    type: string;
    transactionTag: string;
    name: string;
    subLocality: string;
    address: string;
    cityId: string | null;
    locationId: string | null;
    coordinates: { lat: number; lng: number };
    possessionStatus: string;  
    description: string;
    medias: any[];
    units: PropertyUnit[];
}

export const initialFormData: UserPropertyFormData = {
    residenceType: "",
    ownerId: null,
    uploadedBy: null,
    type: "",
    transactionTag: "",
    name: "",
    subLocality: "",
    address: "",
    cityId: null,
    locationId: null,
    coordinates: { lat: 0, lng: 0 },
    possessionStatus: "",  
    description: "",
    medias: [],
    units: [
        {
            flatsCount: null,
            furnishing: "",
            interiorArea: null,
            exteriorArea: null,
            facing: "",
            bedrooms: null,
            balconies: null,
            commonBathrooms: null,
            attachedBathrooms: null,
            unit_type: "flat",
            advanceAmount: null,
            expectedPrice: null,
            maxPrice: null,
            isNegotiable: true,
            floorPlans: []
        }
    ]
};

export interface UserPropertyFormState {
    formData: UserPropertyFormData;
    currentStep: number;
    hydrated: boolean;
}

export interface UserPropertyFormActions {
    setHydrated: () => void;
    setFormData: (dataOrFn: UserPropertyFormData | ((prev: UserPropertyFormData) => UserPropertyFormData)) => void;
    setCurrentStep: (stepOrFn: number | ((prev: number) => number)) => void;
    clearStore: () => void;
}

export const useUserPropertyFormStore = create<UserPropertyFormState & UserPropertyFormActions>()(
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
            name: 'user-property-form-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
