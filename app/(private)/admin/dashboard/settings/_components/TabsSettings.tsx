"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaSlidersH } from "react-icons/fa";
import GeneralSettings from "./GeneralSettings";

export default function TabsSettings({ generalSettings }: any) {
  const [activeTab, setActiveTab] = useState("general");
  const tabs = [
    { id: "general", label: "General", icon: FaSlidersH },
    // { id: "banner", label: "Banner", icon: FaImage },
    // { id: "cloudinary", label: "Cloudinary", icon: SiCloudinary },
    // { id: "metaData", label: "Metadata", icon: FaFileCode },
    // { id: "terms", label: "Terms & Conditions", icon: FaFileContract },
    // { id: "policy", label: "Privacy Policy", icon: Shield },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings general={generalSettings} />;
      // case "banner":
      //   return <HeroPageBanner pageBanner={pageBanner} />;
      // case "cloudinary":
      //   return <CloudinarySettings cloudinary={cloudinary} />;
      // case "metaData":
      //   return <MetadataSettings metadata={metadata} />;
      // case "terms":
      //   return <TermsConditions termsPolicy={termsPolicy} />;
      // case "policy":
      //   return <PrivacyPolicy termsPolicy={termsPolicy} />;
      default:
        return (
          <div>
            {" "}
            <p>No Page </p>
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen  p-4 md:p-8">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <nav className="space-y-1 bg-white dark:bg-gray-800 rounded-lg shadow p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-sm text-left transition-colors cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-primary dark:hover:bg-primary hover:text-white"
                    }`}
                  >
                    {/* <Icon className="h-5 w-5" /> */}
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Navigation - Icons Only with Tooltips */}
          <TooltipProvider>
            <div className="lg:hidden bg-white dark:bg-gray-800 rounded-lg shadow mb-4 overflow-x-scroll scrollbar scrollbar-thumb-gray-400 scrollbar-track-transparent scrollbar-thin">
              <nav className="flex items-center gap-2 p-2 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <Tooltip key={tab.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`shrink-0 p-3 rounded-sm transition-colors ${
                            activeTab === tab.id
                              ? "bg-primary text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-primary dark:hover:bg-primary hover:text-white"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tab.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </nav>
            </div>
          </TooltipProvider>

          {/* Content Area */}
          <main className="flex-1">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}
