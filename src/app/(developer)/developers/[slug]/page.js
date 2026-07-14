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

    const title = builder ? `Projects by ${builder.name} | Developer Legacy by Justflip` : `${name} Properties & Builder Details | Justflip`;
    const description = builder?.description ? builder.description.replace(/<[^>]+>/g, '').substring(0, 160) : `Explore luxury real estate projects and the legacy of ${name}.`;
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