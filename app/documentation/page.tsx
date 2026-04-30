import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — Photography Portfolio & CMS",
  description:
    "Complete documentation for the Photography Portfolio & CMS template. Covers installation, environment setup, project structure, API reference, and deployment.",
};

export default function DocumentationPage() {
  return (
    <iframe
      src="/documentation.html"
      title="Documentation"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        border: "none",
        display: "block",
      }}
    />
  );
}
