"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ProjectItem } from "@/types/projectitem";
import { useState } from "react";
import { Heart, HeartOff } from "lucide-react"; // ✅ ensure installed via npm install lucide-react

const ProjectCard = ({ project }: { project: ProjectItem }) => {
  const {
    id,
    ["Project Title"]: projectTitle,
    ["Project Description"]: projectDescription,
    ["Project Type"]: projectType,
    Difficulty: difficulty,
    ["Project Domain 1"]: projectDomain1,
    ["Project Domain 2"]: projectDomain2,
    ["Project Image"]: projectImage,
    InWishList, // ✅ boolean true/false
  } = project;

  // Normalize the "TRUE"/"FALSE" string to boolean
  const isInitialWishlist = InWishList?.toLowerCase() === "true";
  const [isWishlisted, setIsWishlisted] = useState<boolean>(isInitialWishlist);

  // const safeSrc = projectImage || "/images/placeholder.png";
  const safeSrc = "/images/placeholder.png";


  const tags = [projectType, difficulty, projectDomain1, projectDomain2].filter(
    (t) => t && t.trim().length > 0
  );

  // Placeholder for backend update
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // avoid navigating when clicking inside Link
    try {
      // 🔧 TODO: Replace with your backend API call here
      // Example:
      // await fetch(`/api/wishlist/${id}`, {
      //   method: isWishlisted ? "DELETE" : "POST",
      // });

      setIsWishlisted((prev) => !prev);
      console.log(
        isWishlisted
          ? `Removed "${projectTitle}" from wishlist`
          : `Added "${projectTitle}" to wishlist`
      );
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <Link
      href={`/projects/${String(id)}`}
      aria-label={`Open project: ${projectTitle}`}
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
              src={safeSrc}
              alt={projectTitle}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 px-5 py-6 space-y-3 text-center">
          <h3 className="line-clamp-2 text-lg font-semibold text-blue-300">
            {projectTitle}
          </h3>

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
