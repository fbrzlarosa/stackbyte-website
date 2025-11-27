import Contact from "@/components/Contact";
import FloatingElements from "@/components/FloatingElements";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MouseParticles from "@/components/MouseParticles";
import MouseSpotlight from "@/components/MouseSpotlight";
import Navbar from "@/components/Navbar";
import NoiseOverlay from "@/components/NoiseOverlay";
import Process from "@/components/Process";
import ScrollBackground from "@/components/ScrollBackground";
import SkillsShowcase from "@/components/SkillsShowcase";
import StunningLoader from "@/components/StunningLoader";

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
            <Process />
            <SkillsShowcase />
            <Contact />
            <Footer />
          </main>
        </ScrollBackground>
      </StunningLoader>
    </>
  );
}
