// components/ProjectDetailsCard.tsx
"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, HeartOff } from "lucide-react";
import { ProjectItem } from "@/types/projectitem";

type ProjectDetailsCardProps = {
  project: ProjectItem;
  inWishlist: boolean;
  onWishlistToggle: () => void;
};

const ProjectDetailsCard = ({
  project,
  inWishlist,
  onWishlistToggle,
}: ProjectDetailsCardProps) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-b from-blue-900/30 via-purple-900/20 to-[#0E0D12] rounded-2xl p-6 md:p-8 text-white shadow-[0_10px_30px_rgba(2,6,23,0.6)] space-y-10"
    >
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        {project["Project Title"]}
      </h2>

      {/* Image + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
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

        <div className="flex flex-col justify-between gap-6 text-sm">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
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

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-gray-300">
            <div>
              <div className="text-xs text-gray-400">Weekly Hours</div>
              <div className="font-medium text-white">
                {project["Weekly Hours"] || "—"}
              </div>
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

          {/* Mentor Info */}
          <div className="border-t border-gray-800 pt-4 mt-2">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">
              Mentor Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400">Mentor</div>
                <div className="font-medium text-white">
                  {project["Name"] || "—"}
                </div>
                <div className="text-xs text-blue-300">
                  {project["Mail-ID"] ? (
                    <a
                      href={`mailto:${project["Mail-ID"]}`}
                      className="hover:underline"
                    >
                      {project["Mail-ID"]}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              {hasCoMentor && (
                <div>
                  <div className="text-xs text-gray-400">Co-Mentor</div>
                  <div className="font-medium text-white">
                    {project["Co-Mentor Name"] || "—"}
                  </div>
                  <div className="text-xs text-blue-300">
                    {project["Co-Mentor"] || "—"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description + Buttons */}
      <div className="border-t border-gray-800 pt-6">
        <h4 className="text-lg font-semibold mb-3 text-blue-300">Description</h4>
        <p className="text-gray-300 mb-6 leading-relaxed">
          {project["Project Description"]}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-center">
          {project["Resources Link"] ? (
            <a
              href={project["Resources Link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full
                         border border-blue-500/40 bg-blue-500/10 text-blue-300
                         hover:bg-blue-500/20 transition-all duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 text-blue-300 transition-transform group-hover:scale-110"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              View Resources
            </a>
          ) : (
            <span className="px-5 py-2.5 text-sm rounded-full font-medium border border-gray-600/40 bg-zinc-800/30 text-gray-400">
              No resources
            </span>
          )}

          <button
            onClick={onWishlistToggle}
            className={`group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full 
              transition-all duration-300 border focus:outline-none
              ${
                inWishlist
                  ? "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
                  : "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
              }`}
          >
            {inWishlist ? (
              <>
                <HeartOff size={16} className="text-pink-300 transition-transform group-hover:scale-110" />
                Remove from Wishlist
              </>
            ) : (
              <>
                <Heart size={16} className="text-cyan-300 transition-transform group-hover:scale-110" />
                Add to Wishlist
              </>
            )}
          </button>
        </div>
      </div>

      {project["Comments"] && (
        <div className="border-t border-gray-800 pt-5 text-sm text-gray-300">
          <h4 className="text-sm text-gray-200 font-medium mb-1">Comments</h4>
          <p>{project["Comments"]}</p>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectDetailsCard;
