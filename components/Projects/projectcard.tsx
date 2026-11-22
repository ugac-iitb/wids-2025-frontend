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

  const imgSrc = `/wids-2025/images/projects/project_image_${project.id}.jpg` || "/wids-2025/images/placeholder.png";


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
                   bg-gradient-to-br from-[#180d2c]/90 via-[#130724]/80 to-[#0a0316]/95
                   hover:from-[#22103d] hover:to-[#17082e]
                   border border-pink-500/20 shadow-lg 
                   hover:border-pink-400/50 hover:shadow-[0_0_35px_rgba(236,72,153,0.3)]
                   transform transition-all duration-300 hover:-translate-y-2 group"
      >
        {/* IMAGE */}
        <div className="relative w-full p-4 flex items-center justify-center bg-[#070210] rounded-t-2xl">
          <div className="relative w-full h-44 sm:h-48 md:h-52 lg:h-48 xl:h-52 overflow-hidden rounded-xl">
            <Image
              src={imgSrc}
              alt={project_title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 px-5 py-6 space-y-3 text-center">
          <h3 className="line-clamp-2 text-lg font-semibold text-pink-100 group-hover:text-pink-300 transition-colors">
            {project_title}
          </h3>

          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium rounded-full 
                             bg-pink-500/10 text-pink-300 border border-pink-400/25 
                             hover:bg-pink-500/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-pink-500/15 mx-auto w-2/3 mt-3"></div>

          {/* WISHLIST BUTTON */}
          <div className="mt-4">
            <button
              onClick={handleWishlistToggle}
              className={`group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full 
                          transition-all duration-300 border focus:outline-none
                          ${
                            isWishlisted
                              ? "border-pink-500/50 bg-pink-500/15 text-pink-200 hover:bg-pink-500/25 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                              : "border-purple-500/40 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20"
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
                    className="text-purple-300 transition-transform group-hover:scale-110"
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
