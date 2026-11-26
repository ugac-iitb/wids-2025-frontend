"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import WishlistCard from "./wishListCard";
import { ProjectItem } from "@/types/projectitem";
import { API_URL, clientID, redirectURI } from "@/lib/constants";
import { useRouter } from "next/navigation";

const API = `${API_URL}`;

const authUrl = `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${clientID}&response_type=code&scope=basic%20profile%20ldap%20program&redirect_uri=${encodeURIComponent(
  redirectURI
)}&state=some_state`;

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
    if (res.status === 401) throw new Error("Session expired. Please log in again.");
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
  const [submittedProjects, setSubmittedProjects] = useState<ProjectItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
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

        // ✅ Check if already submitted preferences
        const prefData = await fetchJSON(`${API}/api/project/preferences`);
        const prefTiles = Array.isArray(prefData?.tiles) ? prefData.tiles : [];

        if (prefTiles.length > 0) {
          setSubmittedProjects(prefTiles.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999)));
          setSubmitted(true);
          return;
        }

        // 🔹 Otherwise load wishlist projects
        const wishlistData = await fetchJSON(`${API}/api/project/wishlist`);
        setProjects(Array.isArray(wishlistData?.tiles) ? wishlistData.tiles : []);
      } catch (err: any) {
        console.error("Projects load error:", err);
        setError(err?.message || "Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length >= 5) {
        alert("You can only select up to 5 projects.");
        return prev;
      }
      return [...prev, id];
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
        alert("You can choose at most 5 projects.");
        return;
      }
      finalProjects = projects.filter((p) => selectedIds.includes(p.id));
    } else {
      finalProjects =
        selectedCount > 0
          ? projects.filter((p) => selectedIds.includes(p.id))
          : projects;
    }

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

  const handleRevertSubmission = async () => {
    const confirmRevert = window.confirm(
      "⚠️ Are you sure you want to revert your submission?\nThis will delete all your submitted preferences."
    );
    if (!confirmRevert) return;

    try {
      for (const project of submittedProjects) {
        await fetchJSON(`${API}/api/project/${project.id}/preference/delete`, {
          method: "DELETE",
        });
      }
      alert("✅ Submission reverted. You can edit and resubmit.");
      setSubmitted(false);
      router.refresh();
    } catch (err: any) {
      console.error("Revert failed:", err.message);
      alert("❌ Failed to revert submission. Please try again.");
    }
  };

  // 🌀 Loading
  if (loading) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-[#090514] text-[#f1e8f8]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading your projects, please wait...</p>
        </motion.div>
      </section>
    );
  }

  // 🟣 CASE 1: User not logged in
  if (!isLoggedIn) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#090514] via-[#140828] to-[#070210] text-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-2xl border border-pink-500/30 bg-[#120726]/80 backdrop-blur-xl max-w-lg shadow-[0_0_40px_rgba(236,72,153,0.2)]"
        >
          <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto mb-5 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-300 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent mb-3">
            You're Not Logged In or Session Expired
          </h2>
          <p className="text-[#f1e8f8]/80 mb-8 leading-relaxed text-sm sm:text-base">
            Please log in to view and manage your selected projects
          </p>
          <a
            href={authUrl}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-8 py-3 text-white font-semibold hover:from-pink-400 hover:to-purple-500 transition shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:scale-105 active:scale-95"
          >
            <span>Log in with IITB SSO</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </motion.div>
      </section>
    );
  }

  // ✅ Already submitted
  if (submitted)
    return (
      <section className="min-h-screen flex flex-col justify-center items-center bg-[#1A141C] text-center px-4 mt-20">
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
          {submittedProjects.map((project, index) => (
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

  // 🟣 Normal wishlist mode (no submission yet)
  return (
    <section className="px-4 md:px-8 lg:px-12 pt-28 pb-14 bg-gradient-to-b from-[#090514] via-[#140828] to-[#090514]">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text mb-3 drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
          My Projects
        </h2>
        <p className="text-gray-400">
          Review projects in your basket before submitting preferences.
        </p>
        {projects.length > 5 && (
          <p className="text-yellow-400 mt-2">
            You have more than 5 projects — please select at most 5.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 mt-10">
        {projects.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">
            Your basket is currently empty.
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
                    setSelectedIds((prev) => prev.filter((id) => id !== project.id));
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
      </div>

      <div className="flex justify-center mt-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 rounded-full shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:from-pink-400 hover:to-purple-500 transition-all duration-300"
        >
          {projects.length > 5 ? "Confirm Selected Projects" : "Submit Preferences"}
        </motion.button>
      </div>
    </section>
  );
};

export default Wishlist;
