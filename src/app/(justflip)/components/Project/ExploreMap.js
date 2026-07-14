"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("./Map/MapView"), { ssr: false });
import { BsBusFront } from 'react-icons/bs';
import { PiAirplaneTiltLight } from "react-icons/pi";
import { IoTrainOutline } from "react-icons/io5";
import { IoSchoolSharp } from "react-icons/io5";
import { TiShoppingCart } from "react-icons/ti";
import { AiTwotoneShopping } from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { ImPlus } from "react-icons/im";
import Accordion from "@/src/components/atoms/Accordion";
import { AccordionItemSkeleton } from "@/src/app/(justflip)/components/Skelton/ExploreMapSkeleton";
import { SkeletonBlock } from "@/src/app/(justflip)/components/Skelton/SkeletonSection";

export default function ExploreMap({ project }) {
    const [isLoading, setIsLoading] = useState(false);
    const [busStations, setBusStations] = useState([]);
    const [airports, setAirports] = useState([]);
    const [trainStations, setTrainStations] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [schools, setSchools] = useState([]);
    const [movieTheaters, setMovieTheaters] = useState([]);
    const [shoppingMalls, setShoppingMalls] = useState([]);
    const [superMarkets, setSuperMarkets] = useState([]);

    const data = [
        { label: "Transit", value: "transit", content: <p>Overview content</p> },
        { label: "Essentials", value: "essentials", content: <p>Amenities content</p> },
        { label: "Utility", value: "utility", content: <p>Location content</p> },
    ];

    const transitData = [
        {
            title: "Bus Station",
            Icon: BsBusFront,
            data: busStations,
            emptyText: "No nearby bus stations found.",
        },
        {
            title: "Airport",
            Icon: PiAirplaneTiltLight,
            data: airports,
            emptyText: "No nearby airports found.",
        },
        {
            title: "Train Stations",
            Icon: IoTrainOutline,
            data: trainStations,
            emptyText: "No nearby train stations found.",
        },
    ];

    const essentialsData = [
        {
            title: "Hospitals",
            Icon: ImPlus,
            data: hospitals,
            emptyText: "No nearby hospitals found.",
        },
        {
            title: "Schools",
            Icon: IoSchoolSharp,
            data: schools,
            emptyText: "No nearby schools found.",
        },
    ];

    const utilityData = [
        {
            title: "Movie Theaters",
            Icon: MdOutlineLocalMovies,
            data: movieTheaters,
            emptyText: "No nearby movie theaters found.",
        },
        {
            title: "Shopping Malls",
            Icon: AiTwotoneShopping,
            data: shoppingMalls,
            emptyText: "No nearby shopping malls found.",
        },
        {
            title: "Super Markets",
            Icon: TiShoppingCart,
            data: superMarkets,
            emptyText: "No nearby supermarkets found.",
        },
    ];

    const [activeTab, setActiveTab] = useState(data[0]?.value || "");


    return (
        <section className="m-2 space-y-2">
            <p className="text-sm text-gray-500 ">
                {project?.location?.name}, {project?.city?.name},{" "} {project?.pincode}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-3">
                    <MapView 
                        project={project} 
                        setBusStations={setBusStations} 
                        setAirports={setAirports} 
                        setTrainStations={setTrainStations} 
                        setHospitals={setHospitals} 
                        setSchools={setSchools} 
                        setMovieTheaters={setMovieTheaters} 
                        setShoppingMalls={setShoppingMalls} 
                        setSuperMarkets={setSuperMarkets} 
                        onLoadingChange={setIsLoading}
                    />
                </div>
                <div className="lg:col-span-2 md:col-span-2">
                    <div className="flex border-b border-gray-200">
                        {data?.map(({ label, value }) => (
                            <button key={value} onClick={() => setActiveTab(value)} className={`px-4 py-2 text-sm font-semibold transition-all duration-200 ${activeTab === value ? "text-[#002B5B] border-b-2 border-[#002B5B]" : "text-gray-500 hover:text-[#002B5B] border-b-2 border-transparent"}`} >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div className="">
                        {isLoading ? (
                            <div className="space-y-4 py-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <AccordionItemSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <>
                                {activeTab === "transit" && (
                                    <Accordion items={transitData} />
                                )}
                                {activeTab === "essentials" && (
                                    <Accordion items={essentialsData} />
                                )}
                                {activeTab === "utility" && (
                                    <Accordion items={utilityData} />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}