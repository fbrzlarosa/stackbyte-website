// The public channels the AI agent posts to. One list, used everywhere the site links them.
export type Channel = { label: string; url: string; rel: string };

export const channels: Channel[] = [
    { label: "dev.to", url: "https://dev.to/fbrzlarosa", rel: "noopener noreferrer" },
    { label: "Threads", url: "https://www.threads.com/@stackbyte.dev", rel: "noopener noreferrer" },
    { label: "Bluesky", url: "https://bsky.app/profile/stackbyte.dev", rel: "noopener noreferrer" },
    // rel="me" lets Mastodon verify the link back to this site.
    { label: "Mastodon", url: "https://mastodon.social/@rubberlarosa", rel: "me noopener noreferrer" },
];
