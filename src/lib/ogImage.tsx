import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Shared Open Graph card. A page gets its preview image by adding an `opengraph-image.tsx` next to
// its `page.tsx` that re-exports `ogSize`/`ogContentType` and returns `renderOgImage({...})`.
// Images are rendered at build time, so reading the bundled fonts from disk is fine.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Satori renders outside the CSS pipeline: these mirror the tokens in globals.css.
const colors = {
    background: "#0d1117",
    foreground: "#f3f4f6",
    muted: "#9ca3af",
    primary: "#06b6d4",
    secondary: "#818cf8",
};

type OgImageProps = {
    eyebrow: string;
    title: string;
    subtitle?: string;
};

const loadFont = (weight: 400 | 700) =>
    readFile(join(process.cwd(), `src/assets/fonts/Geist-${weight}.ttf`));

export async function renderOgImage({ eyebrow, title, subtitle }: OgImageProps) {
    const [regular, bold] = await Promise.all([loadFont(400), loadFont(700)]);

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px 80px",
                    backgroundColor: colors.background,
                    backgroundImage: `radial-gradient(circle at 85% 10%, ${colors.primary}33, transparent 45%), radial-gradient(circle at 10% 95%, ${colors.secondary}2e, transparent 50%)`,
                    color: colors.foreground,
                    fontFamily: "Geist",
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div
                        style={{
                            display: "flex",
                            fontSize: 26,
                            fontWeight: 700,
                            letterSpacing: 4,
                            textTransform: "uppercase",
                            color: colors.primary,
                        }}
                    >
                        {eyebrow}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            marginTop: 28,
                            fontSize: title.length > 48 ? 64 : 80,
                            fontWeight: 700,
                            lineHeight: 1.1,
                            letterSpacing: -2,
                        }}
                    >
                        {title}
                    </div>
                    {subtitle && (
                        <div
                            style={{
                                display: "flex",
                                marginTop: 28,
                                fontSize: 32,
                                lineHeight: 1.35,
                                color: colors.muted,
                            }}
                        >
                            {subtitle}
                        </div>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div
                        style={{
                            display: "flex",
                            width: 160,
                            height: 6,
                            borderRadius: 3,
                            backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                        }}
                    />
                    <div style={{ display: "flex", fontSize: 28, color: colors.muted }}>
                        Fabrizio La Rosa · stackbyte.dev
                    </div>
                </div>
            </div>
        ),
        {
            ...ogSize,
            fonts: [
                { name: "Geist", data: regular, weight: 400, style: "normal" },
                { name: "Geist", data: bold, weight: 700, style: "normal" },
            ],
        },
    );
}
