"use client";

import { ResourceItem } from "@/types/resourceitem";
import { motion } from "framer-motion";
import Image from "next/image";

const ResourceCard = ({ resource }: { resource: ResourceItem }) => {
  const { resource_name, resource_link, image_url } = resource;
  const safeSrc =
    typeof image_url === "string" && image_url.trim().length > 0
      ? image_url.trim()
      : "/wids-2025/images/placeholder.png";

  return (
    <motion.a
      href={resource_link?.trim() || "#"}
      target="_blank"
      rel="noopener noreferrer"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="flex flex-col overflow-hidden rounded-xl 
                 bg-gradient-to-b from-[#1A141C] via-[#1A141C] to-[#18171C] 
                 backdrop-blur-sm hover:from-[#1A141C]/90 hover:to-[#18171C]/90
                 transform transition-all duration-300 
                 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(106,111,219,0.15)] 
                 cursor-pointer"
      aria-label={`Open resource: ${resource_name}`}
    >
      {/* IMAGE */}
      <div className="relative w-full h-44 sm:h-48 md:h-52 lg:h-48 xl:h-52 overflow-hidden flex items-center justify-center bg-[#1A141C]">
        <Image
          src={safeSrc}
          alt={resource_name}
          fill
          className="object-contain transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/wids-2025/images/placeholder.png";
          }}
        />
      </div>

      {/* TITLE */}
      <div className="px-4 py-4 flex-1 flex items-end">
        <h3 className="line-clamp-2 text-lg font-semibold text-blue-400 text-center w-full">
          {resource_name}
        </h3>
      </div>
    </motion.a>
  );
};

export default ResourceCard;
