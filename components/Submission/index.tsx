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
  const [validationError, setValidationError] = useState<string | null>(null);
  const router = useRouter();

  // 🔹 Fetch wishlist projects
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

        const data = await fetchJSON(`${API}/api/project/wishlist`);
        setProjects(Array.isArray(data?.tiles) ? data.tiles.slice(0, 5) : []);
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
    setValidationError(null);

    // Check if any SOP is empty
    const emptySop = projects.find((p) => !p.sop || p.sop.trim() === "");
    if (emptySop) {
      alert("⚠️ Please fill in all SOPs before submitting.");
      return;
    }

    const confirmSubmit = window.confirm(
    "🚨 Are you sure you want to submit your preferences?\n\n" +
    "Once submitted, you won't be able to edit or reorder them later."
  );

  if (!confirmSubmit) {
    return; // user canceled submission
  }

    setSubmitted(true);

    try {
      // Loop through projects in the chosen order
      for (let index = 0; index < projects.length; index++) {
        const p = projects[index];

        // Build the body payload for each project
        const payload = {
          sop: p.sop || "",
          rank: index + 1, // based on user’s drag order
        };

        // Call each endpoint separately
        await fetchJSON(`${API}/api/project/${p.id}/preference/upsert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        console.log(`✅ Submitted preference for project ${p.id}`);
      }

      console.log("All preferences submitted successfully!");
      localStorage.setItem("preferences_submitted", "true");
    } catch (err: any) {
      console.error("Submission failed:", err.message);
    }
  }, [projects]);

  useEffect(() => {
    const alreadySubmitted = localStorage.getItem("preferences_submitted") === "true";
    if (alreadySubmitted) setSubmitted(true);
  }, []);

  const handleRevert = async () => {
    localStorage.removeItem("preferences_submitted");
    setSubmitted(false);
    setLoading(true);
  };

  const handleBackHome = async () => {
    router.push("/");
  };

  // 🔹 Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading wishlist...
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

  if (submitted) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-[#1A141C] text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-green-400 mb-4"
        >
          You have already submitted your preferences 🎉
        </motion.h2>
        <p className="text-gray-400 text-base md:text-lg mb-8">
          Thank you for completing your wishlist submission.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBackHome}
          className="group inline-flex items-center gap-2 px-5 py-2.5 mb-5 rounded-full 
          border border-zinc-700 bg-zinc-800/60 text-zinc-300 font-semibold 
          hover:bg-zinc-700/80 hover:text-white transition-all duration-300"
        >
          Back to Home
        </motion.button>

        {/* Revert Button (for testing) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRevert}
          className="px-6 py-2 text-sm font-semibold rounded-full border border-red-500 text-red-400 hover:bg-red-500/10 transition-all"
        >
          Revert Submission (for testing)
        </motion.button>
      </section>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-20 pb-16 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden min-h-screen">
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
            WishList Submission
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Review your shortlisted projects and add your SOPs below. Drag and drop the cards to arrange them in your preferred order — you can submit up to five preferences.
          </p>
        </motion.div>
      </div>

      {/* Cards List */}
      <div className="relative z-10 mx-auto mt-10 max-w-5xl px-4 md:px-8 xl:px-0">
        <Reorder.Group
          axis="y"
          values={projects}
          onReorder={setProjects}
          className="flex flex-col gap-10"
        >
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

        {/* Submit Button */}
        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={submitted}
            className={`px-10 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 
              ${
                submitted
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              }`}
          >
            {submitted ? "Submitted Successfully" : "Submit Preferences"}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default SubmissionList;
