import React from "react";
import SocialLinks from "../shared/SocialLinks";
interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

interface AuthorBioProps {
  authorImage: string;
  authorName?: string;
  authorTitle?: string;
  authorBio?: string;
  socialLinks?: SocialLink[];
  className?: string;
}

const MeetAuthorSection = ({
  authorImage,
  authorName = "",
  authorTitle = "",
  authorBio = "",
  socialLinks = [],
  className = "",
}: AuthorBioProps) => {
  return (
    <div
      className={`w-full max-w-[1320px] rounded-[20px] mx-auto py-[60px] px-4 sm:px-6 lg:px-4 ${className}`}
    >
      <div className="bg-[#F1F2F3] dark:bg-[#FFFFFF08] rounded-[20px] p-8 sm:p-12 lg:py-16 lg:px-20 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-16 relative z-10">
          {/* Author Image Section */}
          <div className="flex-shrink-0 relative">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
              {/* Dotted background decoration - positioned behind and to the left */}
              <div
                className='absolute -left-8 top-8 w-full h-full bg-[url("/images/author/author-bg-dot.svg")] bg-no-repeat bg-left-top opacity-100'
                style={{ backgroundSize: "auto 80%" }}
              ></div>

              {/* Main image */}
              <div className="relative w-full h-full  rounded-full overflow-hidden bg-white shadow-xl z-10">
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 text-center lg:text-left relative">
            <p className="text-[15px] sm:text-base text-[#6B7280] helvetica-neue-regular mb-2">
              Meet The Author
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] text-[#000] dark:text-[#F9FAFB] mb-3 helvetica-neue-medium leading-tight">
              {authorName}
            </h2>
            <p className="text-base md:text-lg text-[#6B7280] dark:text-[#9CA3AF] helvetica-neue-regular mb-6">
              {authorTitle}
            </p>

            <p className="text-[15px] sm:text-base text-[#1F1F1F] dark:text-[#E5E7EB] helvetica-neue-regular leading-7 mb-8">
              {authorBio}
            </p>

            <div className="inline-block">
              <SocialLinks
                bgColor="bg-[#1F1F1F] dark:bg-[#F9FAFB]"
                iconColor="text-[#F9FAFB] dark:text-[#111]"
              />
            </div>

            {/* Decorative curve image - positioned at bottom right */}
            <div
              className='absolute -right-12 -bottom-12 lg:-right-[140px] lg:-bottom-[130px] w-[350px] h-[380px] lg:w-[400px] lg:h-[400px] bg-[url("/images/author/cruve-image.svg")] bg-no-repeat bg-center  pointer-events-none hidden lg:block'
              style={{ backgroundSize: "contain" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetAuthorSection;
