import React from "react";
import { Button } from "../ui/button";
import { Icons } from "./icons";

const LoadMoreBlogs = () => {
  return (
    <div>
      <Button
        className="border rounded-[10px] border-[#6B7280] helvetica-neue-regular text-base leading-7 hover:bg-transparent hover:text-[#6B7280] text-[#6B7280] bg-[#F9FAFB] dark:border-[#9CA3AF] dark:bg-[#111]"
        variant="outline"
      >
        More Blogs{" "}
        <span>
          <Icons.arrowRight className="dark:text-[#9CA3AF]" />
        </span>
      </Button>
    </div>
  );
};

export default LoadMoreBlogs;
