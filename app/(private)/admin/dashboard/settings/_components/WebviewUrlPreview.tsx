// ── Live base64 preview ────────────────────────────────────────────────────
export function WebviewUrlPreview({ webviewUrl }: { webviewUrl: string }) {
  if (!webviewUrl) return null;

  const encoded = (() => {
    try {
      return btoa(webviewUrl.trim());
    } catch {
      return "Invalid URL";
    }
  })();

  return (
    <div className="rounded-md border border-dashed p-3 space-y-1 bg-muted/40">
      <p className="text-xs font-medium text-muted-foreground">
        Base64 preview — what the mobile app receives
      </p>
      <p className="text-xs font-mono break-all text-primary">{encoded}</p>
    </div>
  );
}
