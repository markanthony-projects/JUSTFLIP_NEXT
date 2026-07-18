// Broker Property – shared option constants + field definitions
// Re-uses the same vocabulary as PublishProperty/constants.js
import React from 'react';
import { HiOutlineBuildingOffice2, HiOutlineHomeModern } from 'react-icons/hi2';
import { MdOutlineLandscape, MdOutlineHouse } from 'react-icons/md';
import { BiDollarCircle, BiRefresh, BiKey } from 'react-icons/bi';

// ── UI Metadata ───────────────────────────────────

export const STEP_TITLES = {
    1: { title: "Basic Details", subtitle: "Set property type, location and project name." },
    2: { title: "Property Specifications", subtitle: "Describe the size, rooms, and features." },
    3: { title: "Pricing & Map", subtitle: "Set the expected price and pin the property on the map." },
    4: { title: "Photos & Videos", subtitle: "Add high-quality visuals to attract buyers." },
};

export const propertyOptions = [
    { label: 'Apartment / Flats', value: 'apartment', icon: <HiOutlineBuildingOffice2 size={18} /> },
    { label: 'Villa', value: 'villa', icon: <HiOutlineHomeModern size={18} /> },
    { label: 'Plot / Land', value: 'plot', icon: <MdOutlineLandscape size={18} /> },
    { label: 'Residential House', value: 'residentialhouse', icon: <MdOutlineHouse size={18} /> },
];

export const transactionTagsOptions = [
    { label: 'Sale', value: 'Sale', icon: <BiDollarCircle size={18} /> },
    { label: 'Re-Sale', value: 'Re-Sale', icon: <BiRefresh size={18} /> },
    { label: 'Rent', value: 'Rent', icon: <BiKey size={18} /> },
];

export const furnishOptions = [
    { label: 'Furnished', value: 'Furnished' },
    { label: 'Semi Furnished', value: 'Semi Furnished' },
    { label: 'Unfurnished', value: 'Unfurnished' },
];

export const facingOptions = [
    { label: 'North', value: 'north' },
    { label: 'South', value: 'south' },
    { label: 'East', value: 'east' },
    { label: 'West', value: 'west' },
    { label: 'North-East', value: 'north-east' },
    { label: 'North-West', value: 'north-west' },
    { label: 'South-East', value: 'south-east' },
    { label: 'South-West', value: 'south-west' },
];

export const numberOptions = [
    { label: '1', value: '1' }, { label: '2', value: '2' },
    { label: '3', value: '3' }, { label: '4', value: '4' },
    { label: '5', value: '5' }, { label: '6', value: '6' },
    { label: '7', value: '7' }, { label: '8+', value: '8+' },
];

export const possessionStatusOptions = [
    { label: 'Ready to Move In', value: 'Ready to Move In' },
    { label: 'Under Construction', value: 'Under Construction' },
];

export const yesNoOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
];

export const inputClass ="w-full h-[48px] px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium   text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#002B5B]/10 focus:border-[#002B5B] hover:border-slate-300 transition-all shadow-sm";

/** Fields that live inside formData.units[0] */
export const UNIT_FIELDS = [
    "flatsCount", "furnishing", "interiorArea", "exteriorArea", "facing",
    "bedrooms", "balconies", "commonBathrooms", "attachedBathrooms",
    "unit_type", "advanceAmount", "expectedPrice", "maxPrice", "isNegotiable", "plotArea",
    "plotWidth", "plotLength", "roadWidth", "floors", "openSidesCount",
    "allowedFloors", "isCornerPlot", "isConstructionDone", "isGatedColony",
    "hasBoundaryWalls",
];

/**
 * Returns the dynamic step→field configuration for a given property type.
 * @param {string} type - e.g. 'apartment', 'villa', etc.
 * @param {Array}  cityOptions  - [{label, value}]
 * @param {Array}  locations    - [{label, value}]
 * @param {string} transactionType - default transaction value
 */
