"use client";

import { useState, useRef } from "react";

export default function DragDropImageUpload({ label, name, value, onChange, required, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const event = {
        target: {
          name,
          files: e.dataTransfer.files
        }
      };
      onChange(event);
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label className="font-semibold text-gray-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors h-36 ${
          error ? 'border-red-500 bg-red-50' : isDragging ? 'border-[#002b5b] bg-[#002b5b]/5' : 'border-gray-300 hover:border-[#002b5b] hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input 
          type="file" 
          name={name}
          ref={fileInputRef} 
          onChange={onChange} 
          className="hidden" 
          accept="image/*"
        />
        {value ? (
          <div className="flex flex-col items-center justify-center w-full h-full relative group">
             <img src={value} alt="Preview" className="w-full h-full object-contain rounded-md" />
             <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#002b5b] text-white flex items-center justify-center mb-1 shadow-md">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                   </svg>
                </div>
                <span className=" font-bold text-[#002b5b]">Replace Image</span>
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400 mb-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            <span className="text-xs font-medium text-[#002b5b]">Click to upload or drag and drop</span>
            <span className="text-[10px] text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</span>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
