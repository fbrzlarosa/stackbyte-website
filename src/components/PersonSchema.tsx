export default function PersonSchema() {
  const githubUrl = process.env.NEXT_PUBLIC_SOCIAL_GITHUB;
  const linkedinUrl = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN;
  const devToUrl = process.env.NEXT_PUBLIC_SOCIAL_DEVTO;

  const sameAs: string[] = [];
  if (githubUrl) sameAs.push(githubUrl);
  if (linkedinUrl) sameAs.push(linkedinUrl);
  if (devToUrl) sameAs.push(devToUrl);

  const schema: {
    "@context": string;
    "@type": string;
    name: string;
    jobTitle: string;
    url: string;
    sameAs?: string[];
  } = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Fabrizio La Rosa",
    jobTitle: "Software Developer",
    url: "https://stackbyte.dev",
  };

  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
