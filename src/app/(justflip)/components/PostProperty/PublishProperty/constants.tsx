export type Option = {
    label: string;
    value: string | number;
};

export const propertyOptions: Option[] = [
    { label: "Apartment", value: "apartment" },
    { label: "Villa", value: "villa" },
    { label: "Residential House", value: "residentialhouse" },
    { label: "Plot", value: "plot" },
];

export const transactionTagsOptions: Option[] = [
    { label: "Sale", value: "sale" },
    { label: "Re-Sale", value: "resale" },
    { label: "Rent", value: "rent" },
];

export const furnishOptions: Option[] = [
    { label: "Fully Furnished", value: "fully furnished" },
    { label: "Semi-Furnished", value: "semi furnished" },
    { label: "Unfurnished", value: "unfurnished" },
];

export const facingOptions: Option[] = [
    { label: "North", value: "north" },
    { label: "South", value: "south" },
    { label: "East", value: "east" },
    { label: "West", value: "west" },
    { label: "North-East", value: "north-east" },
    { label: "North-West", value: "north-west" },
    { label: "South-East", value: "south-east" },
    { label: "South-West", value: "south-west" },
];

export const numberOptions: Option[] = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "5+", value: "5+" },
];

export const possessionStatusOptions: Option[] = [
    { label: "Ready to Move", value: "Ready to Move" },
    { label: "Under Construction", value: "Under Construction" },
    { label: "New Launch", value: "New Launch" },
];

export const yesNoOptions: Option[] = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
];

/** Fields that live inside formData.units[0] */
export const UNIT_FIELDS: string[] = [
    "flatsCount", "furnishing", "interiorArea", "exteriorArea", "facing",
    "bedrooms", "balconies", "commonBathrooms", "attachedBathrooms",
    "unit_type", "advanceAmount", "expectedPrice", "maxPrice", "isNegotiable", "plotArea",
    "plotWidth", "plotLength", "roadWidth", "floors", "openSidesCount",
    "allowedFloors", "isCornerPlot", "isConstructionDone", "isGatedColony",
    "hasBoundaryWalls",
];

export const inputClass: string = "w-full p-2 border border-[#BABABA] rounded-md focus:outline-none focus:border-[#002B5B] text-sm";
