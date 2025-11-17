"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, Reorder } from "framer-motion";
import { apiRequest } from "@/lib/api";
import { Preference, ProjectPreferencesResponse, RankingRequest } from "@/types/mentor";
import toast from "react-hot-toast";

const ProjectApplicantsPage = () => {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedSOP, setSelectedSOP] = useState<{ applicant: string; sop: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (projectId) {
      fetchPreferences();
    }
  }, [projectId, currentPage, searchQuery]);

  const fetchPreferences = async () => {
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

      const response = await apiRequest(
        `/api/mentor/project/${projectId}/preferences?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch preferences: ${response.status}`);
      }

      const data: ProjectPreferencesResponse = await response.json();
      setProjectTitle(data.project.project_title);
      
      // Sort by rank (null ranks go to the end)
      const sortedItems = [...(data.items || [])].sort((a, b) => {
        if (a.rank === null && b.rank === null) return 0;
        if (a.rank === null) return 1;
        if (b.rank === null) return -1;
        return a.rank - b.rank;
      });
      
      setPreferences(sortedItems);

      if (data.total) {
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      }
    } catch (err: any) {
      console.error("Error fetching preferences:", err);
      setError(err.message || "Failed to load applicants");
      toast.error("Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRankings = async () => {
    setSaving(true);
    try {
      // Extract applicant IDs in the current order
      const rankedIds = preferences.map((pref) => pref.applicant.id);

      const requestBody: RankingRequest = {
        ranked_ids: rankedIds,
      };

      const response = await apiRequest(`/api/mentor/project/${projectId}/rankings`, {
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to save rankings: ${response.status}`);
      }

      toast.success("Rankings saved successfully!");
      
      // Refresh the data to get updated ranks
      await fetchPreferences();
    } catch (err: any) {
      console.error("Error saving rankings:", err);
      toast.error("Failed to save rankings");
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPreferences();
  };

  if (loading && preferences.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] pt-24 pb-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6A6FDB] mx-auto mb-4"></div>
          <p className="text-[#E7E3E5]">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error && preferences.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] pt-24 pb-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push("/mentor")}
            className="px-6 py-2 bg-[#6A6FDB] text-[#E7E3E5] rounded-full hover:bg-[#719EA8] transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-24 pb-10 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 opacity-30"></div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8 py-4 xl:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <button
            onClick={() => router.push("/mentor")}
            className="text-[#6A6FDB] hover:text-[#719EA8] mb-4 transition flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>
          <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            {projectTitle}
          </h2>
          <p className="text-lg text-gray-300">Review and rank applicants</p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or roll number..."
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

        {/* Instructions */}
        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong className="text-blue-400">Tip:</strong> Drag and drop applicants to reorder them. Click "View SOP" to read their Statement of Purpose. Click "Save Rankings" when you're done.
          </p>
        </div>

        {/* Applicants List */}
        {preferences.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No applicants found.</p>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={preferences}
            onReorder={setPreferences}
            className="flex flex-col gap-4 mb-8"
          >
            {preferences.map((pref, index) => (
              <Reorder.Item
                key={pref.id}
                value={pref}
                whileDrag={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.3)" }}
                className="bg-[#1b1530] border border-white/20 rounded-lg p-6 cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-start gap-4">
                  {/* Rank Indicator */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {index + 1}
                  </div>

                  {/* Applicant Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-[#E7E3E5] mb-1">
                          {pref.applicant.name}
                        </h3>
                        <p className="text-gray-400 text-sm">{pref.applicant.email}</p>
                        <p className="text-gray-400 text-sm">Roll No: {pref.applicant.roll_no}</p>
                      </div>
                      {pref.rank !== null && (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          Current Rank: {pref.rank}
                        </span>
                      )}
                    </div>

                    {/* SOP Preview */}
                    <div className="mb-3">
                      <p className="text-gray-300 text-sm line-clamp-2">{pref.sop}</p>
                    </div>

                    {/* View SOP Button */}
                    <button
                      onClick={() =>
                        setSelectedSOP({
                          applicant: pref.applicant.name,
                          sop: pref.sop,
                        })
                      }
                      className="px-4 py-2 bg-[#6A6FDB] text-[#E7E3E5] rounded-lg hover:bg-[#719EA8] transition text-sm"
                    >
                      View Full SOP
                    </button>
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveRankings}
            disabled={saving}
            className={`px-10 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 ${
              saving
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            }`}
          >
            {saving ? "Saving..." : "Save Rankings"}
          </motion.button>
        </div>

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

      {/* SOP Modal */}
      {selectedSOP && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSOP(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#1b1530] border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-2xl font-bold text-[#E7E3E5]">
                SOP - {selectedSOP.applicant}
              </h3>
              <button
                onClick={() => setSelectedSOP(null)}
                className="text-gray-400 hover:text-[#E7E3E5] transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">{selectedSOP.sop}</p>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ProjectApplicantsPage;

