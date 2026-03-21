import { Contact } from "@/components/Contact";

export const metadata = {
  title: "Contact | Mesharktech",
  description: "Get in touch for enterprise consulting and system architecture."
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-meshark-slateDark pt-16">
      <Contact />
    </main>
  );
}
