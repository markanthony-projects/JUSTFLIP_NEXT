import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const initialFormData = {
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

export const useUserPropertyFormStore = create(
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
