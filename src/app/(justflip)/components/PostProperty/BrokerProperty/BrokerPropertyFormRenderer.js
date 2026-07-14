import React from 'react';
import { inputClass } from './constants';
import { FiMapPin } from 'react-icons/fi';
import CustomSelect from '@/src/components/atoms/CustomSelector';
import SearchDropdown from '@/src/components/atoms/SearchableDropdown';


const BrokerPropertyFormRenderer = ({
    fields = [],
    formData,
    errors,
    handleChange,
    openMap,
    projectSuggestions = [],
    showProjectDropdown,
    setShowProjectDropdown,
    onSelectProject,
    onProjectSearch,
    projectQuery,

    locationSuggestions = [],
    showLocationDropdown,
    setShowLocationDropdown,
    onLocationSearch,
    onSelectLocation,
    locationQuery,
}) => {
    const getFieldValue = (name) => {
        const UNIT_FIELDS = [
            "flatsCount", "furnishing", "interiorArea", "exteriorArea", "facing",
            "bedrooms", "balconies", "commonBathrooms", "attachedBathrooms",
            "unit_type", "advanceAmount", "expectedPrice", "maxPrice", "isNegotiable", "plotArea",
            "plotWidth", "plotLength", "roadWidth", "floors", "openSidesCount",
            "allowedFloors", "isCornerPlot", "isConstructionDone", "isGatedColony",
            "hasBoundaryWalls",
        ];
        if (UNIT_FIELDS.includes(name)) return formData?.units?.[0]?.[name] ?? "";
        return formData?.[name] ?? "";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        {field.label}
                        {field.required && <span className="text-rose-500 ml-1.5">*</span>}
                    </label>

                    {field.type === "select" && (
                        <CustomSelect
                            options={field.options || []}
                            value={getFieldValue(field.name)}
                            onChange={(val) => handleChange({ target: { name: field.name, value: val } })}
                            placeholder={`Select ${field.label}`}
                            inputClass={inputClass}
                            error={errors?.[field.name]}
                            searchable={field.searchable ?? false}
                        />
                    )}

                    {['text', 'number', 'date'].includes(field.type) && (
                        <input
                            type={field.type}
                            name={field.name}
                            placeholder={`Enter ${field.label}`}
                            value={getFieldValue(field.name)}
                            onChange={handleChange}
                            className={`${inputClass} ${errors?.[field.name] ? "border-rose-400" : ""}`}
                        />
                    )}

                    {field.type === "project-search" && (
                        <SearchDropdown
                            value={projectQuery}
                            onChange={(q) => onProjectSearch(q)}
                            suggestions={projectSuggestions}
                            onSelect={(item) => onSelectProject(item)}
                            showSuggestions={showProjectDropdown}
                            setShowSuggestions={setShowProjectDropdown}
                            placeholder="Search or type project name"
                            inputClass={inputClass}
                            displayKey="name"
                            subDisplayKey="city"
                            selected={!!formData?.linkedProjectId}
                            error={errors?.[field.name]}
                        />
                    )}

                    {field.type === "location-search" && (
                        <SearchDropdown
                            value={locationQuery}
                            onChange={(q) => onLocationSearch(q, formData?.cityId)}
                            suggestions={locationSuggestions}
                            onSelect={(item) => onSelectLocation(item)}
                            showSuggestions={showLocationDropdown}
                            setShowSuggestions={setShowLocationDropdown}
                            placeholder="Search area / locality"
                            inputClass={inputClass}
                            displayKey="label"
                            subDisplayKey="city"
                            selected={!!formData?.locationId}
                            disabled={!formData?.cityId}
                            error={errors?.[field.name]}
                        />
                    )}

                    {/* ── MAP TRIGGER ── */}
                    {field.type === "map" && (
                        <button
                            type="button"
                            onClick={openMap}
                            className={`${inputClass} flex items-center justify-between cursor-pointer hover:border-[#002B5B] hover:bg-blue-50/30 transition-all ${errors?.[field.name] ? "border-rose-400" : ""}`}
                        >
                            <span className="text-slate-500 text-sm">
                                {formData?.coordinates?.lat
                                    ? `📍 Latitude: ${Number(formData.coordinates.lat).toFixed(5)}, Longitude: ${Number(formData.coordinates.lng).toFixed(5)}`
                                    : "Click to pin location on map"}
                            </span>
                            <FiMapPin className="text-[#002B5B] shrink-0" />
                        </button>
                    )}

                    {/* ── VALIDATION ERROR ── */}
                    {errors?.[field.name] && (
                        <p className="text-[10px] text-rose-500 font-medium">{errors[field.name]}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BrokerPropertyFormRenderer;
