import { Hero } from "@/components/Hero";
import { WhoWeAre } from "@/components/WhoWeAre";
import { TrustBanner } from "@/components/TrustBanner";

export default function Home() {
  return (
    <main className="bg-meshark-slateDark overflow-x-hidden">
      <Hero />
      <WhoWeAre />
      <TrustBanner />
    </main>
  );
}
