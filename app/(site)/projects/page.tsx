import { Metadata } from "next";
import Image from "next/image";
import Project from "@/components/Projects";

export const metadata: Metadata = {
  title: "WiDS-Projects",

  // other metadata
  description: "This page contains all the information about available projects offered under WiDS"
};

const ProjectsPage = () => {
  return (
    <div>
      <Project />
    </div>
  );
};


export default ProjectsPage;
