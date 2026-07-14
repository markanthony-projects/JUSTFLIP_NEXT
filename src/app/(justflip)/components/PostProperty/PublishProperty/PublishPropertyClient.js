"use client";

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFileUpload } from '@/src/hooks/useFileUpload';
import LocationService from '@/src/services/LocationService';
import { JUSTFLIP } from '@/src/lib/axios/api';
import { useAuthStore } from '@/src/stores/auth.store';
import { toast } from '@/src/utils/toast';

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { VscGitStashApply } from 'react-icons/vsc';
import PublishPropertyStepper from './PublishPropertyStepper';
import PublishPropertySidebar from './PublishPropertySidebar';
import dynamic from 'next/dynamic';

const BrokerPropertyMap = dynamic(() => import('../BrokerProperty/BrokerPropertyMap'), { ssr: false });
import PublishPropertyMedia from './PublishPropertyMedia';
import { furnishOptions, propertyOptions, facingOptions, transactionTagsOptions, numberOptions, possessionStatusOptions, yesNoOptions, inputClass } from './constants';
import { CgLayoutGrid } from 'react-icons/cg';
import SearchDropdown from '@/src/components/atoms/SearchableDropdown';
import CustomSelect from '@/src/components/atoms/CustomSelector';
import * as ProjectService from '@/src/services/ProjectService';
import { FiMapPin } from 'react-icons/fi';

