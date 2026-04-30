import { cn } from "@/lib/utils";
import Image from "next/image";
import PostMetaInfo from "./post-meta-info";
import Link from "next/link";

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
  imageWidth?: string;
  imageHeight?: string;
  aspectRatio?: string; // Example: "837/395" or "16/9"
  slug?: string; // Example: "837/395" or "16/9"
}

const ReusableSidebarComponent = ({
  image,
  tagLabel,
  tagColor = "#2D2D2D",
  title,
  description,
  date,
  readTime,
  className,
  imageWidth = "",
  imageHeight = "",
  aspectRatio = "",
  slug,
}: TrendingImageProps) => {
  return (
    <Link
      href={`/blog-details/${slug}`}
      className={cn(
        "bg-[#F9FAFB] dark:bg-[#111] dark:border-gray-700 overflow-hidden items-start w-full md:gap-4 gap-2 flex rounded-[10px]",
        className
      )}
    >
      {/* Image Section */}
      <div
        className={cn(
          "relative overflow-hidden rounded-[10px] flex-shrink-0",
          imageHeight || "h-[100px] md:h-[155px]",
          imageWidth || "w-[120px] md:w-[189px]"
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 120px, 189px"
          className="object-cover transition-transform duration-300"
        />

        {/* Dynamic Tag */}
        {tagLabel && (
          <span
            className="absolute top-2 left-2 md:top-3 md:left-3 text-[11px] md:text-[13px] helvetica-neue-regular text-[#F9FAFB] px-2 py-1 md:px-3 rounded-[6px]"
            style={{ backgroundColor: tagColor }}
          >
            {tagLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col w-full min-w-0 py-1">
        <h3 className="text-sm md:text-lg helvetica-neue-medium text-[#1F1F1F] font-bold dark:text-[#F9FAFB] mb-1 md:mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-xs md:text-base text-[#6B7280] helvetica-neue-regular dark:text-gray-300 leading-relaxed md:leading-7 line-clamp-2 md:line-clamp-3 mb-1 md:mb-2">
          {description}
        </p>

        <PostMetaInfo date={date} readTime={readTime} />
      </div>
    </Link>
  );
};

export default ReusableSidebarComponent;
