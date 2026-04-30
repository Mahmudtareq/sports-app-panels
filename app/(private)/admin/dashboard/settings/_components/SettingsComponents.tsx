import {
  getCloudinary,
  getGeneralSettings,
  getMetadata,
  getPageBanner,
  getTermsPolicy,
} from "@/actions/settings/settingsActions";
import { DynamicBreadcrumb } from "./DynamicBreadcrumb";
import TabsSettings from "./TabsSettings";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin/dashboard" },
  { label: "General Setting" },
];

export default async function SettingsComponents() {
  const cloudinary = await getCloudinary();
  const generalSettings = await getGeneralSettings();
  const metadata = await getMetadata();
  const bannerPage = await getPageBanner();
  const termsPolicy = await getTermsPolicy();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-3 font-bold">Settings</h1>
          <DynamicBreadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <TabsSettings
        cloudinary={cloudinary?.data || []}
        generalSettings={generalSettings?.data || []}
        metadata={metadata?.data || []}
        pageBanner={bannerPage?.data || []}
        termsPolicy={termsPolicy?.data || []}
      />
    </div>
  );
}
