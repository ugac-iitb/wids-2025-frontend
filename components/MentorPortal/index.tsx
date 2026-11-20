"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { API_URL, clientID, redirectURI } from "@/lib/constants";
import toast from "react-hot-toast";

const API = `${API_URL}`;
const GDRIVE_FOLDER_URL =
  "https://drive.google.com/drive/folders/1aaibfBjmg6-I-qZv9DGla4H204xB9r8S?usp=sharing";

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

const degreeOptions = [
  "Btech",
  "Btech + Mtech (Dual Degree)",
  "BS",
  "BS-MSc",
  "IDDDP",
  "Mtech",
  "MSc-PhD",
  "other",
];

const yearOptions = ["2nd", "3rd", "4th", "5th", "other"];

const domainOptions = [
  "Core Projects",
  "Natural Language Processing",
  "Computer Vision",
  "Agentic AI",
  "Quantitative Analytics",
  "Theoretical Machine Learning",
  "Reinforcement Learning",
  "Miscellaneous",
];

const durationOptions = ["3 weeks", "4 weeks", "5 weeks", "6 weeks"];

const MentorPortal = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Section 1: General Information
  const [ldapEmail, setLdapEmail] = useState("");
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [nonLdapEmail, setNonLdapEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [yearOfStudyChoice, setYearOfStudyChoice] = useState("2nd");
  const [yearOfStudyOther, setYearOfStudyOther] = useState("");
  const [academicDepartment, setAcademicDepartment] = useState("");
  const [degreeChoice, setDegreeChoice] = useState("");
  const [degreeOther, setDegreeOther] = useState("");
  const [coMentor, setCoMentor] = useState("No");

  // Section 2: Project Information
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [projectCategory, setProjectCategory] = useState("Guided Project");
  const [durationWeeks, setDurationWeeks] = useState("4 weeks");
  const [weeklyTimeCommitment, setWeeklyTimeCommitment] = useState("");
  const [numMentees, setNumMentees] = useState("");
  const [prerequisites, setPrerequisites] = useState("");

  // Image Upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [savedImageName, setSavedImageName] = useState<string | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [driveUrl, setDriveUrl] = useState<string>(GDRIVE_FOLDER_URL);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const authUrl = `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${clientID}&response_type=code&scope=basic%20profile%20ldap%20program&redirect_uri=${encodeURIComponent(
    redirectURI
  )}&state=some_state`;

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        const me = await fetchJSON(`${API}/api/me`);
        if (!me?.authenticated) {
          setIsLoggedIn(false);
          setLoading(false);
          return;
        }

        setIsLoggedIn(true);

        // Pre-fill user data from auth profile
        if (me?.user) {
          if (me.user.email) setLdapEmail(me.user.email);
          if (me.user.name) setName(me.user.name);
          if (me.user.roll_no) setRollNo(me.user.roll_no);
        }

        // Check if mentor registration was already submitted
        try {
          const statusRes = await fetchJSON(`${API}/api/mentor/registration-status`);
          if (statusRes?.submitted && statusRes?.data) {
            const data = statusRes.data;
            if (data.ldap_email) setLdapEmail(data.ldap_email);
            if (data.name) setName(data.name);
            if (data.roll_no) setRollNo(data.roll_no);
            if (data.non_ldap_email) setNonLdapEmail(data.non_ldap_email);
            if (data.contact_number) setContactNumber(data.contact_number);
            if (data.academic_department) setAcademicDepartment(data.academic_department);
            if (data.co_mentor) setCoMentor(data.co_mentor);

            // Handle year of study
            if (yearOptions.slice(0, 4).includes(data.year_of_study)) {
              setYearOfStudyChoice(data.year_of_study);
            } else if (data.year_of_study) {
              setYearOfStudyChoice("other");
              setYearOfStudyOther(data.year_of_study);
            }

            // Handle degree
            if (degreeOptions.slice(0, 7).includes(data.degree_enrolled)) {
              setDegreeChoice(data.degree_enrolled);
            } else if (data.degree_enrolled) {
              setDegreeChoice("other");
              setDegreeOther(data.degree_enrolled);
            }

            // Handle Section 2: Project Information
            if (data.project_title) setProjectTitle(data.project_title);
            if (data.project_description) setProjectDescription(data.project_description);
            if (Array.isArray(data.domains)) {
              setSelectedDomains(data.domains);
            } else if (typeof data.domains === "string" && data.domains.trim()) {
              setSelectedDomains(
                data.domains.split(",").map((s: string) => s.trim()).filter(Boolean)
              );
            }
            if (data.project_category) setProjectCategory(data.project_category);
            if (data.duration_weeks) setDurationWeeks(data.duration_weeks);
            if (data.weekly_time_commitment)
              setWeeklyTimeCommitment(data.weekly_time_commitment);
            if (data.num_mentees) setNumMentees(data.num_mentees);
            if (data.prerequisites) setPrerequisites(data.prerequisites);
            if (data.image_name) setSavedImageName(data.image_name);
            if (data.project_image_url) setSavedImageUrl(data.project_image_url);
            if (data.image_drive_link) setDriveUrl(data.image_drive_link);

            setSubmittedSuccess(true);
          }
        } catch (e) {
          console.warn("Could not check registration status", e);
        }
      } catch (err) {
        console.warn("Auth check failed:", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      if (selectedDomains.length >= 2) {
        toast.error("You can choose at most 2 domains.");
        return;
      }
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file (PNG, JPG, JPEG, WEBP).");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast.error("Image file size should be less than 15MB.");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Section 1 validation
    const finalYearOfStudy =
      yearOfStudyChoice === "other" ? yearOfStudyOther.trim() : yearOfStudyChoice;
    const finalDegree =
      degreeChoice === "other" ? degreeOther.trim() : degreeChoice;

    if (!ldapEmail.trim()) {
      toast.error("Please enter your LDAP Email ID.");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your Name.");
      return;
    }
    if (!rollNo.trim()) {
      toast.error("Please enter your Roll Number.");
      return;
    }
    if (!nonLdapEmail.trim()) {
      toast.error("Please enter your Non-LDAP Email ID.");
      return;
    }
    if (!contactNumber.trim()) {
      toast.error("Please enter your Contact Number.");
      return;
    }
    if (!finalYearOfStudy) {
      toast.error("Please specify your Year of Study.");
      return;
    }
    if (!academicDepartment.trim()) {
      toast.error("Please enter your Academic Department.");
      return;
    }
    if (!finalDegree) {
      toast.error("Please select or specify your Degree.");
      return;
    }

    // Section 2 validation
    if (!projectTitle.trim()) {
      toast.error("Please enter the Project Title.");
      return;
    }
    if (!projectDescription.trim()) {
      toast.error("Please enter the Project Description.");
      return;
    }
    if (selectedDomains.length === 0) {
      toast.error("Please select 1 or up to 2 domain(s) for the project.");
      return;
    }
    if (!projectCategory) {
      toast.error("Please select a project category.");
      return;
    }
    if (!durationWeeks) {
      toast.error("Please select the project duration.");
      return;
    }
    if (!weeklyTimeCommitment.trim()) {
      toast.error("Please enter the weekly time commitment required.");
      return;
    }
    if (!numMentees.trim()) {
      toast.error("Please enter the recommended number of mentees.");
      return;
    }
    if (!prerequisites.trim()) {
      toast.error("Please enter the pre-requisites for the project.");
      return;
    }
    if (!imageFile && !savedImageUrl && !savedImageName) {
      toast.error("Please upload an image relevant to the project.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("access_token") ?? "";
      const formData = new FormData();

      // Section 1
      formData.append("ldap_email", ldapEmail.trim());
      formData.append("name", name.trim());
      formData.append("roll_no", rollNo.trim());
      formData.append("non_ldap_email", nonLdapEmail.trim());
      formData.append("contact_number", contactNumber.trim());
      formData.append("year_of_study", finalYearOfStudy);
      formData.append("academic_department", academicDepartment.trim());
      formData.append("degree_enrolled", finalDegree);
      formData.append("co_mentor", coMentor);

      // Section 2
      formData.append("project_title", projectTitle.trim());
      formData.append("project_description", projectDescription.trim());
      formData.append("domains", JSON.stringify(selectedDomains));
      formData.append("project_category", projectCategory);
      formData.append("duration_weeks", durationWeeks);
      formData.append("weekly_time_commitment", weeklyTimeCommitment.trim());
      formData.append("num_mentees", numMentees.trim());
      formData.append("prerequisites", prerequisites.trim());

      // File attachment
      if (imageFile) {
        formData.append("project_image", imageFile);
      }

      const res = await fetch(`${API}/api/mentor/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data?.ok) {
        toast.success("Mentor Registration and Project Idea submitted successfully!");
        setSubmittedSuccess(true);
        if (data.image_name) setSavedImageName(data.image_name);
        if (data.image_url) setSavedImageUrl(data.image_url);
        if (data.image_drive_link) setDriveUrl(data.image_drive_link);
      } else {
        toast.error(data?.error || "Failed to submit registration.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(err?.message || "Error submitting registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Checking credentials, please wait...</p>
        </motion.div>
      </section>
    );
  }

  // CASE 1: User not logged in
  if (!isLoggedIn) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] text-center px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md max-w-lg shadow-2xl"
        >
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5 text-purple-400">
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
          <h2 className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-3">
            You're Not Logged In or Session Expired
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Please log in to view and view the mentor portal
          </p>
          <a
            href={authUrl}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition shadow-lg hover:shadow-purple-500/25"
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

  // Predicted image filename
  const predictedFileName = `${
    projectTitle.trim()
      ? projectTitle.trim().replace(/[\\/*?:"<>|]/g, "")
      : "Project Title"
  }.${imageFile ? imageFile.name.split(".").pop()?.toLowerCase() || "jpg" : "jpg"}`;

  // CASE 2: User is logged in -> Render Mentor Registration Form
  return (
    <section className="px-4 md:px-8 lg:px-12 pt-28 pb-16 bg-gradient-to-b from-[#1A141C] via-[#21162d]/50 to-[#1A141C] min-h-screen text-[#E7E3E5] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.2] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Mentor Registration Form
          </h1>
          <p className="text-lg sm:text-xl font-medium text-purple-200/90 max-w-2xl mx-auto mb-2">
            Are you passionate about Data Science, AI, or ML? Bring your innovative ideas to life through WiDS 5.0!
          </p>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
            We’re inviting skilled individuals to mentor the next generation of data enthusiasts!
          </p>
        </motion.div>

        {/* Mentorship Program Info & Guidelines Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-8 p-6 sm:p-8 rounded-3xl border border-purple-500/30 bg-[#1e152d]/70 backdrop-blur-md shadow-xl space-y-6 text-sm sm:text-base"
        >
          {/* Domains */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-purple-400 font-bold mb-2">
              Domains
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "NLP",
                "Computer Vision",
                "Agentic AI",
                "Quantitative Analytics",
                "Theoretical ML",
                "RL",
                "Core Projects",
              ].map((domain) => (
                <span
                  key={domain}
                  className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-200"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>

          {/* Mentorship Modes */}
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-3">
              Mentorship Modes
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                <span className="font-semibold text-blue-300 block mb-1">
                  Guided Project
                </span>
                <p className="text-xs sm:text-sm text-gray-300">
                  The mentees create their own projects with guidance and resources from the mentor.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10">
                <span className="font-semibold text-purple-300 block mb-1">
                  Collaborative Project
                </span>
                <p className="text-xs sm:text-sm text-gray-300">
                  The mentees would collaborate and work on the same project with the mentor.
                </p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-2">
              Requirements
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-300 list-disc list-inside">
              <li>Not open to 1st-year UGs</li>
              <li>Projects in Python only</li>
              <li>Prior experience & solid resources needed</li>
              <li>Only one project per mentor (co-mentorship allowed)</li>
            </ul>
          </div>

          {/* Closing & Signature */}
          <div className="border-t border-white/10 pt-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs sm:text-sm italic text-gray-300 font-medium">
              Make an impact. Share your expertise. Inspire the next wave of data scientists.
            </p>
            <span className="text-xs font-semibold tracking-wide text-purple-300 bg-purple-500/20 px-3 py-1 rounded-full border border-purple-400/30 whitespace-nowrap">
              — The Analytics Club
            </span>
          </div>
        </motion.div>

        {/* Success Banner if already submitted */}
        {submittedSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 sm:p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 shadow-xl space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-emerald-300 text-base">
                  Registration Response Recorded!
                </p>
                <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
                  Your mentor registration and project idea are saved in the WiDS database. You can review or update any information below.
                </p>
                {savedImageName && (
                  <p className="text-xs text-emerald-300/90 mt-2 font-mono">
                    Project Image Saved: <span className="font-semibold">{savedImageName}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 flex flex-wrap items-center gap-3">
              <a
                href={driveUrl || GDRIVE_FOLDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
                </svg>
                <span>View in WiDS Drive Folder</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </motion.div>
        )}

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#1e1726]/80 backdrop-blur-xl shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* ======================================================== */}
            {/* SECTION 1: GENERAL INFORMATION */}
            {/* ======================================================== */}
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  Section 1
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  General Information
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Basic details and mentor background information.
                </p>
              </div>

              {/* 1) LDAP Email ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  1) LDAP Email ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={ldapEmail}
                  onChange={(e) => setLdapEmail(e.target.value)}
                  placeholder="youremail@iitb.ac.in"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 2) Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  2) Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 3) Roll Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  3) Roll Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="eg. xxBxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 4) Non LDAP Email ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  4) Non LDAP Email ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={nonLdapEmail}
                  onChange={(e) => setNonLdapEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 5) Contact Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  5) Contact Number (Preferably WhatsApp) <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 6) Year Of Study */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  6) Year Of Study <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                  {yearOptions.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition ${
                        yearOfStudyChoice === opt
                          ? "bg-purple-600/30 border-purple-400 text-white shadow-sm"
                          : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="year_of_study"
                        value={opt}
                        checked={yearOfStudyChoice === opt}
                        onChange={() => setYearOfStudyChoice(opt)}
                        className="accent-purple-500"
                      />
                      <span className="capitalize">{opt}</span>
                    </label>
                  ))}
                </div>

                {yearOfStudyChoice === "other" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      required
                      value={yearOfStudyOther}
                      onChange={(e) => setYearOfStudyOther(e.target.value)}
                      placeholder="Please specify your year of study (e.g., 1st Year, Ph.D. 2nd Year)"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-purple-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                    />
                  </motion.div>
                )}
              </div>

              {/* 7) Academic Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  7) Academic Department <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={academicDepartment}
                  onChange={(e) => setAcademicDepartment(e.target.value)}
                  placeholder="e.g. Computer Science and Engineering"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 8) Degree Enrolled For */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  8) Degree Enrolled For <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={degreeChoice}
                  onChange={(e) => setDegreeChoice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#140e1b] border border-white/15 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                >
                  <option value="" disabled className="text-gray-500">
                    Select Degree Enrolled For
                  </option>
                  {degreeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#1e1726] text-white">
                      {opt}
                    </option>
                  ))}
                </select>

                {degreeChoice === "other" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3"
                  >
                    <input
                      type="text"
                      required
                      value={degreeOther}
                      onChange={(e) => setDegreeOther(e.target.value)}
                      placeholder="Please specify your degree"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-purple-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                    />
                  </motion.div>
                )}
              </div>

              {/* 9) Do you want to Co-Mentor? */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  9) Do you want to Co-Mentor? <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-6 mt-2">
                  {["Yes", "No"].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition ${
                        coMentor === opt
                          ? "bg-purple-600/30 border-purple-400 text-white"
                          : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="co_mentor"
                        value={opt}
                        checked={coMentor === opt}
                        onChange={() => setCoMentor(opt)}
                        className="accent-purple-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SECTION 2: PROJECT INFORMATION */}
            {/* ======================================================== */}
            <div className="space-y-6 pt-6 border-t border-purple-500/20">
              <div className="border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  Section 2
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  Project Information
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Details about the data science project you propose to mentor for WiDS 5.0.
                </p>
              </div>

              {/* 1) Name/Title of the Project */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">
                  1) Name/Title of the Project (To be displayed on the website){" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Agentic Multi-Agent Framework for Algorithmic Trading"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 2) Description of your Project Idea */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">
                  2) Description of your Project Idea (Detailed - To be displayed on the website){" "}
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Provide an overview of the project idea, motivation, key concepts explored, and expected outcomes..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition leading-relaxed"
                />
              </div>

              {/* 3) Domain(s) Classification */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-semibold text-gray-200">
                    3) In which of the following domain(s) would you classify the project?{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      selectedDomains.length > 0
                        ? "bg-purple-500/20 text-purple-300 border border-purple-400/40"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    Selected: {selectedDomains.length} / 2
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  You can choose 1 or up to 2 most relevant domains. Core projects should involve the intersection of core departmental areas and data science (or related domains).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {domainOptions.map((domain) => {
                    const isSelected = selectedDomains.includes(domain);
                    const isMaxReached = selectedDomains.length >= 2 && !isSelected;

                    return (
                      <button
                        type="button"
                        key={domain}
                        onClick={() => toggleDomain(domain)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-600/35 to-blue-600/35 border-purple-400 text-white shadow-md"
                            : isMaxReached
                            ? "bg-black/20 border-white/5 text-gray-500 cursor-not-allowed"
                            : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span>{domain}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isSelected
                              ? "bg-purple-500 border-purple-400 text-white"
                              : "border-white/20 bg-black/40"
                          }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4) Project Category (Guided / Collaborative) */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  4) In which category would you classify the project?{" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Guided Project */}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      projectCategory === "Guided Project"
                        ? "bg-purple-600/25 border-purple-400 shadow-md"
                        : "bg-black/30 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-purple-200">
                        Guided Project
                      </span>
                      <input
                        type="radio"
                        name="project_category"
                        value="Guided Project"
                        checked={projectCategory === "Guided Project"}
                        onChange={() => setProjectCategory("Guided Project")}
                        className="accent-purple-500 mt-1"
                      />
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      The mentees would be given the resources and create their own projects with guidance from the mentor.
                    </p>
                  </label>

                  {/* Collaborative Project */}
                  <label
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      projectCategory === "Collaborative Project"
                        ? "bg-blue-600/25 border-blue-400 shadow-md"
                        : "bg-black/30 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-blue-200">
                        Collaborative Project
                      </span>
                      <input
                        type="radio"
                        name="project_category"
                        value="Collaborative Project"
                        checked={projectCategory === "Collaborative Project"}
                        onChange={() => setProjectCategory("Collaborative Project")}
                        className="accent-blue-500 mt-1"
                      />
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      The mentees would collaborate and work on the same project with the mentor.
                    </p>
                  </label>
                </div>
              </div>

              {/* 5) Duration of the Project */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  5) Duration of the Project (Number of weeks){" "}
                  <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {durationOptions.map((dur) => (
                    <label
                      key={dur}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border cursor-pointer text-sm font-medium transition ${
                        durationWeeks === dur
                          ? "bg-purple-600/30 border-purple-400 text-white shadow-sm"
                          : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="duration_weeks"
                        value={dur}
                        checked={durationWeeks === dur}
                        onChange={() => setDurationWeeks(dur)}
                        className="accent-purple-500"
                      />
                      <span>{dur}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6) Weekly Time commitment required by mentees */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">
                  6) Weekly Time commitment required by mentees (in hours){" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={weeklyTimeCommitment}
                  onChange={(e) => setWeeklyTimeCommitment(e.target.value)}
                  placeholder="e.g. 6 to 8 hours / week"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 7) Number of mentees */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">
                  7) Number of mentees <span className="text-red-400">*</span>
                </label>
                <div className="p-3 mb-2.5 rounded-xl bg-purple-950/20 border border-purple-400/20 text-xs text-purple-200/90 leading-relaxed">
                  <span className="font-semibold block mb-0.5">Recommended number of mentees:</span>
                  <div className="flex flex-wrap gap-x-4">
                    <span>• Guided Project: <strong>5 to 25</strong></span>
                    <span>• Collaborative Project: <strong>2 to 10</strong></span>
                  </div>
                </div>
                <input
                  type="text"
                  required
                  value={numMentees}
                  onChange={(e) => setNumMentees(e.target.value)}
                  placeholder="e.g. 5 to 10 mentees"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                />
              </div>

              {/* 8) Pre-Requisites for the project */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">
                  8) Pre-Requisites for the project <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={prerequisites}
                  onChange={(e) => setPrerequisites(e.target.value)}
                  placeholder="e.g. Proficiency in Python, basic familiarity with Pandas & NumPy, basic Linear Algebra, interest in Deep Learning..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition leading-relaxed"
                />
              </div>

              {/* 9) Project Image Upload & Google Drive Integration */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">
                  9) An image relevant to the project to be displayed on the site (try to make it appealing){" "}
                  <span className="text-red-400">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">
                  Upload a high-quality illustration or graphic representing your project. The image will be automatically named after your Project Title and uploaded to the WiDS Google Drive folder.
                </p>

                {/* Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-purple-500/30 hover:border-purple-400/60 rounded-2xl p-6 text-center bg-black/30 hover:bg-black/40 cursor-pointer transition-all duration-200 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {imagePreview || savedImageUrl ? (
                    <div className="space-y-4">
                      <div className="relative inline-block mx-auto max-w-xs max-h-48 overflow-hidden rounded-xl border border-white/20 shadow-lg">
                        <img
                          src={imagePreview || savedImageUrl || ""}
                          alt="Project Preview"
                          className="w-full h-auto object-cover max-h-48"
                        />
                      </div>
                      <div className="text-xs text-gray-300">
                        <p className="font-semibold text-purple-300">
                          {imageFile ? imageFile.name : savedImageName || "Saved Project Image"}
                        </p>
                        <p className="text-gray-400 mt-0.5">
                          Click to choose a different image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-200">
                        Click or drag & drop to upload project image
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports PNG, JPG, JPEG, WEBP (Up to 15MB)
                      </p>
                    </div>
                  )}
                </div>

                {/* Live Name Preview & Google Drive Indicator */}
                <div className="mt-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-purple-200">
                    <span className="font-medium text-gray-400">Target Image Name:</span>
                    <span className="font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10 text-purple-300">
                      {predictedFileName}
                    </span>
                  </div>
                  <a
                    href={GDRIVE_FOLDER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-2"
                  >
                    <span>WiDS Drive Folder</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Registration & Uploading Image...</span>
                  </>
                ) : submittedSuccess ? (
                  <span>Update Registration & Project Proposal</span>
                ) : (
                  <span>Submit Mentor Registration</span>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default MentorPortal;
