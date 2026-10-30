import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import AiLogEntryCard from "@/components/AiLogEntryCard";
import { formatAiLogDate, getAiLogEntries, getAiLogEntry } from "@/lib/aiLog";

type Params = { slug: string };

export const dynamicParams = false;

export const generateStaticParams = (): Params[] =>
  getAiLogEntries().map(({ slug }) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const entry = getAiLogEntry((await params).slug);
  if (!entry) return {};

  const title = `${entry.title} — AI Log`;
  const description = entry.body[0];
  const url = `https://stackbyte.dev/ai-log/${entry.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, publishedTime: entry.date },
    twitter: { card: "summary_large_image", title, description },
  };
}

const Navbar = dynamic(() => import("@/components/Navbar"), { loading: () => null });
const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"), { loading: () => null });
const Footer = dynamic(() => import("@/components/Footer"), { loading: () => null });

export default async function AiLogEntryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const entries = getAiLogEntries();
  const index = entries.findIndex((entry) => entry.slug === slug);
  if (index === -1) notFound();

  const entry = entries[index];
  const newer = entries[index - 1];
  const older = entries[index + 1];

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="text-foreground selection:bg-primary/30 relative">
        <section className="mx-auto max-w-3xl px-4 pt-36 pb-16 sm:px-6">
          <Link
            href="/ai-log"
            className="text-xs uppercase tracking-wider font-semibold text-gray-400 hover:text-primary-light transition-colors"
          >
            ← AI Log: an AI agent is trying to make me famous
          </Link>

          <div className="mt-8">
            <AiLogEntryCard entry={entry} standalone />
          </div>

          <nav aria-label="Other entries" className="mt-10 grid gap-4 sm:grid-cols-2">
            {older ? (
              <Link
                href={`/ai-log/${older.slug}`}
                className="rounded-2xl border border-white/5 bg-white/5 p-4 hover:border-white/10 transition-colors"
              >
                <span className="text-xs text-gray-400">← Previous · {formatAiLogDate(older.date)}</span>
                <span className="mt-1 block text-gray-200">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link
                href={`/ai-log/${newer.slug}`}
                className="rounded-2xl border border-white/5 bg-white/5 p-4 text-right hover:border-white/10 transition-colors"
              >
                <span className="text-xs text-gray-400">{formatAiLogDate(newer.date)} · Next →</span>
                <span className="mt-1 block text-gray-200">{newer.title}</span>
              </Link>
            )}
          </nav>
        </section>
        <Footer />
      </main>
    </>
  );
}
