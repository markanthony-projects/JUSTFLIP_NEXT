"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/src/components/organisms/breadCrumb";
import { useAuthStore } from "@/src/stores/auth.store";
import { useBrokerPropertyFormStore, BrokerPropertyFormData } from "@/src/stores/brokerPropertyForm.store";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { JUSTFLIP } from "@/src/lib/axios/api";
import { toast } from "@/src/utils/toast";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { VscGitStashApply } from "react-icons/vsc";
import BrokerPropertyStepper from "./BrokerPropertyStepper";
import BrokerPropertyMedia from "./BrokerPropertyMedia";
import BrokerPropertyFormRenderer from "./BrokerPropertyFormRenderer";
import dynamic from "next/dynamic";

const BrokerPropertyMap = dynamic(() => import("./BrokerPropertyMap"), { ssr: false });
import { getInputFields, UNIT_FIELDS } from "./constants";
import LocationService from "@/src/services/LocationService";
import * as ProjectService from "@/src/services/ProjectService";
import BrokerPropertySidebarStepper from "./BrokerPropertySidebarStepper";
import PublishPropertySidebar from "../PublishProperty/PublishPropertySidebar";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const determineUnitType = (bedrooms: string | number, commonBathrooms: string | number) => {
    const bed = Number(bedrooms);
    const bath = Number(commonBathrooms);
    if (isNaN(bed)) return "";
    if (bed === 1) return "1BHK";
    if (bed === 2) return bed > bath ? "1.5BHK" : "2BHK";
    if (bed === 3) return bed > bath ? "2.5BHK" : "3BHK";
    if (bed === 4) return bed > bath ? "3.5BHK" : "4BHK";
    if (bed === 5) return bed > bath ? "4.5BHK" : "5BHK";
    return "5+BHK";
};

const MEDIA_TITLE_MAP = {
    exterior_view_images_URL: "banner",
    others_images: "other",
    video_URL: "video",
};

const buildInitialFormData = (brokerId: string | null, residenceType: string, transactionType: string) => ({
    residenceType: residenceType || "Residential",
    brokerId,
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
});

// ─── Component ────────────────────────────────────────────────────────────────

import { City } from "@/src/types";

interface BrokerPropertyClientProps {
    initialCities?: City[];
}

