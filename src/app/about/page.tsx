import { About } from "@/components/About";

export const metadata = {
  title: "About | Mesharktech",
  description: "The Mesharktech operational baseline and agency story."
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-meshark-slateDark pt-16">
      <About />
    </main>
  );
}
