import data from "@/data/ai-log.json";

export type AiLogEntry = {
    date: string;
    title: string;
    body: string[];
    metrics?: { label: string; value: string }[];
    links?: { label: string; url: string }[];
};

// Newest first; the agent appends entries in any order.
export const getAiLogEntries = (): AiLogEntry[] =>
    [...(data.entries as AiLogEntry[])].sort((a, b) => b.date.localeCompare(a.date));
