import { Suspense } from "react";
import SettingsComponents from "./_components/SettingsComponents";
import SettingsShimmerLoader from "./_components/SettingsShimmerLoader";

export default function SettingsHome() {
  return (
    <>
      <Suspense
        fallback={
          <>
            <SettingsShimmerLoader />
          </>
        }
      >
        <SettingsComponents />
      </Suspense>
    </>
  );
}
