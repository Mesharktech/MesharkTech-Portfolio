import { Projects } from "@/components/Projects";

export const metadata = {
  title: "Projects | Mesharktech",
  description: "Enterprise scale systems and deployments engineered by Mesharktech."
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-meshark-slateDark pt-16">
      <Projects />
    </main>
  );
}
