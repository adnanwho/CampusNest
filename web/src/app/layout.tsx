import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CampusNest — Verified Student Accommodation Marketplace",
  description: "Find student stays that fit your budget, commute and lifestyle with verified listings and live availability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-[#F7F5EF] text-[#17202A] selection:bg-[#39B86B]/20 selection:text-[#17202A]">
        {children}
      </body>
    </html>
  );
}
