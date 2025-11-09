"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Outfit } from "next/font/google";
import "../globals.css";
import ToasterContext from "../context/ToastContext";
import PageTransition from "@/components/Transition";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${outfit.className}`}
        style={{
          backgroundColor: "#1A141C",
          color: "#E7E3E5",
          ["--framer-font-family" as any]:
            '"Outfit", "Outfit Placeholder", sans-serif',
          ["--framer-font-family-bold" as any]:
            '"Outfit", "Outfit Placeholder", sans-serif',
        }}
      >
        <Header />
        <ToasterContext />
        <PageTransition>
          {children}
        </PageTransition>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}

