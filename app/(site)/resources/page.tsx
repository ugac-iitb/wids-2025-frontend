import Resource from "@/components/Resources";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "WiDS-Resources Page",

  // other metadata
  description: "This is Resources page for Analytics Club"
};

const Resources = async () => {
  return (
    <>
        <Resource />
    </>
  );
};

export default Resources;
