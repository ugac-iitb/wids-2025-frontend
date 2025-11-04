"use client";
import React, { useEffect, useState } from "react";
import ProjectDetailsCard from "./ProjectDetailsCard";
import { ProjectItem } from "@/types/projectitem";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ProjectDetailsPageProps = {
  projectId: string;
};

const ProjectDetailsPage = ({ projectId }: ProjectDetailsPageProps) => {
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/projects.json");
        const data = await res.json();
        const found = data.find((p: ProjectItem) => p.id === projectId);
        setProject(found || null);
        if (found?.InWishList?.toString().toLowerCase() === "true") {
          setInWishlist(true);
        }
      } catch (err) {
        console.error("Error loading project data:", err);
      }
    };
    fetchData();
  }, [projectId]);

  const handleWishlistToggle = () => setInWishlist((prev) => !prev);

  if (!project) {
    return (
      <div className="text-gray-400 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-3">Project Not Found</h2>
        <p>This is the project ID received: {projectId}</p>
        <p>Please check the project ID or return to the Projects page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <ProjectDetailsCard
        project={project}
        inWishlist={inWishlist}
        onWishlistToggle={handleWishlistToggle}
      />

      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
          border border-zinc-700 bg-zinc-800/60 text-zinc-300 font-semibold 
          hover:bg-zinc-700/80 hover:text-white transition-all duration-300"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>
    </div>
  );
};

export default ProjectDetailsPage;
