import { BiFirstAid, BiBuildings } from "react-icons/bi";
import { GrNavigate } from "react-icons/gr";
import { LuGraduationCap } from "react-icons/lu";
import { PiHandsPrayingBold, PiForkKnifeBold, PiBuildingOfficeBold, PiParkBold } from "react-icons/pi";
import { TbBuildingBank, TbBus } from "react-icons/tb";

export const MAP_CATEGORIES = [
  { name: "Hospitals", type: "hospital", icon: BiFirstAid },
  { name: "Shopping Malls", type: "shopping_mall", icon: BiBuildings },
  { name: "Religious Retreats", type: "church", icon: PiHandsPrayingBold },
  { name: "Public Transport", type: "transit_station", icon: TbBus },
  { name: "Restaurant", type: "restaurant", icon: PiForkKnifeBold },
  { name: "Government Offices", type: "city_hall", icon: PiBuildingOfficeBold },
  { name: "Education", type: "school", icon: LuGraduationCap },
  { name: "Banks & ATM", type: "bank", icon: TbBuildingBank },
  { name: "Nearby Attractions", type: "tourist_attraction", icon: GrNavigate },
  { name: "Senior Citizen Parks", type: "park", icon: PiParkBold },
];