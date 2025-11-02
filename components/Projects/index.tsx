"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./projectcard";
import { ProjectItem } from "@/types/projectitem";

const Project = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/projects.json");
      const data = await res.json();
      setProjects(data);
    };
    fetchData();
  }, []);

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-23 pb-10 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden ">
      <div className="absolute inset-0 opacity-30"></div>

      <div className="relative z-10 mx-auto max-w-c-1315 px-4 md:px-8 py-4 xl:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            WiDS 2025 Projects
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Explore all mentor-led projects for Winter in Data Science 2025
          </p>
        </motion.div>
      </div>

      {/* Grid */}
      <div className="relative z-10 mx-auto mt-10 max-w-c-1280 px-4 md:px-8 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Project;
