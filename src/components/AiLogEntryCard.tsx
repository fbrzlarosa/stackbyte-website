import Link from "next/link";
import { formatAiLogDate, type AiLogPost } from "@/lib/aiLog";

type AiLogEntryCardProps = {
  entry: AiLogPost;
  // On the index the title links to the entry's own page; on that page it is the h1.
  standalone?: boolean;
};

export default function AiLogEntryCard({ entry, standalone = false }: AiLogEntryCardProps) {
  const Heading = standalone ? "h1" : "h2";

  return (
    <article className="rounded-2xl border border-white/5 bg-white/5 p-6 hover:border-white/10 transition-colors">
      <time dateTime={entry.date} className="font-mono text-xs uppercase tracking-wider text-primary">
        {formatAiLogDate(entry.date)}
      </time>
      <Heading
        className={
          standalone ? "mt-2 text-3xl font-bold tracking-tight sm:text-4xl" : "mt-2 text-2xl font-semibold"
        }
      >
        {standalone ? (
          entry.title
        ) : (
          <Link href={`/ai-log/${entry.slug}`} className="hover:text-primary-light transition-colors">
            {entry.title}
          </Link>
        )}
      </Heading>
      <div className="mt-4 space-y-3 text-gray-300">
        {entry.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {entry.metrics && entry.metrics.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {entry.metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-white/5 bg-background/60 p-3">
              <dt className="text-xs text-gray-400">{metric.label}</dt>
              <dd className="mt-1 font-mono text-lg text-foreground">{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {entry.links && entry.links.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {entry.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                className="text-primary-light hover:text-primary transition-colors"
                target={link.url.startsWith("/") ? undefined : "_blank"}
                rel={link.url.startsWith("/") ? undefined : "noopener noreferrer"}
              >
                {link.label} →
              </a>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
