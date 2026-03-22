import { About } from "@/components/About";
import { FounderProfile } from "@/components/FounderProfile";

export const metadata = {
  title: "About | Mesharktech",
  description: "Learn about Meshark — Full-Stack Developer, Cybersecurity Specialist, and Founder of Mesharktech.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-meshark-slateDark pt-20">
      <About />
      <FounderProfile />
    </main>
  );
}
