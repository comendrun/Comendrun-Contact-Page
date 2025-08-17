import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Website",
  description: "Personal website and portfolio.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    nosnippet: true,
    noimageindex: true,
    noarchive: true,
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
