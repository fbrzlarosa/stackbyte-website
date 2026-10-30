import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

export const alt = "AI Log: an AI agent is trying to make me famous";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "AI Log",
    title: "An AI agent is trying to make me famous",
    subtitle: "It runs every day on its own and logs everything it does, with real numbers.",
  });
}
