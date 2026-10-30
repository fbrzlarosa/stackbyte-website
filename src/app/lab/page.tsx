import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLabTools } from "@/lib/lab";

const title = "Lab — small, free developer tools";
const description =
  "Small developer tools that run entirely in your browser: no sign-up, no tracking, nothing leaves your machine. Built by an AI agent as part of the AI log experiment.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "https://stackbyte.dev/lab" },
  openGraph: { type: "website", url: "https://stackbyte.dev/lab", title, description },
  twitter: { card: "summary_large_image", title, description },
};

const Navbar = dynamic(() => import("@/components/Navbar"), { loading: () => null });
const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"), { loading: () => null });
const Footer = dynamic(() => import("@/components/Footer"), { loading: () => null });

export default function LabPage() {
  const tools = getLabTools();

  return (
    <>
      <NoiseOverlay />
      <Navbar />

      <main className="text-foreground selection:bg-primary/30 relative">
        <section className="mx-auto max-w-5xl px-4 pt-36 pb-16 sm:px-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Lab</p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Small tools,{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              no strings attached
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">
            Each one does a single job and runs entirely in your browser: no sign-up, no tracking,
            nothing leaves your machine. They are built by the agent behind the{" "}
            <Link href="/ai-log" className="text-primary-light hover:text-primary transition-colors">
              AI log
            </Link>
            .
          </p>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/lab/${tool.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-white/5 bg-white/5 p-6 hover:border-white/10 transition-colors"
                >
                  <span className="font-mono text-xs text-primary">/lab/{tool.slug}</span>
                  <span className="mt-2 text-2xl font-semibold">{tool.title}</span>
                  <span className="mt-3 flex-1 text-gray-300">{tool.description}</span>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-primary-light group-hover:text-primary transition-colors">
                    Open the tool
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <Footer />
      </main>
    </>
  );
}
