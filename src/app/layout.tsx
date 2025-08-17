import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Professional Portfolio - Software Developer",
  description:
    "Senior Software Developer specializing in full-stack web development, cloud architecture, and modern JavaScript frameworks.",
  keywords:
    "software developer, full-stack, react, nodejs, cloud computing, web development",
  authors: [{ name: "Portfolio Owner" }],
  openGraph: {
    title: "Professional Portfolio - Software Developer",
    description:
      "Senior Software Developer specializing in full-stack web development",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-white text-gray-900">{children}</body>
    </html>
  );
}
