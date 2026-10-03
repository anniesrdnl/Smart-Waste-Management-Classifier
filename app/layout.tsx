import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartWaste — AI-Powered Waste Classification",
  description:
    "Upload a photo of a waste item and SmartWaste identifies it as cardboard, glass, metal, paper, plastic or trash using computer vision, then explains how to handle it.",
};

export const viewport: Viewport = {
  themeColor: "#fafaf7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
