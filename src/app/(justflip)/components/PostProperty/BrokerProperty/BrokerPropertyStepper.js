import React from 'react';
import { FaCheck } from 'react-icons/fa';

const STEPS = [
    { id: 1, label: "Basic Details" },
    { id: 2, label: "Property Details" },
    { id: 3, label: "Other Details" },
    { id: 4, label: "Files" },
];

const BrokerPropertyStepper = ({ currentStep }) => {
    return (
        <div className="relative w-full pb-0 pt-2">
            {/* Step circles + connectors */}
            <div className="flex items-center w-full pb-2">
                {STEPS.map((step, index) => (
                    <React.Fragment key={step.id}>
                        <div className={`flex items-center ${index < STEPS.length - 1 ? "w-full" : ""}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white transition-all duration-500 ease-in-out z-10 ${
                                currentStep >= step.id ? "bg-[#002B5B] shadow-lg shadow-blue-900/20" : "bg-slate-200"
                            }`}>
                                {currentStep > step.id ? (
                                    <FaCheck className="w-3 h-3" />
                                ) : (
                                    <span className={`text-sm font-bold ${currentStep >= step.id ? "text-white" : "text-slate-400"}`}>
                                        {step.id}
                                    </span>
                                )}
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={`flex-1 h-[2px] transition-all duration-500 ease-in-out ${
                                    currentStep > step.id ? "bg-[#002B5B]" : "bg-slate-200"
                                }`} />
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>
            {/* Step labels */}
            <div className="flex items-center justify-between text-[11px] font-bold text-[#002B5B] w-full px-1">
                {STEPS.map((step) => (
                    <span
                        key={step.id}
                        className={`transition-all duration-300 ${currentStep >= step.id ? "opacity-100" : "opacity-40"}`}
                    >
                        {step.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default BrokerPropertyStepper;
