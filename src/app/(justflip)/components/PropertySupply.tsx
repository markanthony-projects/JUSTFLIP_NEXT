import * as ProjectService from "@/src/services/ProjectService";
import PropertySupplyClient from "./PropertySupplyClient"

export default async function PropertySupply({ type, typeName, typeId, data }: { type?: string; typeName?: string; typeId?: string | number | string[]; data?: any }) {
  const limit = 24
  const page = 1

  const explicitType = typeName || type
  const inferredType = data?.zone ? "location" : data?.city ? "zone" : explicitType
  const resolvedType = explicitType || inferredType
  const rawTypeId = typeId || data?.id

  const resolvedTypeId = Array.isArray(rawTypeId)
    ? rawTypeId[0]
    : typeof rawTypeId === "string" && rawTypeId.includes(",")
    ? rawTypeId.split(",")[0].trim()
    : rawTypeId;  

  const projects = await ProjectService.fetchExploreProjects({
    typeId: resolvedTypeId,
    type: resolvedType,
    limit,
    page
  });

  return (
    <div className="">
      <PropertySupplyClient
        initialProjects={projects}
        typeName={resolvedType}
        typeId={resolvedTypeId}
      />
    </div>
  );
}

// import * as ProjectService from "@/src/services/ProjectService";
// import PropertySupplyClient from "./PropertySupplyClient";

// export default async function PropertySupply({
//   type,
//   typeName,
//   typeId,
//   data,
// }: {
//   type?: string;
//   typeName?: string;
//   typeId?: string | number | string[];
//   data?: any;
// }) {
//   const limit = 24;
//   const page = 1;

//   // Resolve type naming across props and inferred data
//   const explicitType = typeName || type;
//   const inferredType = data?.zone ? "location" : data?.city ? "zone" : explicitType;
//   const resolvedType = explicitType || inferredType;

//   const rawTypeId = typeId || data?.id;

//   // Extract a single ID whether rawTypeId is an array, comma-separated string, or scalar
//   const resolvedTypeId = Array.isArray(rawTypeId)
//     ? rawTypeId[0]
//     : typeof rawTypeId === "string" && rawTypeId.includes(",")
//     ? rawTypeId.split(",")[0].trim()
//     : rawTypeId;

//   const projects = await ProjectService.fetchExploreProjects({
//     typeId: resolvedTypeId,
//     type: resolvedType,
//     limit,
//     page,
//   });

//   return (
//     <div>
//       <PropertySupplyClient
//         initialProjects={projects}
//         typeName={resolvedType}
//         typeId={resolvedTypeId}
//       />
//     </div>
//   );
// }
