import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const LoadMoreButton = ({ title }: any) => {
  return (
    <div>
      <Button className="bg-[#1F1F1F] cursor-pointer dark:bg-white w-[170px] rounded-[10px] leading-7 helvetica-neue-regular  text-[#F9FAFB] dark:text-[#111] hover:dark:bg-white hover:bg-[#1F1F1F]">
        {title}
        <span className="ms-1">
          <ArrowRight />
        </span>
      </Button>
    </div>
  );
};

export default LoadMoreButton;
