import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = "Lab: small developer tools that run in your browser";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Lab",
    title: "Small tools, no strings attached",
    subtitle: "Developer tools that run entirely in your browser. No sign-up, no tracking.",
  });
}
