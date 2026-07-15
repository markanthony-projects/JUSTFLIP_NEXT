"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AUTH, JUSTFLIP } from "@/src/lib/axios/api";
import { FaCheck } from "react-icons/fa";
import ReviewModal from "./ReviewModal";
import SuccessModal from "./SuccessModal";
import Step1Personal from "./Step1Personal";
import Step2Professional from "./Step2Professional";
import Step3Additional from "./Step3Additional";
import { useAuthStore } from "@/src/stores/auth.store";

export default function RegistrationForm() {
  const setSession = useAuthStore((state) => state.setSession);
  const [currentStep, setCurrentStep] = useState(0);
  const [cityId, setCityId] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    alternatePhone: "",
    email: "",
    password: "",
    address: "",
    brokerOperatedCities: [
      {
        cityId: null,
        operatedAreas: [{ locationId: "", name: "" }],
      },
    ],
    pincode: "",
    rera: "",
    teamSize: "",
    companyOwnership: '',
    companyDescription: "",
    startedAt: "",
    companyAddress: "",
    companyName: "",
    profilePhoto: "",
    officePhoto: "",
    annualIncome: "",
    companyLogo: "",
    expertiesIn: [""],
    missionAndVision: "",
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showRERAInput, setShowRERAInput] = useState(false);
  const [reraSelected, setReraSelected] = useState(false);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const router = useRouter();
  
  const steps = ["Personal", "Professional & Firm", "Additional"];

  const [showSuggestionsIndex, setShowSuggestionsIndex] = useState(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);


  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (currentStep === 0) {
      if (!formData.name) { newErrors.name = "Broker Name is required"; valid = false; }
      if (!formData.email) { newErrors.email = "Email ID is required"; valid = false; }
      if (!formData.password) { newErrors.password = "Password is required"; valid = false; }
      if (!formData.phone) { newErrors.phone = "Phone Number is required"; valid = false; }
      if (!formData.alternatePhone) { newErrors.alternatePhone = "Alternate Phone Number is required"; valid = false; }

      const pincodePattern = /^[0-9]{6}$/;
      const pincode = formData.pincode?.toString() || '';
      if (!pincode) {
        newErrors.pincode = "Pin Code is required.";
        valid = false;
      } else if (!pincodePattern.test(pincode)) {
        newErrors.pincode = "Pin Code must be exactly 6 digits.";
        valid = false;
      }

      if (!formData.address) {
        newErrors.address = "Home Address is required";
        valid = false;
      }
    } else if (currentStep === 1) {
      if (!reraSelected) { newErrors.reraSelection = "Please select an option for RERA."; valid = false; }
      if (showRERAInput && !formData.rera) { newErrors.rera = "Please enter the RERA Number."; valid = false; }
      if (!formData.companyDescription) { newErrors.companyDescription = "Brief About You & Your Company is required"; valid = false; }
      if (!formData.companyOwnership) { newErrors.companyOwnership = "Company Ownership is required"; valid = false; }
      if (!formData.brokerOperatedCities?.[0]?.cityId) { newErrors.brokerOperatedCities = "Operation City is required"; valid = false; }
      if (!formData.startedAt) { newErrors.startedAt = "Years of Experience is required"; valid = false; }
      if (!formData?.brokerOperatedCities?.[0]?.operatedAreas?.length) { newErrors.operatedAreas = "Operation Areas are required"; valid = false; }
      if (!formData.teamSize) { newErrors.teamSize = "Team Size is required"; valid = false; }
    } else if (currentStep === 2) {
      if (!formData.missionAndVision) { newErrors.missionAndVision = "Mission And Vision is required"; valid = false; }
      if (!formData.expertiesIn || formData.expertiesIn.length === 0) { newErrors.expertiesIn = "Area of Expertise is required"; valid = false; }
      if (!formData.profilePhoto) { newErrors.profilePhoto = "Profile Photo is required"; valid = false; }
      if (!formData.officePhoto) { newErrors.officePhoto = "Office Image is required"; valid = false; }
      if (!formData.companyLogo) { newErrors.companyLogo = "Logo is required"; valid = false; }
    }

    setErrors(newErrors);
    return valid;
  };


  const handleChange = (e, index = null) => {
    const { name, value, type, checked } = e.target;
    if (name === 'missionAndVision') {
      if (value.length > 500) return; // Prevent exceeding 500 characters
    }
    if (name === "operation_Areas" && index !== null) {
      const values = [...formData.operation_Areas];
      values[index] = value;
      setFormData((prevData) => ({ ...prevData, operation_Areas: values }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleChangeimage = async (e) => {
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    const file = files[0];
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("directory", "BrokerAcccounts");

    try {
      const { data } = await JUSTFLIP.post("/cdn/upload", formDataUpload, { headers: { "Content-Type": "multipart/form-data" } });
      const uploadedUrl = data?.uploaded[0]?.url;
      if (uploadedUrl) {
        setFormData((prevData) => ({ ...prevData, [name]: uploadedUrl }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Upload failed: No URL received");
      }
    } catch (error) {
      toast.error("Error uploading photo");
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await JUSTFLIP.get("/city");
        setCities(response.data.cities);
        setCityId(response.data?.cities?.[0]?.id);
      } catch (error) {}
    };
    fetchCities();
  }, []);

  const handleCitySelect = async (e) => {
    const selectedCityId = e.target.value;
    try {
      const response = await JUSTFLIP.get("/location", { params: { cityId: selectedCityId } });
      setLocations(response.data.locations);
      setFormData((prev) => ({
        ...prev,
        brokerOperatedCities: [
          {
            ...prev.brokerOperatedCities[0],
            cityId: selectedCityId,
            operatedAreas: [{ locationId: "", name: "" }],
          },
        ],
      }));
    } catch (error) {}
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsModalOpen(true);
  };

  const formTopRef = useRef(null);

  const handleNext = () => {
    if (validateForm()) {
      setCurrentStep((prevStep) => prevStep + 1);
      formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  const handleRERARadioChange = (e) => {
    setReraSelected(true);
    if (e.target.value === "yes") {
      setShowRERAInput(true);
    } else {
      setShowRERAInput(false);
      setFormData((prev) => ({ ...prev, rera: "" }));
    }
  };


  const handleExpertiseCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const prevArray = prevData.expertiesIn || [];
      let updatedArray;
      if (checked) updatedArray = [...prevArray, value];
      else updatedArray = prevArray.filter((item) => item !== value);
      return { ...prevData, expertiesIn: updatedArray };
    });
  };


  const handleModalSubmit = async (e) => {
    if(e) e.preventDefault();
    setSubmitError("");
    try {
      const response = await AUTH.post("/portal/broker-register", formData);
      
      // Save session in Zustand
      if (response.data?.token && response.data?.user) {
        setSession(response.data.user, response.data.token, "broker");
      }

      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Something went wrong. Please try again.";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    }
  };


  const handleOperationAreaInput = (e, index) => {
    const inputValue = e.target.value;
    setFormData((prev) => {
      const updatedCities = [...prev.brokerOperatedCities];
      const updatedAreas = [...updatedCities[0].operatedAreas];
      updatedAreas[index] = { ...updatedAreas[index], name: inputValue, locationId: "" };
      updatedCities[0].operatedAreas = updatedAreas;
      return { ...prev, brokerOperatedCities: updatedCities };
    });
    const filtered = locations.filter((loc) => loc.name.toLowerCase().includes(inputValue.toLowerCase()));
    setFilteredSuggestions(filtered);
  };


  const handleSuggestionSelect = (index, selectedLoc) => {
    setFormData((prev) => {
      const updatedCities = [...prev.brokerOperatedCities];
      const updatedAreas = [...updatedCities[0].operatedAreas];
      updatedAreas[index] = { ...updatedAreas[index], locationId: selectedLoc.id, name: selectedLoc.name };
      updatedCities[0].operatedAreas = updatedAreas;
      return { ...prev, brokerOperatedCities: updatedCities };
    });
    setShowSuggestionsIndex(null);
  };


  const handleAddField = () => {
    const updatedCities = [...formData.brokerOperatedCities];
    if (updatedCities[0].operatedAreas?.length < 5) {
      updatedCities[0].operatedAreas.push({ locationId: "", name: "" });
      setFormData((prev) => ({ ...prev, brokerOperatedCities: updatedCities }));
    }
  };

  const handleRemoveField = (index) => {
    const updatedCities = [...formData.brokerOperatedCities];
    updatedCities[0].operatedAreas.splice(index, 1);
    setFormData((prev) => ({ ...prev, brokerOperatedCities: updatedCities }));
  };


  return (
    <div className="py-12 px-4 md:px-12 bg-white flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="md:hidden mb-8 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-3xl font-bold text-[#002B5B] mb-2">Sign Up as Broker</h1>
          <p className="text-sm font-medium text-gray-500">
            Already registered? Please{" "}
            <Link href="/login" className="text-[#0B8019] underline font-semibold hover:text-green-700">
              login
            </Link>{" "}
            here.
          </p>            
        </div>
        <div className="w-full flex justify-between relative px-4 md:px-12 scroll-mt-10" ref={formTopRef}>
          
          {/* Background thin line for stepper */}
          <div className="absolute top-[17px] left-[10%] right-[10%] h-[2px] bg-[#D9D9D9] z-0" />
          <div className="absolute top-[17px] left-[10%] right-[10%] h-[2px] z-0 flex">
              <div className={`h-full bg-[#0B8019] transition-all duration-500 ${currentStep === 0 ? 'w-0' : currentStep === 1 ? 'w-1/2' : 'w-full'}`} />
          </div>

          {steps.map((label, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center text-center bg-white z-10 px-2 relative">
                <div 
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${isCompleted 
                    ? "bg-[#0B8019] text-white" 
                    : isActive 
                      ? "bg-[#D9D9D9] border-2 border-[#0B8019] text-[#002B5B]"
                      : "bg-[#D9D9D9] text-[#002B5B]"
                  }`}
                >
                  {isCompleted ? <FaCheck className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-xs lg:text-lg mt-3 font-medium transition-colors duration-300 text-[#002B5B]`}>
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        <form className="mt-12 rounded-xl p-6 md:p-8 border border-gray-100 bg-white shadow-[0_4px_24px_rgb(0,0,0,0.03)] w-full">
          {currentStep === 0 && (
            <Step1Personal 
              formData={formData} 
              handleChange={handleChange} 
              errors={errors} 
            />
          )}
          
          {currentStep === 1 && (
            <Step2Professional 
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleRERARadioChange={handleRERARadioChange}
              showRERAInput={showRERAInput}
              handleCitySelect={handleCitySelect}
              cities={cities}
              handleAddField={handleAddField}
              handleOperationAreaInput={handleOperationAreaInput}
              showSuggestionsIndex={showSuggestionsIndex}
              setShowSuggestionsIndex={setShowSuggestionsIndex}
              filteredSuggestions={filteredSuggestions}
              handleSuggestionSelect={handleSuggestionSelect}
              handleRemoveField={handleRemoveField}
            />
          )}

          {currentStep === 2 && (
            <Step3Additional 
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleChangeimage={handleChangeimage}
              handleExpertiseCheckboxChange={handleExpertiseCheckboxChange}
            />
          )}

          <div className="flex justify-end mt-10 gap-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="py-2.5 px-8 text-sm font-bold rounded-md text-[#0B2046] border border-[#0B2046] hover:bg-gray-50 transition active:scale-95 outline-none"
              >
                Previous
              </button>
            )}
            
            {currentStep < steps.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-8 text-sm font-bold rounded-md text-white bg-[#0B2046] hover:bg-[#081733] transition active:scale-95 outline-none"
              >
                Next
              </button>
            )}

            {currentStep === 2 && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="py-2.5 px-8 text-sm flex justify-center items-center font-bold rounded-md text-white bg-[#0B2046] hover:bg-[#081733] transition active:scale-95 outline-none"
              >
                Review Data
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {isModalOpen && (
          <ReviewModal 
            isOpen={isModalOpen} 
            onClose={() => { setIsModalOpen(false); setSubmitError(""); }} 
            formData={formData} 
            onSubmit={handleModalSubmit}
            error={submitError}
          />
        )}

        <SuccessModal isOpen={isSuccessModalOpen} />
      </div>
    </div>
  );
}
