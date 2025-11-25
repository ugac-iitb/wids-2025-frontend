"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Reorder, motion } from "framer-motion";
import SubmissionCard from "./submissionCard";
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

const SubmissionList = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  // 🔹 Fetch preferences first; fallback to wishlist if none exist
  useEffect(() => {
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

        // Step 1️⃣ — Try preferences API (if user already submitted)
        const prefData = await fetchJSON(`${API}/api/project/preferences`);
        const prefTiles = Array.isArray(prefData?.tiles) ? prefData.tiles : [];

        if (prefTiles.length > 0) {
          setProjects(prefTiles.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)));
          setSubmitted(true);
          return;
        }

        // Step 2️⃣ — If not submitted, load from localStorage (selected_wishlist_ids)
        const storedIds = JSON.parse(localStorage.getItem("selected_wishlist_ids") || "[]");

        if (storedIds.length > 0) {
          // Fetch all projects and filter only the selected ones
          const wishlistData = await fetchJSON(`${API}/api/project/wishlist`);
          const allWishlistTiles = Array.isArray(wishlistData?.tiles) ? wishlistData.tiles : [];

          // Only include projects that match stored IDs
          const filtered = allWishlistTiles.filter((p: any) => storedIds.includes(p.id));

          setProjects(filtered.slice(0, 5)); // limit to 5
          setSubmitted(false);
        } else {
          setError("No selected projects found. Please select projects from your wishlist first.");
          setSubmitted(false);
        }
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


  // 🔹 Update SOP for a project
  const handleSopChange = (projectId: number, sop: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, sop } : p))
    );
  };

  // 🔹 Submit preferences
  const handleSubmit = useCallback(async () => {
    if (submitted) return;

    const emptySop = projects.find((p) => !p.sop || p.sop.trim() === "");
    if (emptySop) {
      alert("⚠️ Please fill in all SOPs before submitting.");
      return;
    }

    const confirmSubmit = window.confirm(
      "🚨 Are you sure you want to submit your preferences?\n\n" +
        "Once submitted, you won't be able to edit or reorder them later."
    );
    if (!confirmSubmit) return;

    try {
      for (let index = 0; index < projects.length; index++) {
        const p = projects[index];
        const payload = { sop: p.sop || "", rank: index + 1 };
        await fetchJSON(`${API}/api/project/${p.id}/preference/upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      localStorage.setItem("preferences_submitted", "true");
      setSubmitted(true);
    } catch (err: any) {
      console.error("Submission failed:", err.message);
      alert("❌ Submission failed. Please try again.");
    }
  }, [projects, submitted]);

    // 🔹 Revert submitted preferences
  const handleRevertSubmission = useCallback(async () => {
    const confirmRevert = window.confirm(
      "⚠️ Are you sure you want to revert your submission?\n\n" +
      "This will delete all your submitted preferences and allow you to re-edit and resubmit."
    );
    if (!confirmRevert) return;

    try {
      for (const project of projects) {
        await fetchJSON(`${API}/api/project/${project.id}/preference/delete`, {
          method: "DELETE",
        });
      }

      localStorage.removeItem("preferences_submitted");
      alert("✅ Your submission has been reverted. You can now edit and resubmit your preferences.");
      setSubmitted(false);
      router.refresh(); // reload the component data
    } catch (err: any) {
      console.error("Revert failed:", err.message);
      alert("❌ Failed to revert submission. Please try again.");
    }
  }, [projects, router]);


  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading your projects...
      </div>
    );
  }

  // 🔹 Not logged in
  if (!isLoggedIn) {
    return (
      <div className="text-center text-gray-400 py-20">
        Please{" "}
        <a href="/login" className="text-blue-400 underline">
          log in
        </a>{" "}
        to view your wishlist.
      </div>
    );
  }

  // 🔹 Error state
  if (error) {
    return (
      <div className="text-center text-red-400 py-20">
        {error}
      </div>
    );
  }

  // 🔹 Empty wishlist
  if (projects.length === 0) {
    return (
      <div className="text-center text-gray-400 py-20">
        You haven't added any projects to your wishlist yet.
      </div>
    );
  }

  // 🔹 Already submitted view (read-only)
  if (submitted) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-[#1A141C] text-center px-4 mt-15">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-green-400 mb-4"
        >
          You have already submitted your preferences 🎉
        </motion.h2>
        <p className="text-gray-400 text-base md:text-lg mb-8">
          These are the projects you submitted, displayed in your ranked order.
        </p>

        <div className="w-full max-w-4xl space-y-6 text-left">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="flex items-start gap-4 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-700"
            >
              <div className="text-2xl font-bold text-purple-400 mt-2">
                {index + 1}.
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.project_title}
                </h3>
                <p className="text-gray-400 mb-2">{project.project_description}</p>
                <div className="bg-zinc-800 text-gray-300 text-sm p-3 rounded-md border border-zinc-700">
                  <strong className="text-purple-400">Your SOP:</strong>
                  <p className="mt-1 whitespace-pre-line">{project.sop || "(No SOP provided)"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 mt-10 mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-700/50 transition"
          >
            Back to Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRevertSubmission}
            className="px-6 py-2 rounded-full border border-red-500 text-red-400 hover:bg-red-500/20 transition"
          >
            Revert Submission
          </motion.button>
        </div>

      </section>
    );
  }

  // 🔹 Editable wishlist view
  return (
    <section className="px-4 md:px-8 lg:px-12 pt-20 pb-16 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden min-h-screen">
      <div className="relative z-10 mx-auto max-w-c-1315 px-4 md:px-8 py-4 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Wishlist Submission
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Review your shortlisted projects and add your SOPs below. Drag and drop the cards to arrange them in your preferred order — you can submit up to five preferences.
          </p>
        </motion.div>
      </div>

      {/* Cards List */}
      <div className="relative z-10 mx-auto mt-10 max-w-5xl px-4 md:px-8 xl:px-0">
        <Reorder.Group axis="y" values={projects} onReorder={setProjects} className="flex flex-col gap-10">
          {projects.map((project, index) => (
            <Reorder.Item
              key={project.id}
              value={project}
              whileDrag={{ scale: 1.03 }}
              className="cursor-grab active:cursor-grabbing flex items-start gap-4"
            >
              <div className="flex-shrink-0 text-2xl font-bold text-purple-400 mt-2">
                {index + 1}.
              </div>
              <div className="flex-1">
                <SubmissionCard
                  project={project}
                  onSopChange={(sop) => handleSopChange(project.id, sop)}
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-10 py-3 text-lg font-semibold rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300"
          >
            Submit Preferences
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default SubmissionList;
