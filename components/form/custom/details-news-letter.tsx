"use client";
import React, { useState } from "react";

interface NewsletterSubscribeProps {
  onSubscribe?: (email: string) => void;
  className?: string;
}

const DetailsNewsLetter = ({
  onSubscribe,
  className = "",
}: NewsletterSubscribeProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {};
  return (
    <div className={`w-full max-w-[600px] ${className}`}>
      <div className="text-start sm:text-left mb-6">
        <h2 className="text-xl lg:text-[24px] helvetica-neue-bold text-[#000] mb-3 dark:text-[#F9FAFB]">
          Subscribe to the Newsletter
        </h2>
        <p className="text-sm md:text-base text-[#6B7280] dark:text-[#9CA3AF] leading-relaxed">
          Join our community and never miss new posts, ideas, and insights.
        </p>
      </div>

      <div className="flex gap-3  flex-wrap">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="lg:flex-1 lg:px-2 xl:px-4 px-4 md:px-2 py-3 text-sm md:text-base helvetica-neue-regular text-[#1F1F1F] dark:text-[#F9FAFB] bg-white dark:bg-[#111] border border-[#E5E7EB] dark:border-[#374151] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#1F1F1F] dark:focus:ring-[#F9FAFB] focus:border-transparent transition-all placeholder:text-[#9CA3AF]"
          disabled={isSubmitting}
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-4  py-3 helvetica-neue-medium bg-[#1F1F1F] dark:bg-[#F9FAFB] text-[#F9FAFB] dark:text-[#1F1F1F] text-sm md:text-base rounded-[10px] hover:bg-[#000] dark:hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1F1F1F] dark:focus:ring-[#F9FAFB] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-3 text-sm helvetica-neue-regular ${
            message.includes("Success")
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default DetailsNewsLetter;
