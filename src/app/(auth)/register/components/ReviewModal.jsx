"use client";

import React from "react";
import { HiX } from "react-icons/hi";

const ReviewModal = ({ formData, isOpen, onClose, onSubmit, error }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#002b5b]">Review Registration Data</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <HiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Personal Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs">
                            <p><span className="text-gray-500">Name:</span> {formData.name}</p>
                            <p><span className="text-gray-500">Email:</span> {formData.email}</p>
                            <p><span className="text-gray-500">Phone:</span> {formData.phone}</p>
                            <p><span className="text-gray-500">Alt Phone:</span> {formData.alternatePhone || "N/A"}</p>
                            <p className="col-span-1 sm:col-span-2"><span className="text-gray-500">Address:</span> {formData.address}</p>
                            <p><span className="text-gray-500">Pincode:</span> {formData.pincode}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Professional & Firm</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs">
                            <p><span className="text-gray-500">Company Name:</span> {formData.companyName}</p>
                            <p><span className="text-gray-500">Ownership:</span> {formData.companyOwnership}</p>
                            <p className="col-span-1 sm:col-span-2"><span className="text-gray-500">Company Address:</span> {formData.companyAddress}</p>
                            <p><span className="text-gray-500">RERA Number:</span> {formData.rera || "Not Provided"}</p>
                            <p><span className="text-gray-500">Experience (Started):</span> {formData.startedAt}</p>
                            <p><span className="text-gray-500">Team Size:</span> {formData.teamSize}</p>
                            <p><span className="text-gray-500">Avg Annual Income:</span> {formData.annualIncome}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b pb-1">Expertise & Values</h3>
                        <div className="text-xs space-y-2">
                            <p><span className="text-gray-500">Expertise:</span> {formData.expertiesIn?.filter(e => e).join(", ") || "None"}</p>
                            <p><span className="text-gray-500">Mission & Vision:</span> {formData.missionAndVision}</p>
                            <p><span className="text-gray-500">About Company:</span> {formData.companyDescription}</p>
                        </div>
                    </div>

                </div>

                {error && (
                    <div className="px-5 py-3 bg-red-50 border-t border-red-100 flex items-center text-red-600 text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 flex flex-col-reverse sm:flex-row justify-end gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="py-2.5 px-5 text-sm font-semibold rounded-lg text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        className="py-2.5 px-6 text-sm font-semibold rounded-lg text-white bg-[#002B5B] hover:bg-[#003b7b] transition active:scale-95"
                    >
                        Confirm & Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
