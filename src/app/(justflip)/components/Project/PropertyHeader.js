"use client";
import Button from "@/src/components/atoms/CloseButton";
import CompareButton from "@/src/components/atoms/CompareButton";
import { useCompareStore } from "@/src/stores/useCompare.store";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";


export default function PropertyHeader({ project }) {
    const { items, add, remove, clear } = useCompareStore();
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);
    const lat = project?.coordinates?.lat
    const lng = project?.coordinates?.lng
    const router = useRouter();

    const isAdded = items.some((item) => item.id === project?.id);

    const handleCompare = () => {
        if (isAdded) {
            remove(project.id);
        } else {
            add(project);
        }
    };

    const handleToggle = useCallback(() => {
        setOpen((prev) => !prev);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const handleClear = useCallback(() => {
        clear();
    }, [clear]);

    const handleNavigate = useCallback(() => {
        router.push("/compare");
    }, [router]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 py-4" >
                <div className="space-y-1">
                    <div className="flex items-end">
                        <h2 className="text-base font-semibold truncate">
                            {project?.cityPage?.name} {project?.zone?.name} {project.location.name}
                        </h2>

                        {lat && lng && (
                            <a href={`https://maps.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="text-sm underline text-[#002B5B] ml-2 font-medium whitespace-nowrap" > Open Map </a>
                        )}
                    </div>

                    <p className="text-xs text-[#585858] line-clamp-1 truncate"> RERA No : {project?.rera || "Not available"}</p>
                </div>

                <div className="hidden md:flex items-end justify-end">
                    <CompareButton isActive={isAdded} onClick={handleCompare} />
                </div>
            </div>
            <div ref={containerRef} className="hidden md:block">
                {items?.length > 0 && (<button onClick={handleToggle} className="fixed cursor-pointer bottom-6 right-12 md:right-16 z-20 bg-[#002B5B] text-white px-4 h-10 text-xs rounded-lg shadow-lg">
                    Compare ({items.length})
                </button>)}


                {(open && items?.length > 0) && (
                    <div className="fixed bottom-18 right-12 md:right-16 z-30 bg-gray-500/10 backdrop-blur-xl border border-white/20 shadow-xl  rounded-lg  p-2  animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex gap-4 overflow-x-auto">
                            {items?.map((property) => (
                                <div className="relative min-w-[160px] border border-gray-300 rounded-lg overflow-hidden">
                                    <img src={property?.medias?.find((d) => d.title === "banner")?.url} alt={property?.name} className="w-full h-24 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    <span className="absolute bottom-1 left-1 right-1 text-white text-xs line-clamp-1 truncate">
                                        {property?.name}
                                    </span>
                                    <Button onClick={() => { remove(property.id); }} />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={handleClear} className="px-4 py-2 text-xs bg-gray-200 border border-gray-300 rounded transition-all duration-200 ease-in-out  transform hover:scale-[1.03] active:scale-95" > Clear </button>
                            <button onClick={handleNavigate} className="px-4 py-2 text-xs bg-[#002B5B] text-white rounded transition-all duration-200 ease-in-out  transform hover:scale-[1.03] active:scale-95">
                                Compare
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>

    );
}