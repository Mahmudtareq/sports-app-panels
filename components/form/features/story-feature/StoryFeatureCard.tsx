import { Separator } from "@/components/ui/separator";
import { routes } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";

const StoryFeatureCard = ({ item }: any) => {
  return (
    <div>
      <div className="border border-[#DDD] dark:border-slate-700 max-w-101.75 max-h-114.5 h-full w-full ">
        {/* product image */}
        <div className="relative group w-full h-75 overflow-hidden">
          <Image
            alt="product/image"
            src={item?.image || ""}
            width={500}
            height={500}
            className="w-full h-full"
          />
          {/* <p className="absolute bottom-4 text-[28px] text-[#F0F0F0] urbanist-semibold pl-4 group-hover:hidden md:block hidden ">
            {item?.title || ""}
          </p> */}
          <div
            className="md:hidden block absolute bottom-0 left-0 w-full py-4 px-3 
             backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(90deg, rgba(26, 26, 26, 0.85) 0%, rgba(26, 26, 26, 0.55) 50%, rgba(26, 26, 26, 0.00) 100%)",
            }}
          >
            <div className="flex items-center justify-between w-full">
              <p className="text-base text-[#F0F0F0] urbanist-semibold">
                {item?.title || ""}
              </p>
              <Link
                href={routes.publicRoutes.storyDetails(item?.slug || "")}
                className="text-[11px] text-[#F0F0F0] flex gap-1 font-dm-sans font-semibold uppercase items-center"
              >
                View full project{" "}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M4.6665 5.1665H11.3332M11.3332 5.1665V11.8332M11.3332 5.1665L4.6665 11.8332"
                      stroke="#FEFEFD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <div
              className="flex flex-col items-start  text-white absolute bottom-0 w-full pt-3.75 pb-5 px-4 -translate-x-full group-hover:translate-x-0 transition-all duration-700 ease-in-out overflow-hidden"
              style={{
                background:
                  "linear-gradient(90deg, rgba(26, 26, 26, 0.85) 0%, rgba(26, 26, 26, 0.55) 50%, rgba(26, 26, 26, 0.00) 100%)",
              }}
            >
              <h3 className="text-[28px] text-[#F0F0F0] urbanist-semibold -translate-x-12.5 group-hover:translate-x-0 transition-all duration-700 font-bold  opacity-0 group-hover:opacity-100">
                {item?.title || ""}
              </h3>

              <Link
                href={routes.publicRoutes.storyDetails(item?.slug || "")}
                className="text-base -translate-x-25 flex gap-1 font-dm-sans font-semibold uppercase items-center group-hover:translate-x-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
              >
                View full project{" "}
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M4.6665 5.1665H11.3332M11.3332 5.1665V11.8332M11.3332 5.1665L4.6665 11.8332"
                      stroke="#FEFEFD"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* product details */}
        <div className="py-6 px-3">
          <p className=" dark:text-[#abc2d3] text-lg dmSans-medium leading-6 line-clamp-2">
            {item?.description || ""}
          </p>
          <Separator className="my-2" />

          {/* authors & reviews */}
          <div className="flex items-center justify-between pt-4.5">
            <p className="font-dm-sans font-medium text-lg leading-6 text-[#6B6B6B]">
              PHOTOGRAPHY BY
            </p>
            <span className="font-dm-sans font-bold text-lg">
              {item?.photographer || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryFeatureCard;
