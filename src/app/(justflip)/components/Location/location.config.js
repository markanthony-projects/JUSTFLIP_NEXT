import { PiBusLight, PiBuildingApartmentLight, PiFilmReelLight, PiStudent, PiHospitalLight, PiTrainSimpleLight, PiAirplaneInFlightLight, PiParkLight } from "react-icons/pi";
import { IoBookOutline, IoTrainOutline } from "react-icons/io5";
import { TbHospitalCircle, TbBusStop, TbBuildingCarousel } from "react-icons/tb";
import { LuGraduationCap } from "react-icons/lu";

export const CATEGORY_ICONS = {
    road: PiBusLight,
    mall: PiBuildingApartmentLight,
    movie: PiFilmReelLight,
    school: IoBookOutline,
    college: PiStudent,
    hospital: PiHospitalLight,
    airport: PiAirplaneInFlightLight,
    railway: PiTrainSimpleLight,
    park: PiParkLight,
    metro: IoTrainOutline,
    clinic: TbHospitalCircle,
};

export const TABS = [
    { name: "Connectivity", icon: TbBusStop },
    { name: "Entertainment", icon: TbBuildingCarousel },
    { name: "Healthcare", icon: TbHospitalCircle },
    { name: "Education", icon: LuGraduationCap },
];