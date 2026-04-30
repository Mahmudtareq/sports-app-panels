import { getAllSettingsDetails } from "@/actions/landing/landingActions";
import { generatePageMetadataFromAPI } from "@/lib/metadata";
import { Metadata } from "next";
import type React from "react";
export async function generateMetadata(): Promise<Metadata> {
  // Fetch metadata from API
  const apiMetadata = await getAllSettingsDetails("metadata");
  // Generate metadata with API data or fallback
  return generatePageMetadataFromAPI("HOME", apiMetadata?.data);
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAllSettingsDetails("general");

  const company = settings?.data?.companyName || "";
  return (
    <div className="min-h-screen flex flex-col">
      <main className="grow">{children}</main>
    </div>
  );
}
