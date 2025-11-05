"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./projectcard";
import { ProjectItem } from "@/types/projectitem";

const API = "https://understandably-subquadrangular-keven.ngrok-free.dev";

const Project = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");

    // 🔒 If no user info in localStorage → probably not logged in
    if (!user) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    async function fetchProjects() {
      try {
        const res = await fetch(`${API}/api/project/`, {
          method: "GET",
          credentials: "include", // send session cookie for IsAuthenticated
          headers: {
            "Accept": "application/json",
          },
        });

        console.log("Projects response:", res.status, res.headers.get("content-type"));

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          if (res.status === 403 || res.status === 401) {
            throw new Error("You must be logged in to view projects.");
          }
          throw new Error(`Projects fetch failed: ${res.status} ${text}`);
        }

        const data = await res.json();
        console.log("Projects data:", data);

        // your backend returns data.items
        setProjects(Array.isArray(data.items) ? data.items : []);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to fetch projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  // ⏳ While checking login or fetching
  if (isLoggedIn === null || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#E7E3E5]">
        <p>Loading projects...</p>
      </div>
    );
  }

  // 🔒 Not logged in
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#E7E3E5]">
        <p>Please log in to view projects.</p>
      </div>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  // ✅ Main content
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
          {projects.length === 0 ? (
            <p className="text-gray-400 text-center col-span-full">
              No projects available at the moment.
            </p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Project;
