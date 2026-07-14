// import * as BuilderService from "@/src/services/BuilderService";
// import Link from "next/link";
// import { MdKeyboardDoubleArrowRight } from "react-icons/md";
// import TopBuildersClient from "./TopBuildersClient";

// export default async function TopBuilders({ city }) {
//     if (!city?.id) return;

//     const data = await BuilderService.fetchTopBuilders({ cityId: city.id, limit: 20 });

//     return (
//         <section>
//             <div className="pb-2">
//                 <div className="flex gap-2 items-center md:justify-between">
//                     <h2 className="text-md sm:text-lg md:text-xl font-semibold text-[#002b5b] leading-snug">
//                         {`Top Real Estate Builders in ${city?.name}`}
//                     </h2>

//                     <Link href={`/developers`} className="text-sm text-[#002B5B] underline font-semibold flex gap-2 items-center"  >
//                         View More
//                         <MdKeyboardDoubleArrowRight className="text-lg" />
//                     </Link>

//                 </div>

//                 <p className="text-xs  text-gray-600 max-w-2xl leading-relaxed">
//                     {`Explore trusted builders delivering premium residential projects in ${city?.name}.`}
//                 </p>

//             </div>

//             <TopBuildersClient
//                 initialBuilders={data?.builders || []}
//             />
//         </section>
//     );
// }

import * as BuilderService from "@/src/services/BuilderService";
import TopBuildersClient from "./TopBuildersClient";

export default async function TopBuilders({ city }) {

    if (!city?.id) return null;

    const data = await BuilderService.fetchTopBuilders({
        cityId: city?.id,
        limit: 20
    });

    return (
        <TopBuildersClient
            city={city}
            initialBuilders={data?.builders || []}
        />
    );

}