function PublishPropertyClient({ initialCities }) {
  const router = useRouter();

  const determineUnitType = (bedrooms, commonBathrooms) => {
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
  const { uploadFiles, loading: isUploading } = useFileUpload();
  const { user, authType } = useAuthStore();
  const suggestionRef = useRef(null);
  const searchTimeout = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState({});
  const [residenceType, setResidenceType] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [projectSuggestions, setProjectSuggestions] = useState([]);
  const [showProjectSuggestions, setShowProjectSuggestions] = useState(false);

  useEffect(() => {
    setResidenceType(sessionStorage.getItem("residenceType") || "residential");
    setTransactionType(sessionStorage.getItem("transactionType") || "sale");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowProjectSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [formData, setFormData] = useState({
    residenceType: "",
    ownerId: user?.id,
    uploadedBy: user?.id,
    type: "apartment",
    transactionTag: "",
    name: "",
    subLocality: "",
    address: "",
    cityId: null,
    locationId: null,
    possessionStatus: "",
    medias: [],
    coordinates: { lat: null, lng: null },
    units: [{
      floorPlans: [],
      currency: "INR",
      bedrooms: 1,
      commonBathrooms: 1,
      furnishing: "Unfurnished",
      type: "",
    }],
  });

  useEffect(() => {
    if (residenceType) setFormData(prev => ({ ...prev, residenceType: residenceType.toLowerCase(), transactionTag: transactionType.toLowerCase() }));
  }, [residenceType, transactionType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const unitFields = ["furnishing", "interiorArea", "exteriorArea", "facing", "bedrooms", "balconies", "commonBathrooms", "attachedBathrooms", "flatsCount"];

    if (unitFields.includes(name)) {
      setFormData(prev => {
        const newUnits = [...prev.units];
        newUnits[0] = { ...newUnits[0], [name]: value };
        return { ...prev, units: newUnits };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === "locationSearch") {
      handleLocationSearch(value);
    }

    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };


  const handleLocationSearch = async (search) => {
    setLocationSearch(search);
    if (!search) {
      setFormData(prev => ({ ...prev, locationId: null }));
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      if (search.length > 0) {
        try {
          const suggestions = await LocationService.fetchLocation({ search, cityId: formData.cityId });
          setLocationSuggestions(suggestions);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Location search failed", err);
        }
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);
  };

  const handleProjectSearch = async (val) => {
    setFormData(prev => ({ ...prev, name: val }));
    if (!val) {
      setProjectSuggestions([]);
      setShowProjectSuggestions(false);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      if (val.length > 0) {
        try {
          const suggestions = await ProjectService.fetchProjectsBySearch({ search: val });
          setProjectSuggestions(suggestions || []);
          setShowProjectSuggestions(true);
        } catch (err) {
          console.error("Project search failed", err);
        }
      } else {
        setProjectSuggestions([]);
        setShowProjectSuggestions(false);
      }
    }, 500);
  };

  const handleProjectSelect = (project) => {
    setFormData(prev => ({
      ...prev,
      name: project.name,
      locationId: project.locationId || prev.locationId,
      cityId: project.cityId || prev.cityId
    }));


    setShowProjectSuggestions(false);

    if (errors.name) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.name;
        return newErrors;
      });
    }
  };

  const handleSuggestionSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      locationId: location.id
    }));
    setLocationSearch(location.name);
    setShowSuggestions(false);

    if (errors.locationId) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.locationId;
        return newErrors;
      });
    }
  };

  const getFieldValue = (name) => {
    const unitFields = ["furnishing", "interiorArea", "exteriorArea", "facing", "bedrooms", "balconies", "commonBathrooms", "attachedBathrooms", "flatsCount"];
    if (unitFields.includes(name)) return formData.units[0]?.[name] || "";
    return formData[name] || "";
  };

  const [uploadingCategory, setUploadingCategory] = useState(null);

  const handleUpload = async (fieldName, multiple, files) => {
    const mapTitle = {
      exterior_view_images_URL: "banner",
      others_images: "other",
      video_URL: "video",
    };

    const title = mapTitle[fieldName] || "other";
    const type = title === "video" ? "video" : "image";

    try {
      setUploadingCategory(fieldName);
      const uploaded = await uploadFiles({ files, directory: "Property", fileType: type });
      if (!uploaded || uploaded.length === 0) return;

      const uploadedMedias = uploaded.map(item => ({
        ...item,
        title,
        type,
        alt: ""
      }));

      setFormData(prev => ({
        ...prev,
        medias: [...prev.medias, ...uploadedMedias]
      }));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingCategory(null);
    }
  };

  const handleRemoveMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      medias: prev.medias.filter((_, i) => i !== index)
    }));
  };

  const handleMediaMetaChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medias: prev.medias.map((m, i) => i === index ? { ...m, [field]: value } : m)
    }));
  };

  const [isUploadingFloorPlans, setIsUploadingFloorPlans] = useState(false);

  const handleFloorPlan = async (unitIndex, files) => {
    if (!files || files.length === 0) return;
    try {
      setIsUploadingFloorPlans(true);
      const uploaded = await uploadFiles({
        files: Array.from(files).filter((f) => f.type.startsWith("image/")),
        directory: "FloorPlan",
        fileType: "image",
      });
      if (!uploaded || uploaded.length === 0) return;

      const plans = uploaded.map((item) => ({
        url: item.url,
        type: "image",
        title: "floorPlan",
        alt: "",
        unit: "",
      }));

      setFormData((prev) => {
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

  const handleRemoveFloorPlan = (unitIndex, imageIndex) => {
    setFormData((prev) => {
      const units = [...prev.units];
      units[unitIndex].floorPlans = units[unitIndex].floorPlans.filter((_, i) => i !== imageIndex);
      return { ...prev, units };
    });
  };

  const handleFloorPlanAltChange = (unitIndex, imageIndex, value) => {
    setFormData((prev) => {
      const units = [...prev.units];
      units[unitIndex].floorPlans[imageIndex] = {
        ...units[unitIndex].floorPlans[imageIndex],
        alt: value,
      };
      return { ...prev, units };
    });
  };

  const handleFloorPlanUnitChange = (unitIndex, imageIndex, value) => {
    setFormData((prev) => {
      const units = [...prev.units];
      units[unitIndex].floorPlans[imageIndex] = {
        ...units[unitIndex].floorPlans[imageIndex],
        unit: value,
      };
      return { ...prev, units };
    });
  };

  const getStepErrors = () => {
    const stepFields = {
      1: ["type", "transactionTag", "cityId", "locationId", "name"],
      2: ["furnishing", "interiorArea", "facing", "bedrooms"],
      3: ["possessionStatus", "expectedPrice"],
      4: []
    };

    const currentFields = stepFields[currentStep] || [];
    const newErrors = {};

    currentFields.forEach(field => {
      const value = getFieldValue(field);
      if (!value || (typeof value === "string" && !value.trim())) {
        newErrors[field] = "Required";
      }
    });

    return newErrors;
  };

  const validateStep = () => {
    const newErrors = getStepErrors();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = () => {
    const newErrors = getStepErrors();
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    try {
      const bedrooms = formData.units[0]?.bedrooms;
      const commonBathrooms = formData.units[0]?.commonBathrooms;

      const payload = {
        ...formData,
        ownerId: user?.id,
        units: (() => {
          const unit = { ...formData.units[0] };
          if (["apartment", "villa", "residentialhouse"].includes(formData.type?.toLowerCase())) {
            unit.type = determineUnitType(bedrooms, commonBathrooms);
          }
          unit.minPrice = formData.expectedPrice;
          unit.maxPrice = formData.maxPrice;
          unit.exteriorAreas = unit.exteriorArea;
          unit.currency = "INR";
          return [unit];
        })()
      };

      delete payload.expectedPrice;
      delete payload.maxPrice;

      const response = await JUSTFLIP.post('/project', payload);
      toast.success("Property published successfully!");
      router.push('/');
    } catch (error) {
      console.error("Submit failed", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const inputFields = useMemo(() => {
    const commonSteps = {
      1: [
        { name: "type", label: "Property Type", type: "select", options: propertyOptions },
        { name: "transactionTag", label: "Transaction Tag", type: "select", options: transactionTagsOptions },
        { name: "name", label: "Project/Building Name", type: "search-project" },
        { name: "cityId", label: "City", type: "select", options: initialCities?.map(c => ({ label: c.name, value: c.id })) || [] },
        { name: "description", label: "Property Description", type: "textarea" },
        { name: "locationId", label: "Area/Location", type: "search-select" },
      ],
      2: [
        { name: "furnishing", label: "Furnishing Status", type: "select", options: furnishOptions },
        { name: "interiorArea", label: "Carpet Area (sq.ft)", type: "number" },
        { name: "exteriorArea", label: "Super Area (sq.ft)", type: "number" },
        { name: "facing", label: "Facing", type: "select", options: facingOptions },
        { name: "bedrooms", label: "Bedrooms", type: "select", options: numberOptions },
        { name: "commonBathrooms", label: "Bathrooms", type: "select", options: numberOptions },
      ],
      3: [
        { name: "possessionStatus", label: "Possession Status", type: "select", options: possessionStatusOptions },
        { name: "expectedPrice", label: "Min Price (₹)", type: "number" },
        { name: "maxPrice", label: "Max Price (₹)", type: "number" },
        { name: "isNegotiable", label: "Price Negotiable", type: "select", options: yesNoOptions },
        { name: "coordinates", label: "Map Coordinates", type: "map" },
      ]
    };
    return commonSteps;
  }, [initialCities, locationSuggestions]);

  return (
    <div className="py-4 min-h-screen overflow-x-hidden">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex-1 bg-white rounded-xl shadow-2xl shadow-slate-100 border border-gray-300 flex flex-col p-4">
          <div className="border-b border-slate-100 pb-4 space-y-4">
            <div className="">
              <h2 className="text-2xl font-black text-[#002B5B] tracking-tight">
                New {residenceType} Listing
              </h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Complete these fast steps to publish your property on JustFlip.
              </p>
            </div>

            <PublishPropertyStepper currentStep={currentStep} />

          </div>

          <div className=" flex-1">
            {currentStep <= 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputFields[currentStep]?.map((field) => (
                  <div key={field.name} className={`space-y-2 ${field.name === "description" ? "col-span-2" : ""}`}>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                      {field.label}
                    </label>

                    {field.type === "select" ? (
                      <>
                        <CustomSelect
                          options={field?.options}
                          value={getFieldValue(field.name)}
                          onChange={(val) => handleChange({ target: { name: field.name, value: val } })}
                          placeholder="Select Option"
                          inputClass={inputClass}
                          error={errors[field.name]}
                          searchable={true}
                        />
                      </>
                    ) : field.type === "search-project" ? (
                      <SearchDropdown
                        value={formData.name}
                        placeholder="Search Project/Building..."
                        onChange={handleProjectSearch}
                        suggestions={projectSuggestions}
                        onSelect={handleProjectSelect}
                        showSuggestions={showProjectSuggestions}
                        setShowSuggestions={setShowProjectSuggestions}
                        inputClass={inputClass}
                        error={errors[field.name]}
                        displayKey="name"
                        subDisplayKey="subLocality"
                        selected={formData.name}
                      />
                    ) : field.type === "search-select" ? (
                      <SearchDropdown
                        value={locationSearch}
                        placeholder="Search Location..."
                        onChange={handleLocationSearch}
                        suggestions={locationSuggestions}
                        onSelect={(loc) => { handleSuggestionSelect(loc); }}
                        showSuggestions={showSuggestions}
                        setShowSuggestions={setShowSuggestions}
                        inputClass={inputClass}
                        error={errors[field.name]}
                        displayKey="name"
                        subDisplayKey="city"
                        selected={formData.locationId}
                        disabled={!formData.cityId}
                      />
                    ) : field.type === "map" ? (
                      <button
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className={`${inputClass} flex items-center justify-between cursor-pointer hover:border-[#002B5B] hover:bg-blue-50/30 transition-all ${errors?.[field.name] ? "border-rose-400" : ""}`}
                      >
                        <span className="text-slate-500 text-sm">
                          {formData?.coordinates?.lat
                            ? `📍 Latitude: ${Number(formData.coordinates.lat).toFixed(5)}, Longitude: ${Number(formData.coordinates.lng).toFixed(5)}`
                            : "Click to pin location on map"}
                        </span>
                        <FiMapPin className="text-[#002B5B] shrink-0" />
                      </button>
                    ) : field.type === "textarea" ? (
                      <textarea
                        name={field.name}
                        placeholder={field.label}
                        value={getFieldValue(field.name)}
                        onChange={handleChange}
                        className={`${inputClass} resize-none h-24 pt-3 ${errors[field.name] ? "border-rose-400" : ""}`}
                      />

                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.label}
                        value={getFieldValue(field.name)}
                        onChange={handleChange}
                        className={`${inputClass} ${errors[field.name] ? "border-rose-400" : ""}`}
                      />
                    )}
                    {errors[field.name] && <p className="text-[10px] font-bold text-rose-500 px-1">{errors[field.name]}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <PublishPropertyMedia
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
          </div>

          <div className="p-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${currentStep === 1 ? "opacity-30 grayscale cursor-not-allowed" : "text-slate-600 hover:bg-slate-200"
                }`}
            >
              <IoIosArrowBack /> Previous Step
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => isStepValid() && setCurrentStep(prev => prev + 1)}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-8 py-3 bg-[#002B5B] text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-900/10 hover:shadow-blue-900/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Next Step <IoIosArrowForward />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-10 py-3 bg-[#057748] text-white rounded-xl font-bold text-sm shadow-xl shadow-green-900/10 hover:shadow-green-900/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <VscGitStashApply /> Publish Property
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <PublishPropertySidebar />
      </div>



      <BrokerPropertyMap
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        coordinates={formData?.coordinates}
        onSave={(coords) => setFormData(prev => ({ ...prev, coordinates: coords }))}
      />
    </div>
  );
}

export default PublishPropertyClient;