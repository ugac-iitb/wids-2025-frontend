import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Feature from "@/components/Features";
import About from "@/components/About";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Integration from "@/components/Integration";
import CTA from "@/components/CTA";
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
      {/* <Brands />
      <Feature />
      <About />
      <FeaturesTab />
      <FunFact />
      <Integration />
      <CTA /> */}
      <Hero />
      <WhatIsWiDS />
      <WhyWiDS />
      <SelectionProcedure />
      <FAQ />
    </main>
  );
}
