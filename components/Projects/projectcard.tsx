"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { ProjectItem } from "@/types/projectitem";

const ProjectCard = ({ project }: { project: ProjectItem }) => {
  const {
    ["Project Title"]: projectTitle,
    ["Project Description"]: projectDescription,
    ["Project Type"]: projectType,
    Difficulty: difficulty,
    ["Project Domain 1"]: projectDomain1,
    ["Project Domain 2"]: projectDomain2,
    ["Project Image"]: projectImage,
  } = project;

  const safeSrc = "/images/placeholder.png";

  const tags = [projectType, difficulty, projectDomain1, projectDomain2].filter(
    (t) => t && t.trim().length > 0
  );

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="flex flex-col overflow-hidden rounded-xl bg-gradient-to-b from-blue-900/40 via-purple-900/30 to-[#18171C]
                 backdrop-blur-sm hover:from-blue-800/50 hover:to-purple-900/40
                 transform transition-all duration-300 hover:-translate-y-2 
                 hover:shadow-[0_0_25px_rgba(106,111,219,0.25)] cursor-pointer border border-white/10"
      aria-label={`Open project: ${projectTitle}`}
    >
      {/* IMAGE */}
      <div className="relative w-full p-4 flex items-center justify-center bg-[#1A141C] rounded-t-2xl">
        <div className="relative w-full h-44 sm:h-48 md:h-52 lg:h-48 xl:h-52 overflow-hidden rounded-xl">
            <Image
            src={safeSrc}
            alt={projectTitle}
            fill
            className="object-cover"
            />
        </div>
      </div>


      {/* CONTENT */}
      <div className="flex flex-col flex-1 px-4 py-5 space-y-3 text-center">
        <h3 className="line-clamp-2 text-lg font-semibold text-blue-300">
          {projectTitle}
        </h3>

        {/* {projectDescription && (
          <p className="text-sm text-gray-300 line-clamp-3">
            {projectDescription}
          </p>
        )} */}

        {tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-300 border border-blue-400/20 hover:bg-blue-500/20 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCard;
