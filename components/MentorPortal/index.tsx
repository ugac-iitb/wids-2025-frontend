"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL, clientID, redirectURI } from "@/lib/constants";
import toast from "react-hot-toast";

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

const MentorPortal = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form Fields
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    setIsSubmitting(true);
    try {
      const payload = {
        ldap_email: ldapEmail.trim(),
        name: name.trim(),
        roll_no: rollNo.trim(),
        non_ldap_email: nonLdapEmail.trim(),
        contact_number: contactNumber.trim(),
        year_of_study: finalYearOfStudy,
        academic_department: academicDepartment.trim(),
        degree_enrolled: finalDegree,
        co_mentor: coMentor,
      };

      const res = await fetchJSON(`${API}/api/mentor/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res?.ok) {
        toast.success("Mentor Registration submitted successfully!");
        setSubmittedSuccess(true);
      } else {
        toast.error(res?.error || "Failed to submit registration.");
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

  // 🟣 CASE 1: User not logged in (Exact requested messaging and styling)
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
              xmlns="http://www.w3.org/2000/svg"
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

  // 🟢 CASE 2: User is logged in -> Render Mentor Registration Form
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
            className="mb-8 p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-start gap-3 shadow-lg"
          >
            <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-300">Registration Response Recorded!</p>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-0.5">
                Your mentor registration is saved. You can update any information below and click "Update Registration" to save changes.
              </p>
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
          <form onSubmit={handleSubmit} className="space-y-6">

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
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition ${yearOfStudyChoice === opt
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

              {/* Space for user input if 'other' is selected */}
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

              {/* Space for user input if 'other' is selected */}
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
                    className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition ${coMentor === opt
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

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Registration...</span>
                  </>
                ) : submittedSuccess ? (
                  <span>Update Registration</span>
                ) : (
                  <span>Submit Form</span>
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
