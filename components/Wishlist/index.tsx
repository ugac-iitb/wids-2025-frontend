"use client";
import React, { useEffect, useState, useMemo } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

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

  const handleSubmit = () => {
    if (projects.length === 0) {
      alert("Your wishlist is empty. Please add projects before submitting.");
      return;
    }
    router.push("/submission");
  };

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
            Wishlist
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Review your favorite projects before submitting your preferences.
          </p>
        </motion.div>
      </div>

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
              {projects.length === 0
                ? "Your wishlist is currently empty."
                : "No projects match your filters."}
            </p>
          ) : (
            projects.map((project) => (
              <WishlistCard key={project.id} project={project} 
              onRemove={() =>
                setProjects((prev) => prev.filter((p) => p.id !== project.id))} />
            ))
          )}
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

export default Wishlist;
