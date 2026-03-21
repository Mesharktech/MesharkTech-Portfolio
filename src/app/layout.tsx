import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MesharkAI } from "@/components/MesharkAI";

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
  keywords: [
    "Mesharktech",
    "Full-Stack Developer",
    "Cybersecurity",
    "Nairobi",
    "Next.js",
    "TypeScript",
    "Python",
    "Quick Dynasty",
  ],
  authors: [{ name: "Meshark", url: "https://github.com/Mesharktech" }],
  openGraph: {
    title: "Mesharktech | Secure Architecture. Flawless Execution.",
    description:
      "Meshark — Full-Stack Developer & Cybersecurity Specialist. Building systems that command respect.",
    type: "website",
    locale: "en_US",
    images: [{ url: "https://mesharktech.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mesharktech",
    description: "Secure Architecture. Flawless Execution.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Meshark",
              jobTitle: "Full-Stack Developer & Cybersecurity Specialist",
              url: "https://mesharktech.com",
              sameAs: ["https://github.com/Mesharktech"],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased text-white`}
      >
        <Navbar />
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
        <MesharkAI />
      </body>
    </html>
  );
}
