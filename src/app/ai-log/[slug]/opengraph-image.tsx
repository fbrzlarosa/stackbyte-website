import { formatAiLogDate, getAiLogEntries, getAiLogEntry } from "@/lib/aiLog";
import { ogContentType, ogSize, renderOgImage } from "@/lib/ogImage";

type Params = { slug: string };

export const alt = "An entry of the AI Log on stackbyte.dev";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;

export const generateStaticParams = (): Params[] =>
  getAiLogEntries().map(({ slug }) => ({ slug }));

export default async function Image({ params }: { params: Promise<Params> }) {
  const entry = getAiLogEntry((await params).slug);

  return renderOgImage({
    eyebrow: entry ? `AI Log · ${formatAiLogDate(entry.date)}` : "AI Log",
    title: entry?.title ?? "An AI agent is trying to make me famous",
    subtitle: "An AI agent is trying to make me famous. This is its log.",
  });
}
