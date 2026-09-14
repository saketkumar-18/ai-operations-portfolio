import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SAKET // AI OPERATIONS — Data Scientist · AI Engineer",
  description:
    "Enter the system. Explore the work. Saket Kumar — Data Scientist, AI Engineer, ML Engineer. BSc (Hons.) DS & AI, IIT Guwahati. 15+ live AI systems across LLM agents, computer vision, speech and full-stack.",
  keywords: [
    "Saket Kumar", "AI Engineer", "Data Scientist", "ML Engineer",
    "IIT Guwahati", "LLM", "RAG", "Computer Vision", "Portfolio",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0c08",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
