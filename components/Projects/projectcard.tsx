"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ProjectItem } from "@/types/projectitem";
import { useState } from "react";
import { Heart, HeartOff } from "lucide-react";
import { API_URL } from "@/lib/constants";

const API = `${API_URL}`;

const ProjectCard = ({ project }: { project: ProjectItem }) => {
  const {
    id,
    project_title,
    project_type,
    difficulty,
    project_domain_1,
    project_domain_2,
    is_wishlisted
  } = project;

  // Wishlist feature placeholder
  const [isWishlisted, setIsWishlisted] = useState<boolean>(is_wishlisted || false);
  const [loading, setLoading] = useState(false);

  const imgSrc = `/images/projects/project_image_${project.id}.jpg` || "/images/placeholder.png";


  const tags = [project_type, difficulty, project_domain_1, project_domain_2].filter(
    (t) => t && t.trim().length > 0
  );

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to manage wishlist");
      setLoading(false);
      return;
    }

    try {
      const url = `${API}/api/project/${id}/wishlist`;

      const response = await fetch(url, {
        method: "POST", // ✅ only POST toggles wishlist
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Wishlist API error:", errorText);
        throw new Error(`Failed with status ${response.status}`);
      }

      // ✅ Toggle frontend state after success
      setIsWishlisted((prev) => !prev);
      console.log(
        isWishlisted
          ? `Removed "${project_title}" from wishlist`
          : `Added "${project_title}" to wishlist`
      );
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      href={`/projects/${id}`}
      aria-label={`Open project: ${project_title}`}
      className="block"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex flex-col overflow-hidden rounded-2xl 
                   bg-gradient-to-br from-[#1b1530] via-[#191622] to-[#15131b]
                   hover:from-[#221a4d] hover:to-[#1a1429]
                   border border-white/10 shadow-lg 
                   hover:shadow-[0_0_35px_rgba(120,100,255,0.25)]
                   transform transition-all duration-300 hover:-translate-y-2"
      >
        {/* IMAGE */}
        <div className="relative w-full p-4 flex items-center justify-center bg-[#1A141C] rounded-t-2xl">
          <div className="relative w-full h-44 sm:h-48 md:h-52 lg:h-48 xl:h-52 overflow-hidden rounded-xl">
            <Image
              src={imgSrc}
              alt={project_title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 px-5 py-6 space-y-3 text-center">
          <h3 className="line-clamp-2 text-lg font-semibold text-blue-300">
            {project_title}
          </h3>
          

          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium rounded-full 
                             bg-blue-500/10 text-blue-300 border border-blue-400/20 
                             hover:bg-blue-500/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/10 mx-auto w-2/3 mt-3"></div>

          {/* WISHLIST BUTTON */}
          <div className="mt-4">
            <button
              onClick={handleWishlistToggle}
              className={`group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full 
                          transition-all duration-300 border focus:outline-none
                          ${
                            isWishlisted
                              ? "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
                              : "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                          }`}
            >
              {isWishlisted ? (
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
      </motion.div>
    </Link>
  );
};

export default ProjectCard;
