import * as ProjectService from "@/src/services/ProjectService";
import PropertySupplyClient from "./PropertySupplyClient"

export default async function PropertySupply({ typeName, typeId }) {
  const limit = 24
  const page = 1

  const projects = await ProjectService.fetchExploreProjects({ typeId, typeName, limit, page });
  return (
    <div className="">
      <PropertySupplyClient initialProjects={projects} typeName={typeName} />
    </div>
  );
}