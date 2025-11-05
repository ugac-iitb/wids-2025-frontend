"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WishlistCard from "./wishListCard";
import { ProjectItem } from "@/types/projectitem";
import { useRouter } from "next/navigation";

const Project = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/wishlist.json");
      const data = await res.json();
      setProjects(data);
    };
    fetchData();
  }, []);

  // Build dropdown options from wishlist projects
  const domainOptions = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p["Project Domain 1"]) set.add(p["Project Domain 1"]);
      if (p["Project Domain 2"]) set.add(p["Project Domain 2"]);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const difficultyOptions = React.useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.Difficulty) set.add(p.Difficulty);
    });
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [projects]);

  const typeOptions = React.useMemo(() => {
    return ["All", "Collaborative Project", "Guided Project"];
  }, []);

  // Apply AND filtering with "All" handling
  const filteredProjects = React.useMemo(() => {
    const normalize = (val: string | undefined) => (val || "").trim().toLowerCase();
    const matchesTypeFn = (p: ProjectItem) => {
      if (selectedType === "All") return true;
      const dataType = normalize(p["Project Type"]);
      if (normalize(selectedType) === "collaborative project") {
        return dataType === "collaborative" || dataType === "collaborative project";
      }
      if (normalize(selectedType) === "guided project") {
        return dataType === "teaching" || dataType === "guided" || dataType === "guided project";
      }
      return true;
    };

    return projects.filter((p) => {
      const matchesDomain =
        selectedDomain === "All" ||
        p["Project Domain 1"] === selectedDomain ||
        p["Project Domain 2"] === selectedDomain;
      const matchesDifficulty =
        selectedDifficulty === "All" || p.Difficulty === selectedDifficulty;
      const matchesType = matchesTypeFn(p);
      return matchesDomain && matchesDifficulty && matchesType;
    });
  }, [projects, selectedDomain, selectedDifficulty, selectedType]);

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDomain(e.target.value);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const clearFilters = () => {
    setSelectedDomain("All");
    setSelectedDifficulty("All");
    setSelectedType("All");
  };

  const handleSubmit = () => {
    router.push("/submission");
  };

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-23 pb-10 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden">
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
            WishList
          </h2>
        </motion.div>
        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 items-center">
          <div className="flex items-center gap-3 w-full max-w-3xl">
            <div className="flex items-center gap-2 flex-1">
              <label htmlFor="domainFilter" className="text-sm text-gray-300 whitespace-nowrap">
                Domain
              </label>
              <select
                id="domainFilter"
                value={selectedDomain}
                onChange={handleDomainChange}
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
              <label htmlFor="difficultyFilter" className="text-sm text-gray-300 whitespace-nowrap">
                Difficulty
              </label>
              <select
                id="difficultyFilter"
                value={selectedDifficulty}
                onChange={handleDifficultyChange}
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
              <label htmlFor="typeFilter" className="text-sm text-gray-300 whitespace-nowrap">
                Type
              </label>
              <select
                id="typeFilter"
                value={selectedType}
                onChange={handleTypeChange}
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

      {/* Grid */}
      <div className="relative z-10 mx-auto mt-10 max-w-c-1280 px-4 md:px-8 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProjects.map((project) => (
            <WishlistCard key={project.id} project={project} />
          ))}
        </motion.div>

        {/* ✅ Submit Button */}
        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            Submit Preferences
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Project;
