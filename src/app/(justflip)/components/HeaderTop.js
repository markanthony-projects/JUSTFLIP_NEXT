import Image from "@/src/components/atoms/Image";
import { SkeletonBlock } from "./Skelton/SkeletonSection";

export default function HeaderTop({ data, bannerImage , zone=false }) {
  return (
    <div>
      <div className="grid grid-flow-col justify-between items-end relative space-y-2">
        <div className="p-1 lg:text-[36px] text-[#002B5B] font-[500]">
        {zone ? `${data?.city?.name} - ${data?.name}` : data?.name || <SkeletonBlock className="h-[36px] w-40" />}
         
        </div>
        <div className="relative w-[180px] h-[60px] md:w-[300px] md:h-[100px]">
          <Image src={bannerImage?.url} alt="location image" fill className="object-cover" priority sizes="(max-width: 768px) 180px, 300px" quality={100} placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=" />
        </div>
      </div>

      <div className="border-b-[0.7px] border-[#696A6C] block relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-[#696A6C] rounded-full"></div>
      </div>
      <p className="text-[#333333] text-justify text-[12px] leading-[16.8px] font-normal my-2 py-4 md:py-8 min-h-25">
        {data?.description || <SkeletonBlock className="h-25 w-full" />}
      </p>
    </div>
  );
}