function BrokerPropertyClient({ initialCities = [] }: BrokerPropertyClientProps) {
    // console.log("BrokerPropertyClient initialCities:", initialCities);
    const router = useRouter();
    const { user, isLoading } = useAuthStore();
    // console.log("BrokerPropertyClient user:", user);
    const { uploadFiles, loading: isUploading } = useFileUpload();

    const brokerId = user?.id || user?.centralUserId || null; // Fallback to hardcoded broker ID if not available

    // Residence / transaction types from session (set after mount)
    const [residenceType, setResidenceType] = useState("Residential");
    const [transactionType, setTransactionType] = useState("Sale");

    // Form state from Zustand store
    const { formData, setFormData, currentStep, setCurrentStep, clearStore, hydrated } = useBrokerPropertyFormStore();

    useEffect(() => {
        console.log("Hydrated:", hydrated);
        console.log("Current Step:", currentStep);
        console.log("Form Data:", formData);
    }, [hydrated, currentStep]);
    
    // Prevent rendering until hydration is complete to avoid hydration mismatch errors
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isMapOpen, setIsMapOpen] = useState(false);

    const [showDraftModal, setShowDraftModal] = useState(false)
    // Location search
    const [locationQuery, setLocationQuery] = useState("");
    const [locationSuggestions, setLocationSuggestions] = useState<{label: string, value: string}[]>([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    // Project search
    const [projectQuery, setProjectQuery] = useState("");
    const [projectSuggestions, setProjectSuggestions] = useState<{name: string, id: string}[]>([]);
    const [showProjectDropdown, setShowProjectDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const searchTimeout = useRef<number | ReturnType<typeof setTimeout> | null>(null);

    // City options from prop (server-fetched)
    const cityOptions = initialCities.map((c) => ({ label: c.city_Name || c.name || "", value: c.id || "" }));
    const inputFields = getInputFields(formData.type, cityOptions, [], transactionType);

    useEffect(() => {
        if(isMounted && hydrated && currentStep > 1){
            setShowDraftModal(true)
        }
    },[isMounted,hydrated])

    const handleStartFresh = useCallback(() => {
        clearStore();
        setFormData(buildInitialFormData(brokerId, residenceType, transactionType));
        setCurrentStep(1);
        setProjectQuery("");
        setLocationQuery("");
        setErrors({});
        setShowDraftModal(false);
    }, [clearStore, setFormData, setCurrentStep, brokerId, residenceType, transactionType]);

    const handleContinueDraft = () => {
        setShowDraftModal(false)
    }



    // ── Effects ───────────────────────────────────────

    useEffect(() => {
        if(isMounted && !isLoading){
            if(!user){
                toast.info("Please Login to Publish a Property")
                router.push("/login")
            }
        }
    },[user, isLoading, isMounted, router])

    // Read sessionStorage on mount (SSR safe)
    useEffect(() => {
        const rt = sessionStorage.getItem("residenceType");
        const tt = sessionStorage.getItem("transactionType");
        if (rt) setResidenceType(rt);
        if (tt) {
            setTransactionType(tt);
            setFormData((prev) => ({ ...prev, transactionTag: tt, residenceType: rt || prev.residenceType }));
        }
    }, [setFormData]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowProjectDropdown(false);
                setShowLocationDropdown(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Project Search ────────────────────────────────

    const handleProjectSearch = async (val: string) => {
        setProjectQuery(val);
        setFormData((prev: BrokerPropertyFormData) => ({ ...prev, name: val, linkedProjectId: "" }));
        setErrors((prev: Record<string, string>) => ({ ...prev, name: "" }));

        if (!val.trim()) {
            setProjectSuggestions([]);
            setShowProjectDropdown(false);
            return;
        }

        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            try {
                const results = await ProjectService.fetchProjectsBySearch({ search: val });
                // results is an array of project objects → map to { name, id }
                const mapped = (results || []).map((p: {name?: string, id: string}) => ({ name: p.name || "", id: p.id }));
                setProjectSuggestions(mapped);
                setShowProjectDropdown(mapped.length > 0);
            } catch (err) {
                console.error("Project search failed", err);
                setProjectSuggestions([]);
            }
        }, 400);
    };

    const handleSelectProject = (suggestion: {name: string, id: string}) => {
        setProjectQuery(suggestion.name);
        setFormData((prev: BrokerPropertyFormData) => ({
            ...prev,
            name: suggestion.name,
            linkedProjectId: suggestion.id,
        }));
        setShowProjectDropdown(false);
    };

    // ── Location Search ───────────────────────────────

    const handleLocationSearch = async (search: string) => {
        setLocationQuery(search);
        setErrors((prev: Record<string, string>) => ({ ...prev, locationId: "" }));

        if (!search.trim()) {
            setFormData((prev: BrokerPropertyFormData) => ({ ...prev, locationId: null }));
            setLocationSuggestions([]);
            setShowLocationDropdown(false);
            return;
        }

        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            try {
                const results = await LocationService.fetchLocation({
                    search,
                    cityId: (formData as any).cityId,
                });
                // results is an array of location objects → map to { label, value }
                const mapped = (results || []).map((loc: any) => ({
                    label: loc.name || loc.actual_Location || "",
                    value: String(loc.id),
                }));
                setLocationSuggestions(mapped);
                setShowLocationDropdown(mapped.length > 0);
            } catch (err) {
                console.error("Location search failed", err);
                setLocationSuggestions([]);
            }
        }, 400);
    };

    const handleSelectLocation = (suggestion: {label: string, value: string}) => {
        setLocationQuery(suggestion.label);
        setFormData((prev: BrokerPropertyFormData) => ({ ...prev, locationId: suggestion.value }));
        setShowLocationDropdown(false);
    };

    // ── Field change handler ──────────────────────────

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
        const { name, value } = e.target;
        setErrors((prev: Record<string, string>) => ({ ...prev, [name]: "" }));

        // Project name → delegate to handleProjectSearch, but we need it here too
        // (FormRenderer calls handleChange for project-search via synthetic event)
        if (name === "name") {
            handleProjectSearch(value);
            return;
        }

        // City change → reset location search
        if (name === "cityId") {
            setLocationQuery("");
            setLocationSuggestions([]);
            setShowLocationDropdown(false);
            setFormData((prev: BrokerPropertyFormData) => ({ ...prev, cityId: value, locationId: null }));
            return;
        }

        // Unit-level fields
        if (UNIT_FIELDS.includes(name)) {
            setFormData((prev: BrokerPropertyFormData) => ({
                ...prev,
                units: [{ ...prev.units[0], [name]: value }],
            }));
            return;
        }

        // Everything else
        setFormData((prev: BrokerPropertyFormData) => ({ ...prev, [name]: value }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Map save ──────────────────────────────────────

    const handleMapSave = (coords: {lat: number | null, lng: number | null}) => {
        setFormData((prev: BrokerPropertyFormData) => ({ ...prev, coordinates: coords }));
    };

    // ── Media upload ──────────────────────────────────
    const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

    const handleUpload = async (fieldName: string, multiple: boolean, files: FileList | null) => {
        const mapTitle: Record<string, string> = {
            exterior_view_images_URL: "banner",
            others_images: "other",
            video_URL: "video",
        };

        const title = mapTitle[fieldName] || "other";
        const fileType = title === "video" ? "video" : "image";

        // Only one banner allowed
        if (title === "banner" && formData.medias.some((m: {title: string}) => m.title === "banner")) {
            toast.warn("Only one banner image is allowed.");
            return;
        }

        if (!files || files.length === 0) return;
        try {
            setUploadingCategory(fieldName);
            const uploaded = await uploadFiles({
                files: Array.from(files),
                directory: "Property",
                fileType,
            });
            if (!uploaded || uploaded.length === 0) return;

            const newItems = uploaded.map((item: {url: string}) => ({
                url: item.url,
                type: fileType,
                title,
                alt: "",
            }));

            setFormData((prev: any) => ({
                ...prev,
                medias: [...prev.medias, ...newItems],
            }));
        } catch (err) {
            toast.error("File upload failed.");
            console.error(err);
        } finally {
            setUploadingCategory(null);
        }
    };

    const handleRemoveMedia = (index: number) => {
        setFormData((prev: BrokerPropertyFormData) => ({ ...prev, medias: prev.medias.filter((_, i: number) => i !== index) }));
    };

    const handleMediaMetaChange = (index: number, key: string, value: string) => {
        setFormData((prev: BrokerPropertyFormData) => {
            const updated = [...prev.medias];
            updated[index] = { ...updated[index], [key]: value };
            return { ...prev, medias: updated };
        });
    };

    // ── Floor plans ───────────────────────────────────

    const [isUploadingFloorPlans, setIsUploadingFloorPlans] = useState(false);

    const handleFloorPlan = async (unitIndex: number, files: FileList | null) => {
        if (!files || files.length === 0) return;
        try {
            setIsUploadingFloorPlans(true);
            // uploadFiles returns a flat array: [{ url, type, title, alt }]
            const uploaded = await uploadFiles({
                files: Array.from(files).filter((f: File) => f.type.startsWith("image/")),
                directory: "FloorPlan",
                fileType: "image",
            });
            if (!uploaded || uploaded.length === 0) return;

            const plans = uploaded.map((item: {url: string}) => ({
                url: item.url,
                type: "image",
                title: "floorPlan",
                alt: "",
                unit: "", // Default to empty string for unit Type
            }));

            setFormData((prev: BrokerPropertyFormData) => {
                const units = [...prev.units];
                if (!units[unitIndex]) units[unitIndex] = { floorPlans: [] };
                units[unitIndex] = {
                    ...units[unitIndex],
                    floorPlans: [...(units[unitIndex].floorPlans || []), ...plans],
                };
                return { ...prev, units };
            });
        } catch (err) {
            toast.error("Floor plan upload failed.");
            console.error(err);
        } finally {
            setIsUploadingFloorPlans(false);
        }
    };

    const handleRemoveFloorPlan = (unitIndex: number, imageIndex: number) => {
        setFormData((prev: BrokerPropertyFormData) => {
            const units = [...prev.units];
            units[unitIndex].floorPlans = units[unitIndex].floorPlans.filter((_, i: number) => i !== imageIndex);
            return { ...prev, units };
        });
    };

    const handleFloorPlanAltChange = (unitIndex: number, imageIndex: number, value: string) => {
        setFormData((prev: BrokerPropertyFormData) => {
            const units = [...prev.units];
            units[unitIndex].floorPlans[imageIndex] = {
                ...units[unitIndex].floorPlans[imageIndex],
                alt: value,
            };
            return { ...prev, units };
        });
    };

    const handleFloorPlanUnitChange = (unitIndex: number, imageIndex: number, value: string) => {
        setFormData((prev: BrokerPropertyFormData) => {
            const units = [...prev.units];
            units[unitIndex].floorPlans[imageIndex] = {
                ...units[unitIndex].floorPlans[imageIndex],
                unit: value,
            };
            return { ...prev, units };
        });
    };

    // ── Validation ────────────────────────────────────

    const getStepErrors = () => {
        const fields = inputFields[currentStep] || [];
        const newErrors: Record<string, string> = {};
        fields.forEach(({ name, label, required }: {name: string, label: string, required?: boolean}) => {
            if (!required) return;
            const value = UNIT_FIELDS.includes(name)
                ? formData?.units?.[0]?.[name]
                : formData?.[name];
            if (!value || (typeof value === "string" && !value.trim())) {
                newErrors[name] = `${label} is required`;
            }
        });
        // Special: locationId comes from dropdown, not a named input
        const locationField = (inputFields[currentStep] || []).find((f: {name: string, required?: boolean}) => f.name === "locationId");
        if (locationField?.required && !formData.locationId) {
            newErrors.locationId = "Area / Location is required";
        }
        return newErrors;
    };

    const validateStep = () => {
        const errs = getStepErrors();
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const isStepValid = () => {
        const errs = getStepErrors();
        return Object.keys(errs).length === 0;
    };


    const handleNext = () => { if (validateStep()) setCurrentStep((s) => s + 1); };
    const handlePrevious = () => setCurrentStep((s) => s - 1);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep()) return;
        // if (!formData.brokerId) { toast.error("Broker ID is required!"); return; }

        const unLabeled = formData.medias.find((m: {alt?: string}) => !m.alt?.trim());
        if (unLabeled) { toast.error("Please provide a label for all uploaded media."); return; }

        const { type } = formData;
        const bedrooms = formData?.units?.[0]?.bedrooms;
        const commonBathrooms = formData?.units?.[0]?.commonBathrooms;

        const payload = {
            ...formData,
            units: (() => {
                const units = [...(formData.units || [{}])];
                const unit = { ...units[0] };
                if (["apartment", "villa", "residentialhouse"].includes(String(type || "").toLowerCase())) {
                    unit.type = determineUnitType(bedrooms || 0, commonBathrooms || 0);
                }
                units[0] = unit;
                return units;
            })(),
        };

        try {
            const res = await JUSTFLIP.post("/project", payload);
            toast.success(res?.data?.message || "Property uploaded successfully!");
            setFormData(buildInitialFormData(brokerId, residenceType, transactionType));
            setProjectQuery("");
            setLocationQuery("");
            setCurrentStep(1);
            clearStore();
            router.push('/profile');
        } catch (err: any) {
            console.error("Submit failed:", err);
            toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    // ── UI Metadata ───────────────────────────────────

    const STEP_TITLES: Record<number, {title: string, subtitle: string}> = {
        1: { title: "Basic Details", subtitle: "Set property type, location and project name." },
        2: { title: "Property Specifications", subtitle: "Describe the size, rooms, and features." },
        3: { title: "Pricing & Map", subtitle: "Set the expected price and pin the property on the map." },
        4: { title: "Photos & Videos", subtitle: "Add high-quality visuals to attract buyers." },
    };

    // ─── Render ───────────────────────────────────────

    if (!isMounted || !hydrated) return null; // Avoid hydration mismatch

    return (
        <div className="py-4 md:py-8 min-h-screen w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
            {showDraftModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center app-overlay p-4">
                    <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 border border-slate-100 relative overflow-hidden animate-modal">
                        {/* Accent Bar matching form header */}
                        <div className="absolute top-0 left-0 w-full h-1.5" />
                        
                        <div className="space-y-2 pt-2">
                            <h3 className="text-xl md:text-2xl font-extrabold text-[#002B5B] tracking-tight">
                                Continue Previous Draft?
                            </h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                You left off at <strong className="text-[#002B5B]">Step {currentStep}: {STEP_TITLES[currentStep]?.title}</strong>. 
                                Would you like to resume your saved progress or start fresh?
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleStartFresh}
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold border border-[#002B5B] text-[#002B5B] rounded-xl hover:bg-slate-50 transition-all duration-200"
                            >
                                Start Fresh
                            </button>
                            <button
                                type="button"
                                onClick={handleContinueDraft}
                                className="w-full sm:w-auto px-5 py-2.5 text-sm font-bold bg-[#002B5B] text-white rounded-xl hover:bg-[#001D3D] transition-all duration-200 shadow-lg shadow-blue-900/20"
                            >
                                Continue Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Breadcrumb */}
            <div className="mb-4 md:mb-6">
                <Breadcrumb items={[{ label: 'Upload Property' }]} />
            </div>

            <div className="flex flex-col lg:flex-row justify-between gap-6 items-start" ref={dropdownRef}>
                
                {/* Left Sidebar */}
                <div className="hidden md:flex flex-col gap-6">
                    <BrokerPropertySidebarStepper currentStep={currentStep} />
                </div>
                <div className="block md:hidden w-full">
                    <PublishPropertySidebar />
                </div>

                {/* Main Form Container */}
                <div className="w-full lg:w-auto flex-1 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8 relative overflow-hidden">
                    {/* Decorative Top Accent */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#002B5B] via-[#057748] to-[#002B5B]" />
                    
                    <div className="border-b border-slate-100/60 pb-3 space-y-3 mt-0">
                        <div>
                            <h2 className="text-[22px] md:text-[28px] font-extrabold text-[#002B5B] tracking-tight">
                                {STEP_TITLES[currentStep]?.title}
                            </h2>
                            <p className="text-[14px] md:text-[15px] font-medium text-slate-500 mt-1">
                                {STEP_TITLES[currentStep]?.subtitle}
                            </p>
                        </div>
                        <div className="block md:hidden">
                            <BrokerPropertyStepper currentStep={currentStep} />
                        </div>
                    </div>

                    {currentStep !== 4 && (
                        <BrokerPropertyFormRenderer
                            fields={inputFields[currentStep] || []}
                            formData={formData}
                            errors={errors}
                            handleChange={handleChange}
                            openMap={() => setIsMapOpen(true)}
                            // Project search
                            projectSuggestions={projectSuggestions}
                            showProjectDropdown={showProjectDropdown}
                            setShowProjectDropdown={setShowProjectDropdown}
                            onSelectProject={handleSelectProject}
                            onProjectSearch={handleProjectSearch}
                            projectQuery={projectQuery}
                            // Location search
                            locationSuggestions={locationSuggestions}
                            showLocationDropdown={showLocationDropdown}
                            setShowLocationDropdown={setShowLocationDropdown}
                            onLocationSearch={handleLocationSearch}
                            onSelectLocation={handleSelectLocation}
                            locationQuery={locationQuery}
                        />
                    )}

                    {currentStep === 4 && (
                        <BrokerPropertyMedia
                            formData={formData}
                            handleUpload={handleUpload}
                            handleRemoveMedia={handleRemoveMedia}
                            handleMediaMetaChange={handleMediaMetaChange}
                            handleFloorPlan={handleFloorPlan}
                            handleRemoveFloorPlan={handleRemoveFloorPlan}
                            handleFloorPlanAltChange={handleFloorPlanAltChange}
                            handleFloorPlanUnitChange={handleFloorPlanUnitChange}
                            isUploadingFloorPlans={isUploadingFloorPlans}
                            uploadingCategory={uploadingCategory}
                        />
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-4 mt-auto pt-4 border-t border-slate-100">
                        <div>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="h-11 px-6 flex items-center gap-2 text-sm font-bold border border-[#002B5B] text-[#002B5B] rounded-xl hover:bg-[#002B5B] hover:text-white transition-all duration-300"
                                >
                                    <IoIosArrowBack /> Previous
                                </button>
                            )}
                        </div>
                        <div>
                            {currentStep < 4 && (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!isStepValid()}
                                    className="h-11 px-6 flex items-center gap-2 text-sm font-bold bg-[#002B5B] text-white rounded-xl hover:bg-[#001D3D] transition-all duration-300 shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next <IoIosArrowForward />
                                </button>
                            )}
                            {currentStep === 4 && (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={isUploading}
                                    className="h-11 px-6 flex items-center gap-2 text-sm font-bold bg-[#057748] text-white rounded-xl hover:bg-[#04633c] transition-all duration-300 shadow-lg shadow-green-900/20 disabled:opacity-60"
                                >
                                    {isUploading ? "Uploading…" : <><VscGitStashApply size={16} /> Submit Property</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <BrokerPropertyMap
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                coordinates={formData?.coordinates}
                onSave={handleMapSave}
            />
        </div>
    );
}

export default BrokerPropertyClient;