"use client";

import React, { useState } from 'react';
import { IoCloudUploadOutline, IoTrashOutline, IoAddOutline } from 'react-icons/io5';
import { BiGridAlt } from 'react-icons/bi';
import Button from '@/src/components/atoms/CloseButton';
import Image from '@/src/components/atoms/Image';

export const unitTypeOptions = [
    { label: 'Studio',          value: 'Studio' },
    { label: '1 BHK',           value: '1 BHK' },
    { label: '1.5 BHK',         value: '1.5 BHK' },
    { label: '2 BHK',           value: '2 BHK' },
    { label: '2.5 BHK',         value: '2.5 BHK' },
    { label: '3 BHK',           value: '3 BHK' },
    { label: '3.5 BHK',         value: '3.5 BHK' },
    { label: '4 BHK',           value: '4 BHK' },
    { label: '4.5 BHK',         value: '4.5 BHK' },
    { label: '5 BHK & 5+ BHK', value: '5 BHK & 5+ BHK' },
    { label: 'Duplex',          value: 'Duplex' },
];


function UnitTypeCombobox({ value, onChange }) {
    const [query, setQuery] = useState(value || '');
    const [open, setOpen] = useState(false);

    const filtered = query.trim()
        ? unitTypeOptions.filter((o) =>
              o.label.toLowerCase().includes(query.toLowerCase())
          )
        : unitTypeOptions;

    const isCustom = query.trim() && !unitTypeOptions.some(
        (o) => o.value.toLowerCase() === query.trim().toLowerCase()
    );

    const confirm = (val) => {
        onChange(val);
        setQuery(val);
        setOpen(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                placeholder="e.g. 2 BHK, Duplex…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) confirm(query.trim()); }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#002B5B] bg-white transition-colors"
            />
            {open && (filtered.length > 0 || isCustom) && (
                <ul className="absolute z-20 top-full left-0 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-52 overflow-y-auto">
                    {filtered.map((o) => (
                        <li
                            key={o.value}
                            onMouseDown={() => confirm(o.value)}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-[#002B5B] transition-colors ${value === o.value ? 'bg-blue-50 font-bold text-[#002B5B]' : 'text-slate-700'}`}
                        >
                            {o.label}
                        </li>
                    ))}
                    {isCustom && (
                        <li
                            onMouseDown={() => confirm(query.trim())}
                            className="px-3 py-2 text-sm cursor-pointer text-[#002B5B] font-bold flex items-center gap-2 border-t border-slate-100 hover:bg-blue-50 transition-colors"
                        >
                            <IoAddOutline className="shrink-0" /> Add "{query.trim()}"
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}

// ─── Floor Plan Card ──────────────────────────────────────────────────────────
function FloorPlanCard({ plan, onRemove, onAltChange, onUnitChange }) {
    return (
        <div className="bg-white flex gap-1 border- w-full rounded-xl  shadow-sm">
            <div className="relative h-36 w-48 bg-slate-100 rounded-xl overflow-hidden m-2">
                <Image
                    src={plan.url}
                    alt={plan.alt || 'Floor plan'}
                    className="w-full h-full object-cover"
                />
                <Button onClick={onRemove} />
            </div>

            <div className="p-3 flex-1 min-w-0 space-y-2">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Unit Type
                    </label>
                    <UnitTypeCombobox value={plan.unit || ''} onChange={onUnitChange} />
                </div>

                {/* Alt / Label */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Label / Caption
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Ground Floor Layout"
                        value={plan.alt || ''}
                        onChange={(e) => onAltChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-[#002B5B] bg-slate-50 transition-colors"
                    />
                </div>
            </div>
        </div>
    );
}


export default function FloorPlanUploader({
    floorPlans = [],
    onUpload,
    onRemove,
    onAltChange,
    onUnitChange,
    isUploading = false,
}) {
    return (
        <div className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
            {/* Header */}
            <div className="flex items-start gap-2">
                <BiGridAlt className="text-[#002B5B] text-xl mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-bold text-slate-800 tracking-tight">Floor Plans</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Upload floor plan images per unit type — each plan should have a unit type and caption.
                    </p>
                </div>
            </div>

            {/* Upload Zone */}
            <div className="relative group">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    disabled={isUploading}
                    onChange={(e) => onUpload(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                />
                <div className="w-full py-7 border-2 border-dashed border-slate-200 rounded-xl bg-white flex flex-col items-center justify-center gap-2 group-hover:border-[#002B5B] group-hover:bg-blue-50/30 transition-all duration-300">
                    {isUploading ? (
                        <div className='flex justify-center items-center h-20'>
                        <span className="text-sm font-semibold text-[#002B5B] animate-pulse ">Uploading…</span>
                        </div>
                    ) : (
                        <>
                            <IoCloudUploadOutline className="text-3xl text-slate-400 group-hover:text-[#002B5B] transition-colors" />
                            <span className="text-sm font-semibold text-slate-500 group-hover:text-[#002B5B]">
                                Upload Floor Plans
                            </span>
                            <span className="text-[11px] text-slate-400">JPG, PNG, WEBP • Multiple allowed</span>
                        </>
                    )}
                </div>
            </div>

            {/* Uploaded Cards */}
            {floorPlans.length > 0 && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {floorPlans.map((plan, idx) => (
                        <FloorPlanCard
                            key={idx}
                            plan={plan}
                            onRemove={() => onRemove(idx)}
                            onAltChange={(val) => onAltChange(idx, val)}
                            onUnitChange={(val) => onUnitChange(idx, val)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
