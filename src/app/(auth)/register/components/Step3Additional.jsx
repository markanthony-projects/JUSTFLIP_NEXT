"use client";

import DragDropImageUpload from "./DragDropImageUpload";

export default function Step3Additional({
  formData,
  errors,
  handleChange,
  handleChangeimage,
  handleExpertiseCheckboxChange,
}) {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <DragDropImageUpload 
        label="Profile Photo" 
        name="profilePhoto" 
        value={formData.profilePhoto} 
        onChange={handleChangeimage} 
        required
        error={errors.profilePhoto}
      />
      
      <DragDropImageUpload 
        label="Office Image" 
        name="officePhoto" 
        value={formData.officePhoto} 
        onChange={handleChangeimage} 
        required
        error={errors.officePhoto}
      />

      <DragDropImageUpload 
        label="Logo" 
        name="companyLogo" 
        value={formData.companyLogo} 
        onChange={handleChangeimage} 
        required
        error={errors.companyLogo}
      />

      <div className="grid col-span-1 md:col-span-1 w-full">
        <label className="font-semibold text-gray-700 block">
          Area of Expertise <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-5">
          <label className="flex items-center font-medium cursor-pointer">
            <input type="checkbox" name="expertiesIn" value="Rent" checked={formData.expertiesIn?.includes("Rent")} onChange={handleExpertiseCheckboxChange} className="mr-2 accent-[#002b5b]" /> Rent
          </label>
          <label className="flex items-center font-medium cursor-pointer">
            <input type="checkbox" name="expertiesIn" value="Sale" checked={formData.expertiesIn?.includes("Sale")} onChange={handleExpertiseCheckboxChange} className="mr-2 accent-[#002b5b]" /> Sale
          </label>
          <label className="flex items-center font-medium cursor-pointer">
            <input type="checkbox" name="expertiesIn" value="Re-sale" checked={formData.expertiesIn?.includes("Re-sale")} onChange={handleExpertiseCheckboxChange} className="mr-2 accent-[#002b5b]" /> Re-sale
          </label>
        </div>
        {errors.expertiesIn && <p className="text-red-500 text-xs mt-1">{errors.expertiesIn}</p>}
      </div>

      <div className="col-span-1 lg:col-span-2 grid">
        <label className="font-semibold text-gray-700 mb-1.5 block">Mission and Vision <span className="text-red-500">*</span></label>
        <textarea
          name="missionAndVision"
          rows={5}
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter About Mission and Vision"
          value={formData.missionAndVision}
          onChange={handleChange}
        />
        {errors.missionAndVision && <p className="text-red-500 text-xs mt-1">{errors.missionAndVision}</p>}
      </div>
    </div>
  );
}
