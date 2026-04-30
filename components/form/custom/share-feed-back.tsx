import { Icons } from "./icons";

interface FeedbackSectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  backgroundImage?: string;
  className?: string;
}

const ShareFeedBack = ({
  title = "We'd love to hear from you!",
  description = "Have thoughts, ideas, or feedback? We'd love to hear from you. Share your voice and help us grow together.",
  buttonText = "Share your Feedback",
  onButtonClick,
  backgroundImage = "/images/feed-back/feed-back-cruve.svg",
  className = "",
}: FeedbackSectionProps) => {
  return (
    <div
      className={`w-full max-w-[1320px] mx-auto py-8 px-4 sm:px-6 lg:px-4 ${className}`}
    >
      <div className="relative bg-[#F1F2F4] dark:bg-[#FFFFFF]/5 rounded-[20px] py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-12 overflow-hidden">
        {/* Background Wave Pattern */}
        <div
          className="absolute inset-0 opacity-50 dark:opacity-10 -left-15"
          style={{
            backgroundImage: `url("${backgroundImage}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "left center",
            backgroundSize: "contain",
          }}
        ></div>

        {/* Decorative circles on the right */}
        <div className="">
          <div className="opacity-100 absolute right-[145px] top-[12px] -translate-y-1/3 ">
            <Icons.feedBack1 className="dark:text-[#F9FAFB] text-[#1F1F1F]" />
          </div>
          <div className=" opacity-100 absolute right-8 bottom-1/3 -translate-y-1/2 ">
            <Icons.feedBack2 className="dark:text-[#F9FAFB] text-[#1F1F1F]" />
          </div>
          <div className=" opacity-100 absolute right-[287px] bottom-4 -translate-y-1/2 ">
            <Icons.feedBack3 className="dark:text-[#F9FAFB] text-[#1F1F1F]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10  max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-2xl    text-[#1F1F1F] dark:text-[#F9FAFB] mb-4 helvetica-neue-medium">
            {title}
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mb-10 max-w-2xl mx-auto helvetica-neue-regular">
            {description}
          </p>

          <button className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[#1F1F1F] dark:bg-[#F9FAFB] text-[#FFFFFF] dark:text-[#1F1F1F] text-sm sm:text-base rounded-lg hover:bg-[#000000] dark:hover:bg-[#E5E7EB] transition-all duration-300 shadow-md hover:shadow-lg helvetica-neue-medium">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareFeedBack;
