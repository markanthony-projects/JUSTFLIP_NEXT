import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialFormData = {
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

export const useBrokerPropertyFormStore = create(
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