export const getInputFields = (type, cityOptions = [], locations = [], transactionType = '') => {
    const commonStep3 = [
        { name: "possessionStatus", label: "Possession Status", type: "select", options: possessionStatusOptions, required: true },
        { name: "expectedPrice", label: "Expected Price (₹)", type: "number", required: true },
        { name: "maxPrice", label: "Max Price (₹)", type: "number", required: false },
        { name: "advanceAmount", label: "Advance Amount (₹)", type: "number", required: false },
        { name: "isNegotiable", label: "Price Negotiable", type: "select", required: false, options: yesNoOptions },
        { name: "coordinates", label: "Location On Map", type: "map", required: false },
    ];

    const commonStep4 = [
        { name: "exterior_view_images_URL", label: "Banner / Exterior Image", type: "file", category: 'image', required: false, hasMeta: true },
        { name: "video_URL", label: "Video Tour", type: "file", category: 'video', multiple: true, required: false, hasMeta: true },
        { name: "others_images", label: "Other Property Photos", type: "file", category: 'image', multiple: true, required: false, hasMeta: true },
    ];

    const baseStep1 = [
        { name: "type", label: "Property Type", type: "button-group", required: true, options: propertyOptions },
        { name: "transactionTag", label: "Transaction Type", type: "button-group", required: true, options: transactionTagsOptions, defaultValue: transactionType },
        { name: "name", label: "Project Name", type: "project-search", required: false },
        { name: "cityId", label: "City", type: "select", options: cityOptions, required: true, searchable: true },
        { name: "locationId", label: "Area / Location", type: "location-search", required: true },
        { name: "subLocality", label: "Sub Locality", type: "text", required: true },
        { name: "address", label: "Address", type: "text", required: true },
    ];

    const definitions = {
        apartment: {
            1: [
                ...baseStep1,
                { name: "flatsCount", label: "Number of Flats", type: "number", required: true },
            ],
            2: [
                { name: "furnishing", label: "Furnishing", type: "select", options: furnishOptions, required: true },
                { name: "interiorArea", label: "Interior Area (Sq Ft)", type: "number", required: true },
                { name: "exteriorArea", label: "Exterior Area (Sq Ft)", type: "number", required: false },
                { name: "facing", label: "Facing", type: "select", options: facingOptions, required: true },
                { name: "bedrooms", label: "Bedrooms", type: "select", required: true, options: numberOptions },
                { name: "balconies", label: "Balconies", type: "select", required: false, options: numberOptions },
                { name: "commonBathrooms", label: "Common Bathrooms", type: "select", required: true, options: numberOptions },
                { name: "attachedBathrooms", label: "Attached Bathrooms", type: "select", required: false, options: numberOptions },
            ],
            3: commonStep3,
            4: commonStep4,
        },
        residentialhouse: {
            1: baseStep1,
            2: [
                { name: "furnishing", label: "Furnishing", type: "select", options: furnishOptions, required: true },
                { name: "exteriorArea", label: "Exterior Area (Sq Ft)", type: "number", required: true },
                { name: "plotArea", label: "Plot Area (Sq Ft)", type: "number", required: true },
                { name: "facing", label: "Facing", type: "select", options: facingOptions, required: true },
                { name: "bedrooms", label: "Bedrooms", type: "select", required: true, options: numberOptions },
                { name: "balconies", label: "Balconies", type: "select", required: false, options: numberOptions },
                { name: "commonBathrooms", label: "Common Bathrooms", type: "select", required: true, options: numberOptions },
                { name: "attachedBathrooms", label: "Attached Bathrooms", type: "select", required: false, options: numberOptions },
                { name: "floors", label: "Total Floors", type: "number", required: true },
                { name: "allowedFloors", label: "Floors Allowed for Construction", type: "number", required: false },
                { name: "openSidesCount", label: "No. of Open Sides", type: "number", required: false },
                { name: "isCornerPlot", label: "Is Corner Plot?", type: "select", required: false, options: yesNoOptions },
                { name: "plotWidth", label: "Plot Width (Ft)", type: "number", required: true },
                { name: "roadWidth", label: "Road Width (Meters)", type: "number", required: false },
            ],
            3: commonStep3,
            4: commonStep4,
        },
        villa: {
            1: baseStep1,
            2: [
                { name: "furnishing", label: "Furnishing", type: "select", options: furnishOptions, required: true },
                { name: "interiorArea", label: "Interior Area (Sq Ft)", type: "number", required: true },
                { name: "exteriorArea", label: "Exterior Area (Sq Ft)", type: "number", required: true },
                { name: "plotArea", label: "Plot Area (Sq Ft)", type: "number", required: true },
                { name: "facing", label: "Facing", type: "select", options: facingOptions, required: true },
                { name: "bedrooms", label: "Bedrooms", type: "select", required: true, options: numberOptions },
                { name: "balconies", label: "Balconies", type: "select", required: false, options: numberOptions },
                { name: "commonBathrooms", label: "Common Bathrooms", type: "select", required: true, options: numberOptions },
                { name: "attachedBathrooms", label: "Attached Bathrooms", type: "select", required: false, options: numberOptions },
                { name: "floors", label: "Total Floors", type: "number", required: true },
                { name: "isCornerPlot", label: "Is Corner Plot?", type: "select", required: false, options: yesNoOptions },
                { name: "plotWidth", label: "Plot Width (Sq Ft)", type: "number", required: true },
                { name: "plotLength", label: "Plot Length (Sq Ft)", type: "number", required: true },
                { name: "roadWidth", label: "Road Width (Meters)", type: "number", required: false },
            ],
            3: commonStep3,
            4: commonStep4,
        },
        plot: {
            1: baseStep1,
            2: [
                { name: "exteriorArea", label: "Exterior Area (Sq Ft)", type: "number", required: true },
                { name: "plotArea", label: "Plot Area (Sq Ft)", type: "number", required: true },
                { name: "facing", label: "Facing", type: "select", options: facingOptions, required: true },
                { name: "openSidesCount", label: "No. of Open Sides", type: "number", required: false },
                { name: "isCornerPlot", label: "Is Corner Plot?", type: "select", required: false, options: yesNoOptions },
                { name: "plotWidth", label: "Plot Width (Sq Ft)", type: "number", required: true },
                { name: "plotLength", label: "Plot Length (Sq Ft)", type: "number", required: true },
                { name: "roadWidth", label: "Road Width (Meters)", type: "number", required: false },
                { name: "isConstructionDone", label: "Any Construction Done?", type: "select", required: false, options: yesNoOptions },
                { name: "hasBoundaryWalls", label: "Boundary Walls Made?", type: "select", required: false, options: yesNoOptions },
                { name: "isGatedColony", label: "Is in a Gated Colony?", type: "select", required: false, options: yesNoOptions },
            ],
            3: commonStep3,
            4: commonStep4,
        },
    };

    return definitions[type] || definitions.apartment;
};
