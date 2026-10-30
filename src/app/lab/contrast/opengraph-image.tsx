import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = "Contrast checker: WCAG ratio for any two colours";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Lab",
    title: "Contrast checker",
    subtitle: "WCAG AA and AAA for any two colours. Runs in your browser.",
  });
}
