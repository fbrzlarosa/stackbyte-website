import dynamic from "next/dynamic";

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

const StunningLoader = dynamic(() => import("@/components/StunningLoader"), {
  loading: () => null,
});

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

export default function Home() {
  return (
    <>
      <NoiseOverlay />
      <MouseParticles />
      <MouseSpotlight />
      <Navbar />

      <StunningLoader>
        <ScrollBackground>
          <main className="min-h-screen text-foreground selection:bg-primary/30 relative">
            <FloatingElements />
            <Hero />
            <About />
            <Process />
            <SkillsShowcase />
            <ReadyToStart />
            <Contact />
            <Footer />
          </main>
        </ScrollBackground>
      </StunningLoader>
    </>
  );
}
