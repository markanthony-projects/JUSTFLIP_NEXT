import React from 'react';
import { IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5';
import FloorPlanUploader from '../shared/FloorPlanUploader';
import Button from '@/src/components/atoms/CloseButton';
import { BiGridAlt } from 'react-icons/bi';

const PublishPropertyMedia = ({
    formData,
    handleUpload,
    handleRemoveMedia,
    handleMediaMetaChange,
    handleFloorPlan,
    handleRemoveFloorPlan,
    handleFloorPlanAltChange,
    handleFloorPlanUnitChange,
    isUploadingFloorPlans,
    uploadingCategory
}) => {
    const categories = [
        { name: "exterior_view_images_URL", label: "Hero Header Image (Banner)", title: "banner", type: "image", multiple: false },
        { name: "others_images", label: "Property Photos", title: "other", type: "image", multiple: true },
        { name: "video_URL", label: "Property Video Tour", title: "video", type: "video", multiple: false },
    ];

    return (
        <div className="space-y-8">
            {categories.map((cat) => (
                <div key={cat.name} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                    <div className="flex items-start gap-2">
                        <BiGridAlt className="text-[#002B5B] text-xl mt-0.5 shrink-0" />
                       
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-bold text-slate-800 tracking-tight">{cat.label}</label>
                                <p className="text-xs text-slate-500">
                                    {cat.type === 'image' ? 'Upload high-quality photos (JPG, PNG)' : 'Upload a short video tour (MP4, MOV)'}
                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <input
                                type="file"
                                multiple={cat.multiple}
                                accept={cat.type === 'image' ? 'image/*' : 'video/*'}
                                onChange={(e) => handleUpload(cat.name, cat.multiple, e.target.files)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full py-8 border-2 border-dashed border-slate-300 rounded-xl bg-white flex flex-col items-center justify-center gap-2 group-hover:border-[#002B5B] group-hover:bg-blue-50/30 transition-all duration-300">
                                {uploadingCategory === cat.name ? (
                                    <div className="flex justify-center items-center h-20">
                                        <span className="text-sm font-semibold text-[#002B5B] animate-pulse">Uploading…</span>
                                    </div>
                                ) : (
                                    <>

                                        <IoCloudUploadOutline className="text-3xl text-slate-400 group-hover:text-[#002B5B] transition-colors" />
                                        <span className="text-sm font-semibold text-slate-500 group-hover:text-[#002B5B]">
                                            Upload {cat.label}
                                        </span>
                                        <span className="text-[11px] text-slate-400">JPG, PNG, WEBP • Multiple allowed</span>

                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {formData?.medias?.filter(m => m.title === cat.title).map((file, idx) => {
                                const originalIdx = formData.medias.indexOf(file);
                                return (
                                    <div key={idx} className="bg-white flex gap-2 border border-slate-200 w-full rounded-xl shadow-sm">
                                        <div className="relative h-36 bg-slate-100 rounded-xl overflow-hidden m-2 w-36 shrink-0">
                                            {file.type === "video" ? (
                                                <video src={file.url} controls className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={file.url} alt={file.alt} className="w-full h-full object-cover" />
                                            )}
                                            <Button onClick={() => handleRemoveMedia(originalIdx)} />
                                        </div>
                                        <div className="p-3 flex-1 min-w-0 space-y-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Label / Caption</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Living Room, Main Entrance"
                                                    value={file.alt}
                                                    onChange={(e) => handleMediaMetaChange(originalIdx, "alt", e.target.value)}
                                                    className="w-full p-2 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-[#002B5B] bg-slate-50 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
            ))}

                    {/* Floor Plans section */}
                    <FloorPlanUploader
                        floorPlans={formData.units[0]?.floorPlans || []}
                        onUpload={(files) => handleFloorPlan(0, files)}
                        onRemove={(imageIdx) => handleRemoveFloorPlan(0, imageIdx)}
                        onAltChange={(imageIdx, val) => handleFloorPlanAltChange(0, imageIdx, val)}
                        onUnitChange={(imageIdx, val) => handleFloorPlanUnitChange(0, imageIdx, val)}
                        isUploading={isUploadingFloorPlans}
                    />
                </div>
            );
};

            export default PublishPropertyMedia;
