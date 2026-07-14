import Image from "@/src/components/atoms/Image";

export default function FeatureItem({ item }) {
    return (
        <div className="p-2 w-full sm:w-1/2 lg:w-1/4 flex items-center gap-2">
            {item?.image && (
                <div className="relative w-6 h-6">
                    <Image src={item.image} alt={item.name || "feature"} sizes="24px" className="object-contain" />
                </div>
            )}
            <span className="text-sm text-gray-700">{item?.name}</span>
            <div className="border border-gray-300" />
        </div>
    );
}