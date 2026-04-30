import Image from "next/image";
import PostMetaInfo from "./post-meta-info";
import { cn } from "@/lib/utils";

interface TrendingImageProps {
  image: string;
  tagLabel?: string;
  tagColor?: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  className?: string;

  // ✅ Dynamic image sizing
  imageWidth?: number;
  imageHeight?: number;
  aspectRatio?: string; // Example: "837/395" or "16/9"
}

const SingleImageComponents = ({
  image,
  tagLabel,
  tagColor = "#2D2D2D",
  title,
  description,
  date,
  readTime,
  className,
  imageWidth = 800,
  imageHeight = 400,
  aspectRatio = "837/395",
}: TrendingImageProps) => {
  return (
    <div
      className={cn(
        "bg-[#F9FAFB] dark:bg-[#111] dark:border-gray-700 overflow-hidden transition-all duration-300 w-full mx-auto flex flex-col rounded-[10px]",
        className
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-[10px]",
          `aspect-[${aspectRatio}]`
        )}
      >
        <Image
          src={image}
          alt={title}
          width={imageWidth}
          height={imageHeight}
          className="object-cover h-full w-full transition-transform duration-300"
        />

        {/* Dynamic Tag */}
        {tagLabel && (
          <span
            className="absolute top-6 left-5 text-[13px] helvetica-neue-regular text-[#F9FAFB] px-3 py-1 rounded-[6px]"
            style={{ backgroundColor: tagColor }}
          >
            {tagLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow mt-3">
        <h3 className="md:text-2xl text-xl helvetica-neue-medium text-[#1F1F1F] dark:text-[#F9FAFB] mb-1 line-clamp-2">
          {title}
        </h3>

        <p className="text-base text-[#6B7280] helvetica-neue-regular dark:text-gray-300 leading-7 line-clamp-3">
          {description}
        </p>

        <PostMetaInfo date={date} readTime={readTime} />
      </div>
    </div>
  );
};

export default SingleImageComponents;
