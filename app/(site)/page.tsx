import { Metadata } from "next";
import Hero from "@/components/Hero";
import FAQ from "@/components/FAQ";
import WhatIsWiDS from "@/components/WhatisWiDS";
import WhyWiDS from "@/components/WhyWiDS";
import SelectionProcedure from "@/components/SelectionProcedure";

export const metadata: Metadata = {
  title: "WiDS-Home",
  // other metadata
  description: "Winter in Data Science 2025"
};

export default function Home() {
  return (
    <main>
      <Hero />
      <WhatIsWiDS />
      <WhyWiDS />
      <SelectionProcedure />
      <FAQ />
    </main>
  );
}
