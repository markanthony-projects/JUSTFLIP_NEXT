import * as ProjectService from "@/src/services/ProjectService";
import PropertySupplyClient from "./PropertySupplyClient";

export default async function PropertySupply({
  type,
  typeName,
  typeId,
  data,
}: {
  type?: string;
  typeName?: string;
  typeId?: string | number;
  data?: any;
}) {
  const limit = 24;
  const page = 1;


  const inferredType = data?.zone ? "location" : data?.city ? "zone" : type;
  const resolvedType = type || inferredType;
  const resolvedTypeId = typeId || data?.id;

  const projects = await ProjectService.fetchExploreProjects({
    typeId: resolvedTypeId,
    type: resolvedType,
    limit,
    page,
  });

  const displayName = data?.name || typeName || (typeof data?.city === "string" ? data?.city : data?.city?.name) || "";

  return (
    <div className="">
      <PropertySupplyClient
        initialProjects={projects}
        typeName={resolvedType}
        typeId={resolvedTypeId}
        cityName={displayName}
      />
    </div>
  );
}
