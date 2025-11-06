"use client";

import React, { useEffect, useState } from "react";
import ProjectDetailsCard from "./ProjectDetailsCard";
import { ProjectItem } from "@/types/projectitem";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type ProjectDetailsPageProps = {
  projectId: string;
};

const API = "https://understandably-subquadrangular-keven.ngrok-free.dev";

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

  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}\n${text.slice(0, 500)}`);
  if (!ct.toLowerCase().includes("application/json"))
    throw new Error(`Non-JSON response (${ct}) at ${url}\n${text.slice(0, 500)}`);

  return JSON.parse(text);
}

const ProjectDetailsPage = ({ projectId }: ProjectDetailsPageProps) => {
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Please log in to view projects.");

        // ✅ Fetch project details
        const data = await fetchJSON(`${API}/api/get_project_details/${projectId}`);
        const proj = data.project;
        setProject(proj);
        setInWishlist(!!proj?.is_wishlisted);
      } catch (err: any) {
        console.error("Projects load error:", err);
        setError(err?.message || "Failed to fetch project details.");
        setProject(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const handleWishlistToggle = async () => {
    if (!project) return;

    const newStatus = !inWishlist;
    setInWishlist(newStatus);
    setProject({ ...project, is_wishlisted: newStatus });

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("You must be logged in to modify wishlist.");

      const endpoint = `${API}/api/${
        newStatus ? "add_to_wishlist" : "remove_from_wishlist"
      }/${project.id}`;

      await fetchJSON(endpoint, { method: "POST" });
    } catch (err) {
      console.error("Wishlist toggle error:", err);
      // revert state on error
      setInWishlist(!newStatus);
      setProject({ ...project, is_wishlisted: !newStatus });
    }
  };

  if (loading)
    return <div className="text-center text-gray-400 mt-10">Loading project details...</div>;

  if (error)
    return (
      <div className="text-red-400 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-3">Error</h2>
        <p>{error}</p>
      </div>
    );

  if (!project)
    return (
      <div className="text-gray-400 text-center mt-10">
        <h2 className="text-2xl font-semibold mb-3">Project Not Found</h2>
        <p>This is the project ID received: {projectId}</p>
        <p>Please check the project ID or return to the Projects page.</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <ProjectDetailsCard
        project={project}
        inWishlist={inWishlist}
        onWishlistToggle={handleWishlistToggle}
      />

      <Link
        href="/projects"
        className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
          border border-zinc-700 bg-zinc-800/60 text-zinc-300 font-semibold 
          hover:bg-zinc-700/80 hover:text-white transition-all duration-300"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Projects
      </Link>
    </div>
  );
};

export default ProjectDetailsPage;
