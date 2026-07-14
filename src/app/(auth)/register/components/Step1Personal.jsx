"use client";

export default function Step1Personal({ formData, handleChange, errors }) {
  return (
    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-x-6 gap-y-5 animate-in fade-in duration-300">
      <div>
        <label className="font-semibold text-gray-700 mb-1.5 block">Your Name <span className="text-red-500">*</span></label>
        <input
          name="name"
          type="text"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter Name"
          value={formData?.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="font-semibold text-gray-700 mb-1.5 block">Phone Number <span className="text-red-500">*</span></label>
        <input
          name="phone"
          type="number"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter Number"
          value={formData?.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="font-semibold text-gray-700 mb-1.5 block">Email Id <span className="text-red-500">*</span></label>
        <input
          name="email"
          type="text"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter email"
          value={formData?.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="font-semibold text-gray-700 mb-1.5 block">Password <span className="text-red-500">*</span></label>
        <input
          name="password"
          type="password"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter password"
          value={formData?.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="font-semibold text-gray-700 mb-1.5 block">Alternate Phone Number <span className="text-red-500">*</span></label>
        <input
          name="alternatePhone"
          type="number"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter Number"
          value={formData?.alternatePhone}
          onChange={handleChange}
        />
        {errors.alternatePhone && <p className="text-red-500 text-xs mt-1">{errors.alternatePhone}</p>}
      </div>

      <div>
        <label className="font-semibold text-gray-700 mb-1.5 block">Pin code <span className="text-red-500">*</span></label>
        <input
          name="pincode"
          type="number"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Write Your Pin code"
          value={formData?.pincode}
          onChange={handleChange}
        />
        {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
      </div>

      <div className="col-span-1 lg:col-span-2">
        <label className="font-semibold text-gray-700 mb-1.5 block">Home Address <span className="text-red-500">*</span></label>
        <textarea
          name="address"
          rows={4}
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Write Your Home Address"
          value={formData?.address}
          onChange={handleChange}
        />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>
    </div>
  );
}
