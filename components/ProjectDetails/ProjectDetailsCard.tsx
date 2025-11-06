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
  // const imgSrc = project.project_image || "/images/placeholder.png";
  const imgSrc = "/images/placeholder.png";

  const tags = [
    project.project_type,
    project.difficulty,
    project.project_domain_1,
    project.project_domain_2,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-[1200px] bg-gradient-to-b from-blue-900/30 via-purple-900/20 to-[#0E0D12] rounded-2xl p-6 md:p-8 text-white shadow-[0_10px_30px_rgba(2,6,23,0.6)] space-y-10"
    >
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
        {project.project_title}
      </h2>

      {/* Image + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div className="w-full rounded-xl overflow-hidden bg-[#111013] shadow-inner">
          <div className="relative w-full h-64 sm:h-80">
            <Image
              src={imgSrc}
              alt={project.project_title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Project Info */}
        <div className="flex flex-col justify-between gap-6 text-sm">
          {/* Tags */}
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

          {/* Basic Stats */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-gray-300">
            <div>
              <div className="text-xs text-gray-400">Weekly Hours</div>
              <div className="font-medium text-white">
                {project.weekly_hours || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Mentees</div>
              <div className="font-medium text-white">
                {project.number_of_mentees || "—"}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Duration</div>
              <div className="font-medium text-white">
                {project.duration_weeks || "—"} weeks
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Pre-Requisites</div>
              <div className="font-medium text-white">
                {project.pre_requisites || "—"}
              </div>
            </div>
          </div>

          {/* Mentor Info */}
          <div className="border-t border-gray-800 pt-4 mt-2">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">
              Mentor Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Mentor */}
              <div>
                <div className="text-xs text-gray-400">Mentor</div>
                <div className="font-medium text-white">
                  {project.mentor?.name || "—"}
                </div>
                <div className="text-xs text-blue-300">
                  {project.mentor?.email ? (
                    <a
                      href={`mailto:${project.mentor.email}`}
                      className="hover:underline"
                    >
                      {project.mentor.email}
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
                  {project.co_mentor?.name || "—"}
                </div>
                <div className="text-xs text-blue-300">
                  {project.co_mentor?.email ? (
                    <a
                      href={`mailto:${project.co_mentor.email}`}
                      className="hover:underline"
                    >
                      {project.co_mentor.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description + Buttons */}
      <div className="border-t border-gray-800 pt-6">
        <h4 className="text-lg font-semibold mb-3 text-blue-300">Description</h4>
        <p className="text-gray-300 mb-6 leading-relaxed">
          {project.project_description}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-center">
          {project.resources_link ? (
            <a
              href={project.resources_link}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              View Resources
            </a>
          ) : (
            <span className="px-5 py-2.5 text-sm rounded-full font-medium border border-gray-600/40 bg-zinc-800/30 text-gray-400">
              No resources
            </span>
          )}

          {/* Wishlist Button */}
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
                <HeartOff
                  size={16}
                  className="text-pink-300 transition-transform group-hover:scale-110"
                />
                Remove from Wishlist
              </>
            ) : (
              <>
                <Heart
                  size={16}
                  className="text-cyan-300 transition-transform group-hover:scale-110"
                />
                Add to Wishlist
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comments */}
      {project.comments && (
        <div className="border-t border-gray-800 pt-5 text-sm text-gray-300">
          <h4 className="text-sm text-gray-200 font-medium mb-1">Comments</h4>
          <p>{project.comments}</p>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectDetailsCard;
