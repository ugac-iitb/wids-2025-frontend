"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, HeartOff } from "lucide-react";
import { ProjectItem } from "@/types/projectitem";

type ProjectDetailsCardProps = {
  project: ProjectItem;
  onWishlistToggle: () => void;
};

const ProjectDetailsCard = ({ project, onWishlistToggle }: ProjectDetailsCardProps) => {
  const isWishlisted = !!project.is_wishlisted;
  const imgSrc = `/wids-2025/images/projects/project_image_${project.id}.jpg` || "/wids-2025/images/placeholder.png";
  const tags = [
    project.project_type,
    project.project_domain_1,
    project.project_domain_2,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl bg-gradient-to-b from-[#1c0c32]/90 via-[#140826]/80 to-[#0a0316] border border-pink-500/25 rounded-2xl p-6 md:p-8 text-white shadow-[0_10px_35px_rgba(236,72,153,0.15)] space-y-10"
    >
      <h2 className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
        {project.project_title}
      </h2>


      {/* Image + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="w-full rounded-xl overflow-hidden bg-[#070210] border border-pink-500/20 shadow-inner">
          <div className="relative w-full h-64 sm:h-80">
            <Image
              src={imgSrc}
              alt={project.project_title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between gap-6 text-sm">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-pink-500/10 text-pink-300 border border-pink-400/25"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Full project details */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-gray-300">
            <div>
              <div className="text-xs text-gray-400">Mentor</div>
              <div className="font-medium">{project.mentor?.name || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Mentor LDAP email</div>
              <div className="font-medium">{project.mentor?.email || "Pending verification"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Mentees</div>
              <div className="font-medium">{project.number_of_mentees || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Pre-Requisites</div>
              <div className="font-medium">{project.pre_requisites || "—"}</div>
            </div>
          </div>
          {project.project_image_drive_link && (
            <a href={project.project_image_drive_link} target="_blank" rel="noopener noreferrer" className="text-sm text-pink-300 underline hover:text-pink-200">
              View original image on Google Drive
            </a>
          )}
        </div>
      </div>

      {/* Description + Buttons */}
      <div className="border-t border-gray-800 pt-6">
        <h4 className="text-lg font-semibold mb-3 text-blue-300">Description</h4>
        <p className="text-gray-300 mb-6 leading-relaxed">{project.project_description}</p>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-center">


          {/* Wishlist button */}
          <button
            onClick={onWishlistToggle}
            className={`group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 border focus:outline-none
              ${
                isWishlisted
                  ? "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
                  : "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
              }`}
          >
            {isWishlisted ? (
              <>
                <HeartOff size={16} className="text-pink-300" /> Remove from basket
              </>
            ) : (
              <>
                <Heart size={16} className="text-cyan-300" /> Add project to basket
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailsCard;
