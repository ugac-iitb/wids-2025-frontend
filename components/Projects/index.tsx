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
          throw new Error("Your session token has expired, Please log in again to continue.");
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
      if (p.project_domain_1) set.add(p.project_domain_1);
      if (p.project_domain_2) set.add(p.project_domain_2);
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
      const dataType = normalize(p.project_type);
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
        p.project_domain_1 === selectedDomain ||
        p.project_domain_2 === selectedDomain;

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
      <section className="flex flex-col items-center justify-center min-h-screen bg-[#1A141C] text-[#E7E3E5]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-lg text-gray-300 animate-pulse">
            Loading projects, please wait...
          </p>
        </motion.div>
      </section>
    );
  }

  // 🟣 CASE 1: User not logged in
  if (!isLoggedIn) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md max-w-md shadow-lg"
        >
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
            You're Not Logged In or Session Expired
          </h2>
          <p className="text-gray-300 mb-6">
            Please log in to view and manage your projects.
          </p>
        </motion.div>
      </section>
    );
  }

  // 🔴 CASE 2: Error occurred (e.g. network, server)
  if (error) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1A141C] via-red-900/10 to-[#1A141C] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md max-w-md shadow-lg"
        >
          <h2 className="text-3xl font-semibold bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-3">
            Something Went Wrong
          </h2>
          <p className="text-gray-300 mb-6">
            We couldn't load your projects right now. Please refresh the page
            or try again later.
          </p>
        </motion.div>
      </section>
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
            My Projects
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            View your wishlisted projects for Winter in Data Science 2025
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 items-center">
          {/* Filters Stack Responsively */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full max-w-3xl">

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