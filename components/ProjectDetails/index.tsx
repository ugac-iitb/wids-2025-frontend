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
        const foundProject = data.find((p: ProjectItem) => p.id === projectId);
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
        <p>This is the project id received : {projectId}</p>
        <p>Please check the project ID or return to the Projects page.</p>
      </div>
    );
  }

  const imgSrc = "/images/placeholder.png";
  const tags = [
    project["Project Type"],
    project["Difficulty"],
    project["Project Domain 1"],
    project["Project Domain 2"],
  ].filter(Boolean) as string[];

  const hasCoMentor =
    project["Co-Mentor Name"] || project["Co-Mentor"] ? true : false;

  return (
    <div className="bg-gradient-to-b from-blue-900/30 via-purple-900/20 to-[#0E0D12] rounded-2xl p-6 md:p-8 text-white shadow-[0_10px_30px_rgba(2,6,23,0.6)] space-y-8">
      {/* ------------------ PROJECT TITLE ------------------ */}
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {project["Project Title"]}
      </h2>

      {/* ------------------ TOP HALF ------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left: Image */}
        <div className="w-full rounded-xl overflow-hidden bg-[#111013] shadow-inner">
          <div className="relative w-full h-64 sm:h-80">
            <Image
              src={imgSrc}
              alt={project["Project Title"]}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Mentor & tags info */}
        <div className="flex flex-col justify-center items-center lg:items-start gap-5 text-center lg:text-left">
          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Mentor & Co-Mentor */}
          {hasCoMentor ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm w-full">
              {/* Mentor */}
              <div>
                <div className="text-xs text-gray-400">Mentor</div>
                <div className="font-medium text-white">{project["Name"] || "—"}</div>
                <div className="text-xs text-blue-300">
                  {project["Mail-ID"] ? (
                    <a href={`mailto:${project["Mail-ID"]}`} className="hover:underline">
                      {project["Mail-ID"]}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              {/* Co-Mentor */}
              <div>
                <div className="text-xs text-gray-400">Co-Mentor</div>
                <div className="font-medium text-white">
                  {project["Co-Mentor Name"] || "—"}
                </div>
                <div className="text-xs text-blue-300">
                  {project["Co-Mentor"] || "—"}
                </div>
              </div>
            </div>
          ) : (
            // Only Mentor present -> Center it
            <div className="text-sm text-center">
              <div className="text-xs text-gray-400">Mentor</div>
              <div className="font-medium text-white">{project["Name"] || "—"}</div>
              <div className="text-xs text-blue-300">
                {project["Mail-ID"] ? (
                  <a href={`mailto:${project["Mail-ID"]}`} className="hover:underline">
                    {project["Mail-ID"]}
                  </a>
                ) : (
                  "—"
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------ BOTTOM HALF ------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Key info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <div className="text-xs text-gray-400">Weekly Hours</div>
            <div className="font-medium text-white">{project["Weekly Hours"] || "—"}</div>
          </div>

          <div>
            <div className="text-xs text-gray-400">Mentees</div>
            <div className="font-medium text-white">
              {project["Number of Mentees"] || "—"}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400">Duration</div>
            <div className="font-medium text-white">
              {project["Duration (weeks)"] || "—"} weeks
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-400">Pre-Requisites</div>
            <div className="font-medium text-white">
              {project["Pre-Requisites"] || "—"}
            </div>
          </div>
        </div>

        {/* Right: Description + Centered Resources */}
        <div className="flex flex-col items-center justify-between text-center space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-2">Description</h4>
            <p className="text-gray-300">{project["Project Description"]}</p>
          </div>

          {project["Resources Link"] ? (
            <a
              href={project["Resources Link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2 bg-blue-500/90 text-black font-semibold rounded-lg shadow-md hover:brightness-95 transition-all"
            >
              View Resources
            </a>
          ) : (
            <span className="inline-flex items-center justify-center px-6 py-2 bg-zinc-800 text-gray-400 font-medium rounded-lg">
              No resources link
            </span>
          )}
        </div>
      </div>

      {/* Optional Comments */}
      {project["Comments"] && (
        <div className="border-t border-gray-800 pt-4 text-sm text-gray-300">
          <h4 className="text-sm text-gray-200 font-medium mb-1">Comments</h4>
          <p>{project["Comments"]}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
