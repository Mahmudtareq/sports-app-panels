// lib/metadata.ts
import { Metadata } from "next";
import { PAGE_METADATA } from "./metadata-constants";

interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  noIndex?: boolean;
}

// Base site configuration
const SITE_CONFIG = {
  name: "Photography",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  defaultImage: "/images/og-default.jpg",
  twitterHandle: "@Photography",
};

/**
 * Generate complete metadata for any page
 */
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  noIndex = false,
}: MetadataConfig): Metadata {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const metadataImage = image || SITE_CONFIG.defaultImage;

  // Handle Cloudinary or absolute URLs
  const absoluteImageUrl =
    metadataImage.startsWith("http") || metadataImage.startsWith("/template-")
      ? metadataImage.startsWith("http")
        ? metadataImage
        : `${SITE_CONFIG.url}${metadataImage}`
      : `${SITE_CONFIG.url}${metadataImage}`;

  const pageUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    robots: noIndex ? "noindex,nofollow" : "index,follow",

    openGraph: {
      type: "website",
      locale: "en_US",
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      title: fullTitle,
      description,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteImageUrl],
      creator: SITE_CONFIG.twitterHandle,
    },

    alternates: {
      canonical: pageUrl,
    },
  };
}

/**
 * Generate metadata from API data with fallback
 */
export async function generatePageMetadataFromAPI(
  pageKey: keyof typeof PAGE_METADATA,
  apiData: {
    title: string;
    description: string;
    keywords?: string[];
    image?: string;
  } | null,
): Promise<Metadata> {
  // Use API data if available, otherwise fallback to constants
  const metadataConfig = apiData || PAGE_METADATA[pageKey];

  return generatePageMetadata(metadataConfig);
}
