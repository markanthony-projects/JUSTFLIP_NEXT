"use client";

export default function Step2Professional({
  formData,
  errors,
  handleChange,
  handleRERARadioChange,
  showRERAInput,
  handleCitySelect,
  cities,
  handleAddField,
  handleOperationAreaInput,
  showSuggestionsIndex,
  setShowSuggestionsIndex,
  filteredSuggestions,
  handleSuggestionSelect,
  handleRemoveField,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid col-span-1 md:col-span-1 w-full">
        <label className="text- font-semibold text-gray-700 mb-2 block">
          Do you have a RERA no? <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center mb-1">
          <label className="flex items-center font-medium mr-4 cursor-pointer">
            <input
              type="radio"
              name="hasRERA"
              value="yes"
              className="mr-2 accent-[#002b5b]"
              onChange={handleRERARadioChange}
            />
            Yes
          </label>
          <label className="flex items-center font-medium cursor-pointer">
            <input
              type="radio"
              name="hasRERA"
              value="no"
              className="mr-2 accent-[#002b5b]"
              onChange={handleRERARadioChange}
            />
            No
          </label>
        </div>
        {errors.reraSelection && <p className="text-red-500 text-xs mt-1">{errors.reraSelection}</p>}

        {showRERAInput && (
          <div className="animate-in fade-in slide-in-from-top-2 mt-3">
            <input
              name="rera"
              type="text"
              className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
              placeholder="Enter RERA Number *"
              value={formData.rera}
              onChange={handleChange}
            />
            {errors.rera && <p className="text-red-500 text-xs mt-1">{errors.rera}</p>}
          </div>
        )}
      </div>

      <div className="grid col-span-1 md:col-span-1">
        <label className="font-semibold text-gray-700 mb-1.5 block">Registered Company Name</label>
        <input
          name="companyName"
          type="text"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter Registered company Name"
          value={formData.companyName}
          onChange={handleChange}
        />
        {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
      </div>

      <div className="grid col-span-1 md:col-span-1 w-full">
        <label className="font-semibold text-gray-700 mb-1.5 block">Company Address</label>
        <input
          name="companyAddress"
          type="text"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter Company Address"
          value={formData.companyAddress}
          onChange={handleChange}
        />
        {errors.companyAddress && <p className="text-red-500 text-xs mt-1">{errors.companyAddress}</p>}
      </div>

      <div className="grid col-span-1 md:col-span-1 w-full">
        <label className="font-semibold text-gray-700 mb-1.5 block">Years Of Experience (Since) <span className="text-red-500">*</span></label>
        <input
          name="startedAt"
          type="date"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400 text-gray-700"
          value={formData.startedAt}
          onChange={handleChange}
        />
        {errors.startedAt && <p className="text-red-500 text-xs mt-1">{errors.startedAt}</p>}
      </div>

      <div className="grid col-span-1 md:col-span-1 w-full">
        <label className="font-semibold text-gray-700 mb-1.5 block">Team Size <span className="text-red-500">*</span></label>
        <input
          name="teamSize"
          type="number"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter Team Size"
          value={formData.teamSize}
          onChange={handleChange}
        />
        {errors.teamSize && <p className="text-red-500 text-xs mt-1">{errors.teamSize}</p>}
      </div>

      <div className="grid col-span-1 md:col-span-1 w-full">
        <label className="font-semibold text-gray-700 mb-1.5 block">Average Annual Income</label>
        <input
          name="annualIncome"
          type="number"
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="Enter Average Annual Income"
          value={formData.annualIncome}
          onChange={handleChange}
        />
        {errors.annualIncome && <p className="text-red-500 text-xs mt-1">{errors.annualIncome}</p>}
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 grid">
        <label className="font-semibold text-gray-700 mb-1.5 block">Brief About You / Company <span className="text-red-500">*</span></label>
        <textarea
          name="companyDescription"
          rows={4}
          className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition placeholder-gray-400"
          placeholder="About You or Your Company"
          value={formData.companyDescription}
          onChange={handleChange}
        />
        {errors.companyDescription && <p className="text-red-500 text-xs mt-1">{errors.companyDescription}</p>}
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div>
          <label className="font-semibold text-gray-700 mb-1.5 block">Company Ownership <span className="text-red-500">*</span></label>
          <select
            name="companyOwnership"
            value={formData.companyOwnership}
            onChange={handleChange}
            className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition text-gray-700"
          >
            <option value="">-- Select Ownership Type --</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Partnership Firm">Partnership Firm</option>
            <option value="Private Limited Company">Private Limited Company</option>
            <option value="Public Limited Company">Public Limited Company</option>
            <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
          </select>
          {errors.companyOwnership && <p className="text-red-500 text-xs mt-1">{errors.companyOwnership}</p>}
        </div>

        <div>
          <label className="font-semibold text-gray-700 mb-1.5 block">Operation City <span className="text-red-500">*</span></label>
          <select
            name="brokerOperatedCities"
            value={formData?.brokerOperatedCities?.[0]?.cityId || ""}
            onChange={handleCitySelect}
            className="bg-white border border-gray-200 w-full px-3 py-3 rounded-md focus:border-[#002b5b] focus:ring-1 focus:ring-[#002b5b] outline-none transition text-gray-700"
          >
            <option value="" disabled>-- Select City --</option>
            {cities.map((city) => (
              <option key={city.id} value={city?.id}>{city.name}</option>
            ))}
          </select>
          {errors.brokerOperatedCities && <p className="text-red-500 text-xs mt-1">{errors.brokerOperatedCities}</p>}
        </div>
      </div>

      <div className="col-span-1 lg:col-span-2 flex flex-col gap-3 mt-2">
        <div className="flex flex-row justify-between items-end">
          <label className="font-semibold text-gray-700">Operation Areas <span className="text-red-500">*</span></label>
          {formData?.brokerOperatedCities?.[0]?.operatedAreas?.length < 5 && (
            <button
              type="button"
              className="text-[#0B2046] text-xs border rounded-sm p-1 font-bold hover:underline"
              onClick={handleAddField}
            >
              + Add Operation Area
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData?.brokerOperatedCities?.[0]?.operatedAreas?.map((area, index) => {
            const citySelected = !!formData?.brokerOperatedCities?.[0]?.cityId;
            return (
              <div key={index} className="relative">
                <input
                  type="text"
                  placeholder={`Enter or select Operation Area ${index + 1}`}
                  className={`w-full border border-gray-200 rounded-md px-3 py-3 outline-none focus:border-[#002b5b] transition ${citySelected ? 'bg-white' : 'bg-gray-50 cursor-not-allowed'}`}
                  value={formData.brokerOperatedCities[0].operatedAreas[index]?.name || ""}
                  onChange={(e) => handleOperationAreaInput(e, index)}
                  onFocus={() => citySelected && setShowSuggestionsIndex(index)}
                  onBlur={() => setTimeout(() => setShowSuggestionsIndex(null), 150)}
                  disabled={!citySelected}
                />
                {citySelected && showSuggestionsIndex === index && filteredSuggestions.length > 0 && (
                  <ul className="absolute z-20 bg-white border border-gray-200 rounded-md w-full mt-1 max-h-40 overflow-y-auto text-xs shadow-lg">
                    {filteredSuggestions.map((loc) => (
                      <li
                        key={loc.id}
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-gray-700"
                        onMouseDown={() => handleSuggestionSelect(index, loc)}
                      >
                        {loc.name}
                      </li>
                    ))}
                  </ul>
                )}
                {index > 0 && (
                  <button type="button" className="text-red-500 text-xs font-semibold mt-1.5" onClick={() => handleRemoveField(index)}>
                    Remove
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {errors.operatedAreas && <p className="text-red-500 text-xs mt-1">{errors.operatedAreas}</p>}
      </div>
    </div>
  );
}
