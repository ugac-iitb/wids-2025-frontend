"use client";
import React, { useEffect, useState, useCallback, use } from "react";
import { Reorder, motion } from "framer-motion";
import { API_URL } from "@/lib/constants";
import StudentCard from "./studentcard";
import { Student } from "@/types/student";
import { ProjectItem } from "@/types/projectitem";
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

    if (!res.ok) throw new Error(`HTTP ${res.status} ${url}\n${text.slice(0, 500)}`);
    if (!ct.toLowerCase().includes("application/json"))
    throw new Error(`Non-JSON response (${ct}) at ${url}\n${text.slice(0, 500)}`);

    return JSON.parse(text);
}

type MentorProjectPageProps = {
  projectId: string;
};

const MentorProject = ({ projectId }: MentorProjectPageProps) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [project, setProject] = useState<ProjectItem | null>(null);
    const router = useRouter();

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
    
            // Step 1️⃣ — Try mentor rankings API (if mentor already submitted)
            const prefData = await fetchJSON(
              `${API}/api/mentor/project/${projectId}/my_rankings`
            );

            // Ensure we have a rankings array
            const prefTiles = Array.isArray(prefData?.rankings)
              ? prefData.rankings
              : [];

            if (prefTiles.length > 0) {
              // Convert API response (student_id → user_id for frontend consistency)
              const normalized = prefTiles.map((s) => ({
                user_id: s.student_id,
                user_name: s.student_name,
                user_email: s.student_email,
                user_roll_no: s.student_roll_no,
                sop: s.sop,
                rank: s.rank,
              }));

              // Sort by rank (nulls last)
              normalized.sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

              setStudents(normalized);
              setSubmitted(true);
              return;
            }
    
            // Fetch all projects and filter only the selected ones
            const appliedStudents = await fetchJSON(`${API}/api/mentor/project/${projectId}/sops`);
            const allStudents = Array.isArray(appliedStudents?.sops) ? appliedStudents.sops : [];
            const projectData = appliedStudents?.project || null;

            setStudents(allStudents);
            setProject(projectData);
            setSubmitted(false);
            
          } catch (err: any) {
            console.error("Students load error:", err);
            setError(err?.message || "Failed to fetch applied students data.");
            setStudents([]);
            setIsLoggedIn(false);
          } finally {
            setLoading(false);
          }
        })();
      }, []);

    // 🔹 Submit preferences
      const handleSubmit = useCallback(async () => {
        if (submitted) return;

        const confirmSubmit = window.confirm(
          "🚨 Are you sure you want to submit your rankings?\n\n" +
            "Once submitted, you won't be able to change them."
        );
        if (!confirmSubmit) return;

        try {
          if (!project) {
            alert("Project not found");
            return;
          }

          // Build rankings array from students list
          const rankings = students.map((s, idx) => ({
            user_id: s.user_id,
            rank: idx + 1,   // or s.rank if you already track rank
          }));

          await fetchJSON(
            `${API}/api/mentor/project/${project.id}/rankings`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rankings }),
            }
          );

          setSubmitted(true);

        } catch (err: any) {
          console.error("Submission failed:", err.message);
          alert("❌ Submission failed. Please try again.");
        }
      }, [students, project, submitted]);


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
                Loading student data, please wait...
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
                Please log in to view and manage your mentee preferences.
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
                We couldn't load the data right now. Please refresh the page
                or try again later.
              </p>
            </motion.div>
          </section>
        );
      }

     if (submitted) {
        return (
          <section className="min-h-screen flex flex-col items-center bg-[#1A141C] text-center px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold text-green-400 mb-4"
            >
              You have already submitted your preferences 🎉
            </motion.h2>
            <p className="text-gray-400 text-base md:text-lg mb-8">
              These are the preferences you submitted, displayed in your ranked order.
            </p>
    
            <div className="w-full max-w-4xl space-y-6 text-left">
              {students.map((student, index) => (
                <div
                  key={student.user_id}
                  className="flex items-start gap-4 bg-zinc-900/50 p-5 rounded-2xl border border-zinc-700"
                >
                  <div className="text-2xl font-bold text-purple-400 mt-2">
                    {index + 1}.
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {student.user_name}
                    </h3>
                    <div className="bg-zinc-800 text-gray-300 text-sm p-3 rounded-md border border-zinc-700">
                      <strong className="text-purple-400">SOP:</strong>
                      <p className="mt-1 whitespace-pre-line">{student.sop || "(No SOP provided)"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
    
            <div className="flex flex-col md:flex-row gap-4 mt-10 mb-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/")}
                className="px-6 py-2 rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-700/50 transition"
              >
                Back to Home
              </motion.button>
            </div>
    
          </section>
        );
      }

    return (
    <section className="px-4 md:px-8 lg:px-12 pt-1 pb-1 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"></div>

      <div className="relative z-10 mx-auto max-w-c-1315 px-4 md:px-8 py-4 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-semibold pb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            {project?.project_title || "Selected Project"}
          </h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Drag and drop the students in your preferred order and submit your choices.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto mt-10 max-w-5xl px-4 md:px-8 xl:px-0">
        <Reorder.Group axis="y" values={students} onReorder={setStudents} className="flex flex-col gap-10">
          {students.map((student, index) => (
            <Reorder.Item
              key={student.user_id}
              value={student}
              whileDrag={{ scale: 1.03 }}
              className="cursor-grab active:cursor-grabbing flex items-start gap-4"
            >
              <div className="flex-shrink-0 text-2xl font-bold text-purple-400 mt-2">
                {index + 1}.
              </div>
              <div className="flex-1">
                <StudentCard
                  student={student}
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

}

export default MentorProject;