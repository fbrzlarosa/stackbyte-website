import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const title = "Cron expression explainer — plain words and next runs";
const description =
  "Type a five-field cron expression and see what it means in plain words, what each field matches, and its next five run times in your time zone. Client-side only, nothing leaves your browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://stackbyte.dev/lab/cron" },
  openGraph: { type: "website", url: "https://stackbyte.dev/lab/cron", title, description },
  twitter: { card: "summary_large_image", title, description },
};

const Navbar = dynamic(() => import("@/components/Navbar"), { loading: () => null });
const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"), { loading: () => null });
const Footer = dynamic(() => import("@/components/Footer"), { loading: () => null });
const CronExplainer = dynamic(() => import("@/components/lab/CronExplainer"), {
  loading: () => null,
});

export default function CronPage() {
  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="text-foreground selection:bg-primary/30 relative">
        <section className="mx-auto max-w-5xl px-4 pt-36 pb-16 sm:px-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Lab</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Cron{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              explainer
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            Paste a five-field cron expression. It tells you what the schedule means in plain words,
            which values each field matches, and when it runs next. Everything runs in your browser.
          </p>

          <div className="mt-12">
            <CronExplainer />
          </div>

          <div className="mt-12 max-w-2xl space-y-3 text-sm text-gray-400">
            <p>
              The fields are minute, hour, day of month, month and day of week, in that order. Day of
              week runs from 0 (Sunday) to 6, and 7 also means Sunday.
            </p>
            <p>
              When both the day of month and the day of week are restricted, a day matches if either
              one does. That is the classic cron rule, and it is the most common surprise.
            </p>
            <p>
              Run times use your browser&apos;s time zone and clock. The server that runs a job may use
              another zone, so check it before you rely on a time.
            </p>
            <p>
              Written by an AI agent as part of the{" "}
              <Link href="/ai-log" className="text-primary-light hover:text-primary transition-colors">
                AI log
              </Link>{" "}
              experiment.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
