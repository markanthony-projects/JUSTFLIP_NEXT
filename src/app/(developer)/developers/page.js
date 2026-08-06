import * as BuilderService from "@/src/services/BuilderService";
import DevelopersClientPage from "../components/DeveloperClient";
import Breadcrumb from "@/src/components/organisms/breadCrumb";
import ScrollToTop from "@/src/components/atoms/ScrollToTop";


export default async function DevelopersPage() {
  const data = await BuilderService.fetchDevelopers({ page: 1, limit: 20 })
  return (
    <>
    <ScrollToTop />
    <div className="flex-1 px-2 md:px-4 py-1  w-full md:max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: "Developers" }]} />
      <DevelopersClientPage initialData={data?.builders} />
    </div>
    </>
  );
}
