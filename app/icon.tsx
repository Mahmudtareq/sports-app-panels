import { getAllSettingsDetails } from "@/actions/landing/landingActions";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Helper to check if URL is valid and absolute
function isValidUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export default async function Icon() {
  const generalSetting = await getAllSettingsDetails("general");
  const data = generalSetting?.data || {};
  const favicon = data?.favicon;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        // background: "#000000",
      }}
    >
      {/* Only render img if favicon is a valid absolute URL */}
      {isValidUrl(favicon) ? (
        <img src={favicon} width="28" height="28" />
      ) : (
        // Fallback: text/shape — no external image needed
        <div
          style={{
            color: "white",
            fontSize: 28,
            fontWeight: "bold",
            fontFamily: "sans-serif",
          }}
        >
          PH
        </div>
      )}
    </div>,
    { ...size },
  );
}
