"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ResourceCard from "./resourcecard";
import { ResourceItem } from "@/types/resourceitem";

const Resource = () => {
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/wids-2025/data/resources.json");
      const data = await res.json();
      setResources(data);
    };
    fetchData();
  }, []);

  return (
    <section className="py-18 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-[#090514] via-[#140828] to-[#090514] relative overflow-hidden">
      {/* Decorative Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-c-1315 px-4 md:px-8 py-4 xl:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
            Resources
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore curated materials, guides, and tools to help you dive deeper into
            the world of data science and enhance your WiDS journey.
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="relative mx-auto mt-16 max-w-c-1280 px-4 md:px-8 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Resource;
