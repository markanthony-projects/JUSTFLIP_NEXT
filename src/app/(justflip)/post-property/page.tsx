import PostPropertyClient from "../components/PostProperty/postPropertyClient"
import SiteService from "@/src/services/SiteService"

const page = async () => {
    const { cities } = await SiteService.fetchPopularCities({ offset: 0, limit: 15 });
    return (
        <>
            <PostPropertyClient initialCities ={cities}/>
        </>
    )
}

export default page