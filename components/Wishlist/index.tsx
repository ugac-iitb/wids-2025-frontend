"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WishlistCard from "./wishListCard";
import { ProjectItem } from "@/types/projectitem";
import { API_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

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

const Wishlist = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // 🧹 Clear previously selected wishlist info on page load
    localStorage.removeItem("selected_wishlist_ids");
    localStorage.removeItem("selected_wishlist_projects");

    (async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setIsLoggedIn(false);
          throw new Error("Please log in to view projects.");
        }

        const me = await fetchJSON(`${API}/api/me`);
        if (!me?.authenticated) throw new Error("Session expired. Please log in again.");
        setIsLoggedIn(true);

        const data = await fetchJSON(`${API}/api/project/wishlist`);
        setProjects(Array.isArray(data?.tiles) ? data.tiles : []);
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

  // 🔹 Handle selection toggle
  const handleSelect = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id);
      } else {
        if (prev.length >= 5) {
          alert("You can only select up to 5 projects.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

const handleSubmit = () => {
  if (projects.length === 0) {
    alert("Your wishlist is empty. Please add projects before submitting.");
    return;
  }

  const total = projects.length;
  const selectedCount = selectedIds.length;

  let finalProjects: ProjectItem[] = [];

  if (total > 5) {
    if (selectedCount === 0) {
      alert("You must select at least one project to continue.");
      return;
    }
    if (selectedCount > 5) {
      alert("You can choose at most 5 projects to continue.");
      return;
    }
    finalProjects = projects.filter((p) => selectedIds.includes(p.id));
  } else {
    // ✅ if ≤5 projects, use selected ones if available else all
    finalProjects =
      selectedCount > 0
        ? projects.filter((p) => selectedIds.includes(p.id))
        : projects;
  }

  // Store both ids + project objects
  localStorage.setItem(
    "selected_wishlist_ids",
    JSON.stringify(finalProjects.map((p) => p.id))
  );
  localStorage.setItem(
    "selected_wishlist_projects",
    JSON.stringify(finalProjects)
  );

  router.push("/submission");
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
            Wishlist
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Review your favorite projects before submitting your preferences.
            {projects.length > 5 && (
              <span className="block mt-2 text-yellow-400">
                You have more than 5 projects — please select atmax 5.
              </span>
            )}
          </p>
        </motion.div>
      </div>

      {/* Cards */}
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
              Your wishlist is currently empty.
            </p>
          ) : (
            projects.map((project) => {
              const selected = selectedIds.includes(project.id);
              return (
                <div
                  key={project.id}
                  onClick={() =>
                    projects.length > 5 ? handleSelect(project.id) : undefined
                  }
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    projects.length > 5
                      ? selected
                        ? "border-green-400 shadow-lg shadow-green-500/20"
                        : "border-zinc-700 hover:border-purple-500 cursor-pointer"
                      : "border-zinc-700"
                  }`}
                >
                  <WishlistCard
                    project={project}
                    onRemove={() => {
                      setProjects((prev) => prev.filter((p) => p.id !== project.id));
                      setSelectedIds((prev) => prev.filter((id) => id !== project.id)); // ✅ remove from selection too
                    }}
                  />
                  {projects.length > 5 && (
                    <div
                      className={`absolute top-3 right-3 w-6 h-6 rounded-full border ${
                        selected
                          ? "bg-green-500 border-green-400"
                          : "border-gray-500 bg-transparent"
                      } flex items-center justify-center text-xs text-white`}
                    >
                      {selected ? "✓" : ""}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </motion.div>

        {/* Submit Button */}
        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            {projects.length > 5 ? "Confirm Selected Projects" : "Submit Preferences"}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Wishlist;
