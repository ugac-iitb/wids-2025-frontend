"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { MentorProject, MentorProjectsResponse } from "@/types/mentor";
import toast from "react-hot-toast";

const MentorDashboard = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<MentorProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProjects();
  }, [currentPage, searchQuery]);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: offset.toString(),
      });
      
      if (searchQuery.trim()) {
        params.append("q", searchQuery.trim());
      }

      const response = await apiRequest(`/api/mentor/projects?${params.toString()}`);

      if (!response.ok) {
        if (response.status === 403) {
          const data = await response.json();
          if (data.error === "mentor_only") {
            setError("You do not have mentor access.");
            router.push("/");
            return;
          }
        }
        throw new Error(`Failed to fetch projects: ${response.status}`);
      }

      const data: MentorProjectsResponse = await response.json();
      setProjects(data.items || []);
      
      // Calculate total pages if total is provided
      if (data.total) {
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      }
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Failed to load projects");
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    fetchProjects();
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/mentor/project/${projectId}`);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] pt-24 pb-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A6FDB] mx-auto mb-4"></div>
          <p className="text-[#E7E3E5]">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] pt-24 pb-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-[#6A6FDB] text-[#E7E3E5] rounded-full hover:bg-[#719EA8] transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-24 pb-10 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 opacity-30"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 py-4 xl:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Mentor Dashboard
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Manage your projects and review applicants
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="flex-1 min-h-[48px] rounded-lg bg-[#1b1530] border border-white/20 text-[#E7E3E5] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/40 placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#6A6FDB] text-[#E7E3E5] rounded-lg hover:bg-[#719EA8] transition"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No projects found.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleProjectClick(project.id)}
                className="bg-[#1b1530] border border-white/20 rounded-lg p-6 cursor-pointer hover:border-[#6A6FDB] transition-all duration-300"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-[#E7E3E5] mb-2 line-clamp-2">
                    {project.project_title}
                  </h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      project.role === "Owner"
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-purple-500/20 text-purple-300"
                    }`}
                  >
                    {project.role}
                  </span>
                </div>
                <div className="flex gap-4 text-sm text-gray-400">
                  <div>
                    <span className="font-semibold text-[#6A6FDB]">{project.preferences_count}</span>{" "}
                    Applicants
                  </div>
                  <div>
                    <span className="font-semibold text-[#6A6FDB]">{project.wishlist_count}</span>{" "}
                    Wishlists
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#1b1530] border border-white/20 text-[#E7E3E5] rounded-lg hover:bg-[#6A6FDB] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-[#E7E3E5]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#1b1530] border border-white/20 text-[#E7E3E5] rounded-lg hover:bg-[#6A6FDB] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MentorDashboard;

