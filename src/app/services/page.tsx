import { ServicesGrid } from "@/components/ServicesGrid";
import { PricingPackages } from "@/components/PricingPackages";
import { OurProcess } from "@/components/OurProcess";
import { Arsenal } from "@/components/Arsenal"; // Keep the Tech Stack Matrix at the bottom

export const metadata = {
  title: "Services & Pricing | Mesharktech",
  description: "Mesharktech agency capabilities, development packages, and comprehensive tech stacks."
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-meshark-slateDark pt-20 pb-12">
      <ServicesGrid />
      <PricingPackages />
      <OurProcess />
      
      {/* Tech Stack Matrix acts as the foundation */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-px bg-gradient-to-r from-transparent via-meshark-blue/20 to-transparent mb-12" />
        <Arsenal />
      </div>
    </main>
  );
}
