"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./projectcard";
import { ProjectItem } from "@/types/projectitem";

const Project = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      // 🔒 Not logged in
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    const API = "https://understandably-subquadrangular-keven.ngrok-free.dev";

    async function fetchProjects() {
      try {
        const res = await fetch(`${API}/api/project/`, {
          method: "GET",
          credentials: "include",
        });

        console.log("Projects response:", res.status, res.headers.get("content-type"));

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Projects fetch failed: ${res.status} ${text}`);
        }

        let data;
        try {
          data = await res.json();
        } catch {
          throw new Error("Server did not return valid JSON");
        }

        setProjects(data.items ?? []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // 🔒 If not logged in
  if (!isLoggedIn && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#E7E3E5]">
        <p>Please log in to view projects.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#E7E3E5]">
        <p>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-23 pb-10 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"></div>

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-c-1315 px-4 md:px-8 py-4 xl:px-0">
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

      {/* Projects Grid */}
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
