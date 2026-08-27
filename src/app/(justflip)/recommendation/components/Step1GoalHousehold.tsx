"use client";

export interface Step1Data {
  goal: string;
  household: string;
}

interface Step1Props {
  data: Step1Data;
  onChange: (updated: Partial<Step1Data>) => void;
  onNext: () => void;
}

const PROPERTY_GOALS = [
  {
    id: "ready",
    title: "Buy a ready home",
    description: "I want a home that is ready to move into soon.",
    icon: "🏠",
  },
  {
    id: "future",
    title: "Buy for the future",
    description: "I'm open to under-construction or new-launch projects.",
    icon: "🏗️",
  },
  {
    id: "rent",
    title: "Rent a home",
    description: "I'm looking for a flexible home to rent.",
    icon: "🔑",
  },
];

const HOUSEHOLD_TYPES = [
  {
    id: "just_me",
    title: "Just me",
    bhk: "1 - 2 BHK",
    size: "250-900 sq. ft.",
    description: "A practical home that fits my daily routine and lifestyle.",
    icon: "👤",
  },
  {
    id: "small_family",
    title: "Small family",
    bhk: "2 - 3 BHK",
    size: "900-1,500 sq. ft.",
    description: "A comfortable home for me and 2-3 family members.",
    icon: "👨‍👩‍👦",
  },
  {
    id: "large_family",
    title: "Large or joint family",
    bhk: "3 - 4+ BHK",
    size: "1,500-2,800+ sq. ft.",
    description: "A spacious home for a growing or joint family.",
    icon: "🏡",
  },
];

export default function Step1GoalHousehold({ data, onChange, onNext }: Step1Props) {
  const isFormValid = Boolean(data.goal) && Boolean(data.household);

  return (
    <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-gray-100 shadow-xl w-full">
      <div className="mb-8 pb-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-1 bg-sky-50 text-[#002B5B] text-xs font-extrabold tracking-wider uppercase rounded-md border border-sky-100">
              Step 1 of 2
            </span>
            <span className="text-xs font-semibold text-gray-400">50% Completed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B5B] tracking-tight">
            Let&apos;s understand your requirements
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
            Tell us your buying or renting goal, and who this home is for.
          </p>
        </div>

        <div className="w-full md:w-48 bg-gray-100 h-2.5 rounded-full overflow-hidden self-center">
          <div className="bg-[#002B5B] h-full w-1/2 rounded-full transition-all duration-500"></div>
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
          PROPERTY PURPOSE <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROPERTY_GOALS.map((item) => {
            const isSelected = data.goal === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange({ goal: item.id })}
                className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 relative flex flex-col justify-between group ${
                  isSelected
                    ? "border-[#002B5B] bg-gradient-to-br from-slate-50 to-sky-50/30 shadow-md ring-4 ring-[#002B5B]/10 scale-[1.01]"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 inline-block">
                      {item.icon}
                    </span>
                    {/* Check indicator */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? "bg-[#002B5B] text-white" : "border-2 border-gray-300 group-hover:border-gray-400"
                    }`}>
                      {isSelected && <span className="text-xs font-bold">&#10003;</span>}
                    </div>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-xs font-bold tracking-wider text-gray-400 uppercase mb-4">
          WHO IS THIS HOME FOR? <span className="text-red-500">*</span>
        </label>
        <div className="space-y-4">
          {HOUSEHOLD_TYPES.map((type) => {
            const isSelected = data.household === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange({ household: type.id })}
                className={`w-full text-left p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 relative flex items-center justify-between group ${
                  isSelected
                    ? "border-[#002B5B] bg-gradient-to-r from-slate-50 to-sky-50/30 shadow-md ring-4 ring-[#002B5B]/10"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 bg-white shadow-sm"
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 w-full">
                  <span className="text-3xl p-3 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0 hidden sm:block">
                    {type.icon}
                  </span>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <span className="text-base sm:text-lg font-bold text-gray-900">{type.title}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold shadow-2xs">
                          {type.bhk}
                        </span>
                        <span className="text-xs sm:text-sm bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg font-semibold shadow-2xs">
                          {type.size}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{type.description}</p>
                  </div>
                </div>

                <div className={`ml-4 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? "bg-[#002B5B] text-white" : "border-2 border-gray-300 group-hover:border-gray-400"
                }`}>
                  {isSelected && <span className="text-xs font-bold">&#10003;</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        disabled={!isFormValid}
        onClick={onNext}
        className="w-full py-4 bg-[#002B5B] hover:bg-[#001f42] disabled:bg-gray-100 disabled:text-gray-400 text-white text-base sm:text-lg font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 cursor-pointer disabled:cursor-not-allowed group"
      >
        <span>Continue to Step 2</span>
        <span className="text-xl group-hover:translate-x-1 transition-transform">&rarr;</span>
      </button>
    </div>
  );
}