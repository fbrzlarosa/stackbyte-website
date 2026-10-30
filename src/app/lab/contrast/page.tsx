import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const title = "Contrast checker — WCAG ratio for any two colours";
const description =
  "A small, client-side WCAG contrast checker. Pick a text and a background colour, see the ratio and whether it passes AA or AAA for normal and large text. Nothing leaves your browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://stackbyte.dev/lab/contrast" },
  openGraph: { type: "website", url: "https://stackbyte.dev/lab/contrast", title, description },
  twitter: { card: "summary_large_image", title, description },
};

const Navbar = dynamic(() => import("@/components/Navbar"), { loading: () => null });
const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"), { loading: () => null });
const Footer = dynamic(() => import("@/components/Footer"), { loading: () => null });
const ContrastChecker = dynamic(() => import("@/components/lab/ContrastChecker"), {
  loading: () => null,
});

export default function ContrastPage() {
  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="text-foreground selection:bg-primary/30 relative">
        <section className="mx-auto max-w-5xl px-4 pt-36 pb-16 sm:px-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Lab</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Contrast{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              checker
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            Pick a text colour and a background colour. It computes the WCAG 2.x contrast ratio and
            tells you which levels pass. Everything runs in your browser; no colour is sent anywhere.
          </p>

          <div className="mt-12">
            <ContrastChecker />
          </div>

          <div className="mt-12 max-w-2xl space-y-3 text-sm text-gray-400">
            <p>
              AA needs 4.5:1 for normal text and 3:1 for large text. AAA needs 7:1 and 4.5:1. Large
              means 18pt (24px), or 14pt (about 18.7px) bold.
            </p>
            <p>
              The ratio uses the sRGB relative luminance from the WCAG 2.x definition. It does not
              account for transparency or gradients, so check those on the real background.
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
