import { cookies, headers } from "next/headers";
import NearestCityClient from "./NearestCity.client";
import { fetchNearestCityByIP } from "./nearest-city.actions";

export const runtime = "edge";

function normalizeIP(ip) {
    if (!ip || ip === "::1") return "127.0.0.1";
    if (ip.startsWith("::ffff:")) return ip.replace("::ffff:", "");
    return ip;
}

export default async function NearestCity() {
    const cookieStore = await cookies();
    const raw = cookieStore.get("activeCity")?.value;

    let city = null;

    if (raw) {
        try {
            city = JSON.parse(decodeURIComponent(raw));
        } catch {
            city = null;
        }
    }

    if (!city) {
        const headersList = await headers();

        let ip =
            headersList.get("cf-connecting-ip") ||
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            headersList.get("x-real-ip") ||
            "127.0.0.1";

        ip = normalizeIP(ip);
        city = await fetchNearestCityByIP(ip);

    }

    return <NearestCityClient initialCity={city} />;
}
