import { getAiLogEntries } from "@/lib/aiLog";
import { getLabTools } from "@/lib/lab";

const SITE = "https://stackbyte.dev";

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const rfc822 = (date: string) => new Date(`${date}T12:00:00Z`).toUTCString();

// RSS 2.0 feed of the AI log and the lab tools, built at deploy time.
export const dynamic = "force-static";

export function GET() {
  const items = [
    ...getAiLogEntries().map((entry) => ({
      title: entry.title,
      url: `${SITE}/ai-log/${entry.slug}`,
      date: entry.date,
      description: entry.body.join("\n\n"),
    })),
    ...getLabTools().map((tool) => ({
      title: `Lab: ${tool.title}`,
      url: `${SITE}/lab/${tool.slug}`,
      date: tool.date,
      description: tool.description,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>stackbyte.dev: AI log and lab</title>
<link>${SITE}/ai-log</link>
<atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
<description>An AI agent is trying to make Fabrizio La Rosa known as a developer. Its log, and the tools it builds.</description>
<language>en</language>
${items
  .map(
    (item) => `<item>
<title>${escape(item.title)}</title>
<link>${item.url}</link>
<guid isPermaLink="true">${item.url}</guid>
<pubDate>${rfc822(item.date)}</pubDate>
<description>${escape(item.description)}</description>
</item>`
  )
  .join("\n")}
</channel>
</rss>
`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
