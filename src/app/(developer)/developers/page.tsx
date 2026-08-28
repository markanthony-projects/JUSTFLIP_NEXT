import * as BuilderService from "@/src/services/BuilderService";
import DevelopersClientPage from "../components/DeveloperClient";
import Breadcrumb from "@/src/components/organisms/breadCrumb";
import ScrollToTop from "@/src/components/atoms/ScrollToTop";


export interface DevelopersPageProps {
  params?: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DevelopersPage(props: DevelopersPageProps) {
  const searchParams = await props.searchParams;
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const data = await BuilderService.fetchDevelopers({ page, limit: 20 });
  
  return (
    <>
    <ScrollToTop />
    <div className="flex-1 w-full mx-auto px-2 md:px-8 lg:px-24 py-2 md:py-4">
      <Breadcrumb items={[{ label: "Developers" }]} />
      <DevelopersClientPage initialData={data} />
    </div>
    </>
  );
}
