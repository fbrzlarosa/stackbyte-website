import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = "Cron explainer: plain words and next runs";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Lab",
    title: "Cron explainer",
    subtitle: "What a cron expression means, and when it runs next. Runs in your browser.",
  });
}
