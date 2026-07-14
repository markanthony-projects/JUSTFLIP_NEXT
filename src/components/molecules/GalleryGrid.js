import Image from "@/src/components/atoms/Image";

export default function GalleryGrid({ images }) {
  const displayedImages = images.slice(0, 5);
  return (
    <div className="grid grid-flow-row md:grid-cols-3">

      <div className="col-span-2">
        {displayedImages[0] && (
          <div className="w-full flex flex-wrap">
            <Image
              src={displayedImages[0]}
              alt="Gallery main"
              priority={true}
              className="object-fill w-full lg:h-96 max-w-full h-44 md:h-96 p-1 rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="col-span-1">
        <div className="flex flex-wrap">
          {displayedImages.slice(1).map((img, index) => (
            <div key={index} className="p-1 w-1/2 md:h-48">
              <Image
                src={img}
                alt={`gallery-${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}