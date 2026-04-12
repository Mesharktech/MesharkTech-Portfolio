import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MesharkAI } from "@/features/ai-chat/components/MesharkAI";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";

// Primary display font — clean, professional, internationally recognized
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Secondary display font — geometric, futuristic headlines
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

// Monospace font — for terminal/code elements
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mesharktech | Secure Architecture. Flawless Execution.",
  description:
    "Meshark — Full-Stack Developer & Cybersecurity Specialist based in Nairobi. Building high-performance, resilient digital infrastructure that scales. Founder of Mesharktech & Quick Dynasty.",
  metadataBase: new URL("https://mesharktech.com"),
  keywords: [
    "Mesharktech",
    "Full-Stack Developer",
    "Cybersecurity",
    "Nairobi",
    "Next.js",
    "TypeScript",
    "Python",
    "Quick Dynasty",
    "Web Development Kenya",
    "SaaS Development",
  ],
  authors: [{ name: "Meshark", url: "https://github.com/Mesharktech" }],
  openGraph: {
    title: "Mesharktech | Secure Architecture. Flawless Execution.",
    description:
      "Meshark — Full-Stack Developer & Cybersecurity Specialist. Building systems that command respect.",
    type: "website",
    locale: "en_US",
    url: "https://mesharktech.com",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Mesharktech — Secure Architecture. Flawless Execution." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mesharktech",
    description: "Secure Architecture. Flawless Execution.",
    creator: "@mesharktech",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: prevents false hydration errors from browser
    // extensions (e.g. JetBrains) that inject attributes into <html>
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Performance: preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.groq.com" />

        {/* Structured Data: Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Meshark",
              jobTitle: "Full-Stack Developer & Cybersecurity Specialist",
              url: "https://mesharktech.com",
              sameAs: [
                "https://github.com/Mesharktech",
                "https://linkedin.com/in/meshark",
                "https://x.com/mesharktech",
              ],
            }),
          }}
        />
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Mesharktech",
              url: "https://mesharktech.com",
              logo: "https://mesharktech.com/logo-icon.svg",
              description: "Elite digital engineering firm — secure architecture, flawless execution.",
              foundingDate: "2020",
              founder: { "@type": "Person", name: "Meshark" },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Nairobi",
                addressCountry: "KE",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@mesharktech.com",
                contactType: "customer service",
              },
            }),
          }}
        />
        {/* Structured Data: WebSite with SearchAction */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Mesharktech",
              url: "https://mesharktech.com",
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased text-white`}
      >
        {/* Skip to content (WCAG 2.1 AA) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-meshark-cyan focus:text-meshark-slateDark focus:rounded-lg focus:font-semibold focus:outline-none"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>
          <Navbar />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
        </SmoothScrollProvider>
        <MesharkAI />
      </body>
    </html>
  );
}
