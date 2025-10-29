"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ProjectItem } from "@/types/projectitem";

type ProjectDetailsProps = {
  projectId: string;
};

const ProjectDetails = ({ projectId }: ProjectDetailsProps) => {
  const [project, setProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/projects.json");
        const data = await res.json();

        // ✅ Find project matching the given id
        const foundProject = data.find(
          (p: ProjectItem) => p.id === projectId
        );
        setProject(foundProject || null);
      } catch (err) {
        console.error("Error loading project data:", err);
      }
    };
    fetchData();
  }, [projectId]);

  if (!project) {
    return (
      <div className="text-gray-400 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-3">Project Not Found</h2>
        <p>Please check the project ID or return to the Projects page.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1A141C] to-[#0E0D12] rounded-2xl p-8 text-white shadow-lg">
      {/* ✅ Project Image */}
      <div className="relative w-full h-64 mb-6 rounded-xl overflow-hidden">
        <Image
          src={`/images/projects/${project["Project Image"]}`}
          alt={project["Project Title"]}
          fill
          className="object-cover"
        />
      </div>

      {/* ✅ Title & Description */}
      <h2 className="text-3xl font-semibold mb-4">
        {project["Project Title"]}
      </h2>
      <p className="text-gray-300 mb-6">{project["Project Description"]}</p>

      {/* ✅ Tags */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {[project["Project Type"], project["Difficulty"], project["Project Domain 1"], project["Project Domain 2"]]
          .filter(Boolean)
          .map((tag) => (
            <span
              key={tag}
              className="bg-[#23212B] text-blue-300 px-4 py-1 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
      </div>

      {/* ✅ Extra info */}
      <div className="text-gray-400 space-y-2 text-sm">
        <p>
          <strong>Duration:</strong> {project["Duration (weeks)"]} weeks
        </p>
        <p>
          <strong>Weekly Hours:</strong> {project["Weekly Hours"]}
        </p>
        <p>
          <strong>Mentor:</strong> {project["Name"]}
        </p>
        <p>
          <strong>Department:</strong> {project["Academic Department"]}
        </p>
        <p>
          <strong>Pre-Requisites:</strong> {project["Pre-Requisites"]}
        </p>
      </div>
    </div>
  );
};

export default ProjectDetails;
