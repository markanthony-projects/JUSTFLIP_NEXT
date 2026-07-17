import Breadcrumb from "@/src/components/organisms/breadCrumb";
import * as BuilderService from "@/src/services/BuilderService";
import { parseDevelopersDetailsUrl } from "@/src/utils/url";
import DeveloperDetailsClient from "../../components/DeveloperDetailsClient";
import { constructMetadata } from "@/src/utils/seo";
import { buildDeveloperSchema } from "@/src/utils/schema";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { name, id } = parseDevelopersDetailsUrl(slug);
    const { builder } = await BuilderService?.fetchDeveloperById(id);

    const title = builder ? `Top Projects by ${builder.name} - Reviews & Prices | JustFlip` : `${name} Properties & Builder Reviews | JustFlip`;
    const description = builder?.description ? builder.description.replace(/<[^>]+>/g, '').substring(0, 157) + '...' : `Explore luxury real estate projects, legacy, and verified reviews of ${name}. View complete list of past and upcoming properties on JustFlip.`;
    const url = `/developers/${slug}`;

    return constructMetadata({
        title,
        description,
        canonical: url,
        image: builder?.logo || 'https://justflip.in/logo.png',
        type: 'profile'
    });
}

export const revalidate = 3600;

export default async function DeveloperDetails({ params }) {
    const { slug } = await params;
    const { name, id } = parseDevelopersDetailsUrl(slug);
    const { builder } = await BuilderService?.fetchDeveloperById(id);

    const developerSchema = buildDeveloperSchema({
        name: builder?.name || name,
        description: builder?.description,
        slug: slug,
        logo: builder?.logo
    });

    return (
        <div className="relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(developerSchema) }}
            />
            <DeveloperDetailsClient initialData={builder} />
        </div>
    );
}