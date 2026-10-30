import data from "@/data/lab.json";

export type LabTool = {
    slug: string;
    title: string;
    description: string;
    date: string;
};

// Newest first. The agent adds each new /lab/<slug> tool to src/data/lab.json.
export const getLabTools = (): LabTool[] =>
    [...(data.tools as LabTool[])].sort((a, b) => b.date.localeCompare(a.date));
