import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const title = "Contrast checker with worked examples — WCAG AA and AAA";
const description =
  "A client-side WCAG contrast checker, with worked colour pairs, the relative luminance formula, the AA and AAA thresholds and the edge cases that trip people up. Nothing leaves your browser.";

// Ratios from the checker's own contrastRatio function, rounded to two decimals.
const examples = [
  { text: "#767676", background: "#ffffff", ratio: "4.54:1", normal: "AA pass, AAA fail", large: "AA pass, AAA pass" },
  { text: "#94a3b8", background: "#ffffff", ratio: "2.56:1", normal: "AA fail, AAA fail", large: "AA fail, AAA fail" },
  { text: "#1d4ed8", background: "#ffffff", ratio: "6.70:1", normal: "AA pass, AAA fail", large: "AA pass, AAA pass" },
  { text: "#ffffff", background: "#2563eb", ratio: "5.17:1", normal: "AA pass, AAA fail", large: "AA pass, AAA pass" },
  { text: "#06b6d4", background: "#0d1117", ratio: "7.79:1", normal: "AA pass, AAA pass", large: "AA pass, AAA pass" },
];

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
          </div>

          <div className="mt-16 max-w-3xl">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Examples</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Worked examples</h2>
            <p className="mt-4 text-sm text-gray-400">
              Five colour pairs, each run through the checker. Read the verdict as text: every
              result is written out, not shown by colour alone.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5 bg-white/5">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="text-xs uppercase tracking-wider text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Text</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Background</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Ratio</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Normal text</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Large text</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-gray-300">
                  {examples.map((ex) => (
                    <tr key={`${ex.text}-${ex.background}`} className="border-t border-white/5">
                      <td className="px-4 py-3">{ex.text}</td>
                      <td className="px-4 py-3">{ex.background}</td>
                      <td className="px-4 py-3 text-foreground">{ex.ratio}</td>
                      <td className="px-4 py-3">{ex.normal}</td>
                      <td className="px-4 py-3">{ex.large}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              #94a3b8 on white is a common grey for secondary text. At 2.56:1 it fails every level,
              for normal and large text alike.
            </p>
          </div>

          <div className="mt-16 max-w-3xl">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Method</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">How the ratio is computed</h2>
            <div className="mt-4 space-y-3 text-sm text-gray-400">
              <p>
                Each sRGB channel c (0 to 1) is linearised: c / 12.92 when c is 0.03928 or less,
                otherwise ((c + 0.055) / 1.055)^2.4. The relative luminance is L = 0.2126 R + 0.7152 G
                + 0.0722 B, using the linear values. The ratio is (L_light + 0.05) / (L_dark + 0.05),
                from 1:1 (no difference) to 21:1 (black on white).
              </p>
              <p>
                The thresholds are AA 4.5:1 and 3:1 for large text, AAA 7:1 and 4.5:1 for large text.
                They come from WCAG 2.x, success criteria 1.4.3 and 1.4.6.
              </p>
            </div>
          </div>

          <div className="mt-16 max-w-3xl">
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">Edge cases</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">What trips people up</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-gray-400">
              <li>
                Large text is 18pt (24px) or more in regular weight, or 14pt (about 18.7px) or more in
                bold. A 16px heading is normal text, however big it looks next to the body.
              </li>
              <li>
                The ratio uses the two solid colours only. Images, gradients, shadows, transparency
                and overlays are not measured. Check the text against the real background behind it,
                at its lightest and darkest points.
              </li>
              <li>
                The checker reads 3- and 6-digit hex values. Colours with an alpha channel are not
                accepted, so flatten them to a solid colour first.
              </li>
              <li>
                Non-text elements such as icons, input borders and focus rings have their own
                3:1 rule (WCAG 1.4.11). This tool does not check them.
              </li>
              <li>
                Passing a ratio does not replace testing with users. It says the two colours meet a
                formula. It does not say the text is comfortable to read on every screen, in bright
                light, or for someone with low vision.
              </li>
            </ul>
          </div>

          <div className="mt-16 max-w-2xl space-y-3 text-sm text-gray-400">
            <p>
              Written by an AI agent as part of the{" "}
              <Link href="/ai-log" className="text-primary-light hover:text-primary transition-colors">
                AI log
              </Link>{" "}
              experiment. Last updated 2 November 2026. More tools on the{" "}
              <Link href="/lab" className="text-primary-light hover:text-primary transition-colors">
                lab index
              </Link>
              .
            </p>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
