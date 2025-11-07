"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import ProjectCard from "./projectcard";
import { ProjectItem } from "@/types/projectitem";
import { API_URL } from "@/lib/constants";

const API = `${API_URL}`;

async function fetchJSON(url: string, opts: RequestInit = {}) {
  const token = localStorage.getItem("access_token") ?? "";
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "ngrok-skip-browser-warning": "true",
    ...(opts.headers || {}),
  };
  const res = await fetch(url, { ...opts, headers });

  const text = await res.text();
  const ct = res.headers.get("content-type") || "";

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    throw new Error(`HTTP ${res.status} ${url}\n${text.slice(0, 500)}`);
  }
  if (!ct.toLowerCase().includes("application/json")) {
    throw new Error(`Non-JSON response (${ct}) at ${url}\n${text.slice(0, 500)}`);
  }
  return JSON.parse(text);
}

const Project = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setIsLoggedIn(false);
          throw new Error("Please log in to view projects.");
        }

        try {
          const me = await fetchJSON(`${API}/api/me`);
          if (!me?.authenticated) throw new Error("Session expired. Please log in again.");
          setIsLoggedIn(true);
        } catch (e: any) {
          console.warn("Auth check failed:", e.message);
          throw e;
        }

        const data = await fetchJSON(`${API}/api/project`);
        setProjects(Array.isArray(data?.items) ? data.items : []);
      } catch (err: any) {
        console.error("Projects load error:", err);
        setError(err?.message || "Failed to fetch projects.");
        setProjects([]);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const domainOptions = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p["Project Domain 1"]) set.add(p["Project Domain 1"]);
      if (p["Project Domain 2"]) set.add(p["Project Domain 2"]);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const difficultyOptions = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.difficulty) set.add(p.difficulty);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const typeOptions = useMemo(() => {
    return ["All", "Collaborative Project", "Guided Project"];
  }, []);

  const filteredProjects = useMemo(() => {
    const normalize = (val: string | undefined) => (val || "").trim().toLowerCase();
    const matchesTypeFn = (p: ProjectItem) => {
      if (selectedType === "All") return true;
      const dataType = normalize(p["Project Type"]);
      if (normalize(selectedType) === "collaborative project") {
        return dataType.includes("collaborative");
      }
      if (normalize(selectedType) === "guided project") {
        return dataType.includes("guided") || dataType.includes("teaching");
      }
      return true;
    };

    return projects.filter((p) => {
      const matchesDomain =
        selectedDomain === "All" ||
        p["Project Domain 1"] === selectedDomain ||
        p["Project Domain 2"] === selectedDomain;

      const matchesDifficulty =
        selectedDifficulty === "All" || p.difficulty === selectedDifficulty;

      return matchesDomain && matchesDifficulty && matchesTypeFn(p);
    });
  }, [projects, selectedDomain, selectedDifficulty, selectedType]);

  const clearFilters = () => {
    setSelectedDomain("All");
    setSelectedDifficulty("All");
    setSelectedType("All");
  };

    if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#E7E3E5]">
        <p>Loading projects...</p>
      </div>
    );
  }

  if (!isLoggedIn || error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-400 text-center px-4">
        <div>
          <p className="mb-2">{error || "Please log in to view projects."}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-23 pb-10 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"></div>

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

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 items-center">
          <div className="flex items-center gap-3 w-full max-w-3xl flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm text-gray-300 whitespace-nowrap">Domain</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full min-h-[40px] rounded-lg bg-[#1b1530] border border-white/20 text-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {domainOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1b1530] text-blue-200">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm text-gray-300 whitespace-nowrap">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full min-h-[40px] rounded-lg bg-[#1b1530] border border-white/20 text-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {difficultyOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1b1530] text-blue-200">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 flex-1">
              <label className="text-sm text-gray-300 whitespace-nowrap">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full min-h-[40px] rounded-lg bg-[#1b1530] border border-white/20 text-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#1b1530] text-blue-200">
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm rounded-lg border border-white/20 text-gray-200 hover:bg-white/10 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-c-1280 px-4 md:px-8 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.length === 0 ? (
            <p className="text-gray-400 text-center col-span-full">
              {projects.length === 0
                ? "No projects available at the moment."
                : "No projects match your filters."}
            </p>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Project;
