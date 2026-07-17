import React from 'react';
import { FaCheck } from 'react-icons/fa';

const steps = [
        { id: 1, label: "Basic Details" },
        { id: 2, label: "Property Details" },
        { id: 3, label: "Other Details" },
        { id: 4, label: "Files" }
];

const PublishPropertyStepper = ({ currentStep }) => {

    return (
        <div className="relative w-full  hidden sm:block">
            <div className="flex items-center w-full pb-2">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className={`flex items-center ${index < steps.length - 1 ? "w-full" : ""}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white transition-all duration-500 ease-in-out z-10 ${
                                currentStep >= step.id ? "bg-[#0B8019]" : "bg-gray-300"
                            }`}>
                                {currentStep > step.id ? (
                                    <FaCheck className="w-3 h-3" />
                                ) : (
                                    <span className="text-sm font-bold">{step.id}</span>
                                )}
                            </div>
                            
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-[2px] transition-all duration-500 ease-in-out ${
                                    currentStep > step.id ? "bg-[#0B8019]" : "bg-gray-300"
                                }`} />
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>

            <div className="flex items-center justify-between text-[11px] lg:text-xs font-bold text-[#002B5B] w-full px-1">
                {steps.map((step) => (
                    <span 
                        key={step.id} 
                        className={`transition-all duration-300 ${currentStep >= step.id ? "opacity-100" : "opacity-50"}`}
                    >
                        {step.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default PublishPropertyStepper;
