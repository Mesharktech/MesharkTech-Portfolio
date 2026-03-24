import { Hero } from "@/features/marketing/components/Hero";
import { WhoWeAre } from "@/features/marketing/components/WhoWeAre";
import { TrustBanner } from "@/features/marketing/components/TrustBanner";
import { ServicesTeaser } from "@/features/marketing/components/ServicesTeaser";
import { FeaturedProjects } from "@/features/marketing/components/FeaturedProjects";
import { Testimonials } from "@/features/marketing/components/Testimonials";
import { CTAStrip } from "@/features/marketing/components/CTAStrip";

export default function Home() {
  return (
    <main id="main-content" className="bg-meshark-slateDark overflow-x-hidden">
      <Hero />
      <WhoWeAre />
      <ServicesTeaser />
      <FeaturedProjects />
      <Testimonials />
      <TrustBanner />
      <CTAStrip />
    </main>
  );
}
