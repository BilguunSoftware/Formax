import { ContactCTA } from "@/components/home/ContactCTA";
import { CinematicSection } from "@/components/home/CinematicSection";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { Marquee } from "@/components/home/Marquee";
import { Services } from "@/components/home/Services";

export default function HomePage() {
  return (
    <main id="main" className="page-in">
      <Hero />
      <Marquee />
      <Manifesto />
      <FeaturedProjects />
      <CinematicSection />
      <Services />
      <ContactCTA />
    </main>
  );
}
