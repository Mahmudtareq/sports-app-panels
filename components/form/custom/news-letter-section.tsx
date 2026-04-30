"use client";
import React, { useState } from "react";

interface NewsletterSubscribeProps {
  onSubscribe?: (email: string) => void;
  className?: string;
}

const NewsLetterSection = ({
  onSubscribe,
  className = "",
}: NewsletterSubscribeProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {};

  return (
    <div className={`w-full  ${className}`}>
      <div className="">
        <div className="text-start sm:text-left">
          <h2 className="text-xl lg:text-2xl font-bold text-[#000] mb-4 dark:text-[#F9FAFB]">
            Subscribe to the Newsletter
          </h2>
          <p className="text-sm md:text-base text-[#6B7280] md:mb-10 mb-6 dark:text-[#9CA3AF]">
            Join our community and never miss new posts, ideas, and insights.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-3 sm:px-6 py-3 text-sm sm:text-base helvetica-neue-regular dark:border-[#F9FAFB]/20 border border-[#1F1F1F]/10 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1F1F1F]/10 focus:border-transparent transition-all"
            disabled={isSubmitting}
          />
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 sm:px-8 py-3 helvetica-neue-regular helvetica-neue-regular dark:text-[#111] bg-[#1F1F1F] dark:bg-[#F9FAFB] text-[#F9FAFB] text-base rounded-[10px] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </div>

        {message && (
          <p
            className={`mt-1 text-sm ${
              message.includes("Success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsLetterSection;
