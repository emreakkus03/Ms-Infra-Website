/** Only public HTTP(S) media and local paths from the CMS are navigable. */
export function safeContentUrl(value: string | null | undefined): string | undefined {
  if (!value || /[\\\u0000-\u0020\u007f]/.test(value)) return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : undefined;
  } catch {
    return undefined;
  }
}
