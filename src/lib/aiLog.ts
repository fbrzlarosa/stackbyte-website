import data from "@/data/ai-log.json";

export type AiLogEntry = {
    date: string;
    title: string;
    body: string[];
    metrics?: { label: string; value: string }[];
    links?: { label: string; url: string }[];
};

export type AiLogPost = AiLogEntry & { slug: string };

// Slugs are derived, not stored: the date, plus "-2", "-3"... for later entries of the same day
// (in file order), so existing URLs never change when the agent appends.
const withSlugs = (): AiLogPost[] => {
    const seen = new Map<string, number>();
    return [...(data.entries as AiLogEntry[])]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((entry) => {
            const n = (seen.get(entry.date) ?? 0) + 1;
            seen.set(entry.date, n);
            return { ...entry, slug: n === 1 ? entry.date : `${entry.date}-${n}` };
        });
};

// Newest first.
export const getAiLogEntries = (): AiLogPost[] => withSlugs().reverse();

export const getAiLogEntry = (slug: string): AiLogPost | undefined =>
    withSlugs().find((entry) => entry.slug === slug);

export const formatAiLogDate = (date: string, month: "short" | "long" = "short") =>
    new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", {
        day: month === "short" ? "numeric" : undefined,
        month,
        year: "numeric",
        timeZone: "UTC",
    });
