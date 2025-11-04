import { Metadata } from "next";
import Image from "next/image";
import Wishlist from "@/components/Wishlist";

export const metadata: Metadata = {
  title: "WiDS-Wishlist",

  // other metadata
  description: "This page contains all your choices of projects"
};

const WishListPage = () => {
  return (
    <div>
      <Wishlist />
    </div>
  );
};


export default WishListPage;
