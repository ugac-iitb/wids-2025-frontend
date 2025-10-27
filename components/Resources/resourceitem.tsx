"use client";
import { Resource } from "@/types/resource";
import { motion } from "framer-motion";
import Image from "next/image";

const ResourceItem = ({ resource }: { resource: Resource }) => {
  const { resource_name, resource_link, image_url } = resource;
  const safeSrc = typeof image_url === "string" ? image_url.trim() : "";

  return (
    <motion.a
  href={resource_link.trim()}
  target="_blank"
  rel="noopener noreferrer"
  variants={{
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }}
  initial="hidden"
  whileInView="visible"
  transition={{ duration: 0.8, delay: 0.3 }}
  viewport={{ once: true }}
  className="animate_top flex flex-col rounded-lg bg-white shadow-solid-8 dark:bg-[#1A141C] overflow-hidden cursor-pointer transform transition-transform hover:-translate-y-2 hover:shadow-lg"
  aria-label={`Open resource: ${resource_name}`}
>
  {/* IMAGE */}
  <div className="relative w-full h-44 sm:h-48 md:h-52 lg:h-48 xl:h-52">
    {safeSrc ? (
      <Image
        src={safeSrc}
        alt={resource_name}
        fill
        className="object-cover rounded-t-lg"
      />
    ) : (
      <img
        src="/images/placeholder.png"
        alt="placeholder"
        className="object-cover w-full h-full rounded-t-lg"
      />
    )}
  </div>

  {/* TITLE */}
  <div className="px-3 py-3 flex-1 flex items-end">
    <h3 className="line-clamp-2 text-base font-semibold text-[#1A141C] dark:text-[#E7E3E5] transition-colors">
      {resource_name}
    </h3>
  </div>
</motion.a>

  );
};

export default ResourceItem;
