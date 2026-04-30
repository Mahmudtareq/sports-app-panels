import { cn } from "@/lib/utils";
import { Icons } from "./icons";

interface PostMetaInfoProps {
  date: string;
  readTime: string;
  className?: string;
  iconSize?: number; // optional for flexibility
}

const PostMetaInfo = ({
  date,
  readTime,
  className,
  iconSize = 20,
}: PostMetaInfoProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-start text-[#6B7280] dark:text-gray-400 text-base lg:gap-x-2 gap-x-1 mt-auto",
        className
      )}
    >
      {/* Date */}
      <div className="flex items-center gap-x-1">
        <Icons.calendar2 className={`w-[${iconSize}px] h-[${iconSize}px]`} />
        <span className="helvetica-neue-regular lg:leading-[30px] lg:text-base md:text-sm text-[13px]">
          {date}
        </span>
      </div>

      {/* Divider */}
      <Icons.circle className="md:w-[10px] w-[8px] h-[8px] md:h-[10px]" />

      {/* Read Time */}
      <div className="flex items-center gap-x-1">
        <Icons.clockTime
          className={`lg:w-[20px] lg:h-[20px] md:w-[18px] w-[16px] md:h-[18px] h-[16px]`}
        />
        <span className="helvetica-neue-regular lg:leading-[30px] lg:text-base md:text-sm text-[13px]">
          {readTime}
        </span>
      </div>
    </div>
  );
};

export default PostMetaInfo;
