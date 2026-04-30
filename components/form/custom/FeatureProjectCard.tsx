import { routes } from "@/config/routes";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FeatureProjectCard = ({ story }: any) => {
  return (
    <div className="relative group overflow-hidden max-w-315.5 max-h-140 mx-auto">
      <Image
        alt="product/image"
        src={story?.image || "/images/story-feature/feature-story-image.webp"}
        width={700}
        height={700}
        className="w-full h-full"
      />
      <p className="absolute bottom-4 text-[28px] text-[#F0F0F0] urbanist-semibold pl-4 group-hover:hidden md:block hidden ">
        {story?.title || "Edge of Silence"}
      </p>
      <div
        className="md:hidden block absolute bottom-0 left-0 w-full py-4 px-3 
             backdrop-blur-sm"
        style={{
          background:
            "linear-gradient(90deg, rgba(26, 26, 26, 0.85) 0%, rgba(26, 26, 26, 0.55) 50%, rgba(26, 26, 26, 0.00) 100%)",
        }}
      >
        <div className="flex items-center justify-between w-full">
          <p className="text-base text-[#F0F0F0] font-urbanist font-semibold leading-normal">
            {story?.title || "Edge of Silence"}
          </p>
          <Link
            href={routes.publicRoutes.storyDetails(story?.slug || "")}
            className="text-[11px] text-[#FEFEFD] flex gap-1 font-dm-sans uppercase font-semibold items-center"
          >
            View full project{" "}
            <ArrowUpRight className="md:w-6 md:h-6 w-4 h-4 text-[#FEFEFD]" />
          </Link>
        </div>
      </div>

      <div className="hidden md:block">
        <div
          className="flex items-canter justify-between  text-white absolute bottom-0 w-full pt-3.75 pb-5 px-4 -translate-x-full group-hover:translate-x-0 transition-all duration-700 ease-in-out overflow-hidden"
          style={{
            background:
              "linear-gradient(90deg, rgba(26, 26, 26, 0.85) 0%, rgba(26, 26, 26, 0.55) 50%, rgba(26, 26, 26, 0.00) 100%)",
          }}
        >
          <h4 className="text-[28px] text-[#F0F0F0] font-urbanist -translate-x-12.5 group-hover:translate-x-0 transition-all duration-700 font-semibold leading-normal  opacity-0 group-hover:opacity-100">
            {story?.title || "Edge of Silence"}
          </h4>

          <Link
            href={routes.publicRoutes.storyDetails(story?.slug || "")}
            className="text-base -translate-x-25 text-[#FEFEFD] flex gap-1.5 font-dm-sans font-semibold uppercase items-center group-hover:translate-x-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
          >
            View full project <ArrowUpRight className="md:w-6 md:h-6 w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureProjectCard;
