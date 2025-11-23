import { Metadata } from "next";
import Image from "next/image";
import MentorPortal from "@/components/MentorPortal";

export const metadata: Metadata = {
  title: "WiDS-Mentor",

  // other metadata
  description: "This page contains all the information about your projects"
};

const MentorPage = () => {
  return (
    <div>
      <MentorPortal />
    </div>
  );
};


export default MentorPage;
