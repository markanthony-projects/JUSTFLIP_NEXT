import * as BuilderService from "@/src/services/BuilderService";
import DevelopersClientPage from "../components/DeveloperClient";
import Breadcrumb from "@/src/components/organisms/breadCrumb";


export default async function DevelopersPage() {
  const data = await BuilderService.fetchDevelopers({ page: 1, limit: 20 })
  return (
    <div className="flex-1 px-2 md:px-4 py-1  w-full  mx-auto md:max-w-[1440px]">
      <Breadcrumb items={[{ label: "Developers" }]} />
      <DevelopersClientPage initialData={data?.builders} />
    </div>

  );
}
