import dynamic from "next/dynamic";

async function getDevToPosts() {
  try {
    const devToUsername = process.env.DEVTO_USERNAME;
    if (!devToUsername) {
      return [];
    }

    const response = await fetch(
      `https://dev.to/api/articles?username=${devToUsername}&per_page=6`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Stackbyte Website",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(
      (article: {
        id: number;
        title?: string;
        description?: string;
        url?: string;
        cover_image?: string;
        published_at?: string;
        reading_time_minutes?: number;
        public_reactions_count?: number;
        positive_reactions_count?: number;
        tag_list?: string[];
        tags?: string;
      }) => {
        const tagList =
          article.tag_list || (article.tags ? article.tags.split(", ") : []);

        return {
          id: article.id.toString(),
          title: article.title || "Untitled",
          description: article.description || "",
          url: article.url || `https://dev.to/${devToUsername}/${article.id}`,
          image: article.cover_image,
          publishedAt: article.published_at || new Date().toISOString(),
          readTime: article.reading_time_minutes,
          reactions:
            article.public_reactions_count || article.positive_reactions_count,
          tags: tagList,
        };
      }
    );
  } catch (error) {
    console.error("Error fetching dev.to posts:", error);
    return [];
  }
}

const Hero = dynamic(() => import("@/components/Hero"), {
  loading: () => null,
});

const Navbar = dynamic(() => import("@/components/Navbar"), {
  loading: () => null,
});

const ScrollBackground = dynamic(
  () => import("@/components/ScrollBackground"),
  {
    loading: () => null,
  }
);

const About = dynamic(() => import("@/components/About"), {
  loading: () => null,
});

const Contact = dynamic(() => import("@/components/Contact"), {
  loading: () => null,
});

const FloatingElements = dynamic(
  () => import("@/components/FloatingElements"),
  {
    loading: () => null,
  }
);

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => null,
});

const MouseParticles = dynamic(() => import("@/components/MouseParticles"), {
  loading: () => null,
});

const MouseSpotlight = dynamic(() => import("@/components/MouseSpotlight"), {
  loading: () => null,
});

const NoiseOverlay = dynamic(() => import("@/components/NoiseOverlay"), {
  loading: () => null,
});

const Process = dynamic(() => import("@/components/Process"), {
  loading: () => null,
});

const ReadyToStart = dynamic(() => import("@/components/ReadyToStart"), {
  loading: () => null,
});

const SkillsShowcase = dynamic(() => import("@/components/SkillsShowcase"), {
  loading: () => null,
});

const DevToPosts = dynamic(() => import("@/components/DevToPosts"), {
  loading: () => null,
});

export default async function Home() {
  const posts = await getDevToPosts();

  return (
    <>
      <NoiseOverlay />
      <MouseParticles />
      <MouseSpotlight />
      <Navbar />

      <ScrollBackground>
        <main className="min-h-screen text-foreground selection:bg-primary/30 relative">
          <FloatingElements />
          <Hero />
          <About />
          <Process />
          <SkillsShowcase />
          <ReadyToStart />
          <DevToPosts posts={posts} />
          <Contact />
          <Footer />
        </main>
      </ScrollBackground>
    </>
  );
}
