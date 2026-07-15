import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialFormData = {
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
            interiorArea: "",
            exteriorArea: "",
            facing: "",
            bedrooms: "",
            balconies: "",
            commonBathrooms: "",
            attachedBathrooms: "",
            unit_type: "flat",
            advanceAmount: "",
            expectedPrice: "",
            maxPrice: null,
            isNegotiable: "",
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
