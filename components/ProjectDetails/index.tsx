"use client";

import React, { useEffect, useState } from "react";
import ProjectDetailsCard from "./ProjectDetailsCard";
import { ProjectItem } from "@/types/projectitem";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { API_URL } from "@/lib/constants";
import { getCatalogProject } from "@/lib/catalog";

type ProjectDetailsPageProps = {
  projectId: string;
};

const API = API_URL.replace(/\/+$/, ""); // ensure no trailing slash

const ProjectDetailsPage = ({ projectId }: ProjectDetailsPageProps) => {
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    (async () => {
      try {
        const record = getCatalogProject(Number(projectId));
        if (!record) throw new Error("Project not found.");
        const details = {
          id: record.id,
          project_title: record.project_name,
          project_description: record.project_description,
          project_domain_1: record.project_domains[0] || "",
          project_domain_2: record.project_domains[1] || "",
          project_type: record.project_category,
          difficulty: "",
          duration_weeks: record.project_duration_weeks,
          weekly_hours: "",
          number_of_mentees: record.number_of_mentees,
          pre_requisites: record.prerequisites,
          project_image: record.project_image_drive_link,
          project_image_drive_link: record.project_image_drive_link,
          mentor: { id: 0, name: record.mentor_name, email: record.mentor_ldap_mail, roll_no: null, is_mentor: true },
          is_wishlisted: false,
        } as ProjectItem;
        setProject(details);

        const token = localStorage.getItem("access_token");
        if (token) {
          try {
            const data = await fetchJSON(`${API}/api/get_project_details/${projectId}`);
            setProject({ ...details, is_wishlisted: Boolean(data.project?.is_wishlisted) });
          } catch (err) {
            console.error("Could not load basket status:", err);
          }
        }
      } catch (err: any) {
        console.error("Projects load error:", err);
        setError(err?.message || "Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const handleWishlistToggle = async () => {
    if (!project) return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in with IITB SSO to add a project to your basket.");
      return;
    }

    try {
      const res = await fetch(`${API}/api/project/${project.id}/wishlist`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      // ✅ Update state to reflect new wishlist status
      setProject((prev) => (prev ? { ...prev, is_wishlisted: result.is_wishlisted } : prev));
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      alert("Failed to update wishlist. Please try again.");
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
      <ProjectDetailsCard project={project} onWishlistToggle={handleWishlistToggle} />

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
