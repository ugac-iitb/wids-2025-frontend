"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("Draft auto-save ready");

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

  // Section 3: Mentor Information
  const [pastProjectWork, setPastProjectWork] = useState("");
  const [pythonMlExperience, setPythonMlExperience] = useState("");
  const [projectResourcesLink, setProjectResourcesLink] = useState("");
  const [commentsSuggestions, setCommentsSuggestions] = useState("");

  // Image Upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [savedImageName, setSavedImageName] = useState<string | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [driveUrl, setDriveUrl] = useState<string>(GDRIVE_FOLDER_URL);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialLoadDone = useRef(false);

  const authUrl = `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${clientID}&response_type=code&scope=basic%20profile%20ldap%20program&redirect_uri=${encodeURIComponent(
    redirectURI
  )}&state=some_state`;

  const draftKey = `wids_mentor_draft_${ldapEmail || "anonymous"}`;

  // Initial Data Fetch & Load Draft
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

        const userLdap = me?.user?.email || "";
        if (userLdap) setLdapEmail(userLdap);
        if (me?.user?.name) setName(me.user.name);
        if (me?.user?.roll_no) setRollNo(me.user.roll_no);

        // Fetch saved status / cloud draft from Backend
        try {
          const statusRes = await fetchJSON(`${API}/api/mentor/registration-status`);
          if (statusRes?.submitted && statusRes?.data) {
            const data = statusRes.data;

            if (data.is_submitted) {
              setIsFinalSubmitted(true);
              setSubmittedAt(data.submitted_at);
            }

            if (data.ldap_email) setLdapEmail(data.ldap_email);
            if (data.name) setName(data.name);
            if (data.roll_no) setRollNo(data.roll_no);
            if (data.non_ldap_email) setNonLdapEmail(data.non_ldap_email);
            if (data.contact_number) setContactNumber(data.contact_number);
            if (data.academic_department) setAcademicDepartment(data.academic_department);
            if (data.co_mentor) setCoMentor(data.co_mentor);

            // Year of study
            if (yearOptions.slice(0, 4).includes(data.year_of_study)) {
              setYearOfStudyChoice(data.year_of_study);
            } else if (data.year_of_study) {
              setYearOfStudyChoice("other");
              setYearOfStudyOther(data.year_of_study);
            }

            // Degree
            if (degreeOptions.slice(0, 7).includes(data.degree_enrolled)) {
              setDegreeChoice(data.degree_enrolled);
            } else if (data.degree_enrolled) {
              setDegreeChoice("other");
              setDegreeOther(data.degree_enrolled);
            }

            // Section 2
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
            if (data.weekly_time_commitment) setWeeklyTimeCommitment(data.weekly_time_commitment);
            if (data.num_mentees) setNumMentees(data.num_mentees);
            if (data.prerequisites) setPrerequisites(data.prerequisites);
            if (data.image_name) setSavedImageName(data.image_name);
            if (data.project_image_url) setSavedImageUrl(data.project_image_url);
            if (data.image_drive_link) setDriveUrl(data.image_drive_link);

            // Section 3
            if (data.past_project_work) setPastProjectWork(data.past_project_work);
            if (data.python_ml_experience) setPythonMlExperience(data.python_ml_experience);
            if (data.project_resources_link) setProjectResourcesLink(data.project_resources_link);
            if (data.comments_suggestions) setCommentsSuggestions(data.comments_suggestions);

            setAutoSaveStatus(data.is_submitted ? "Application Finalized" : "Draft synced from account");
          } else {
            // If backend has no data, check local device storage for any draft
            const localKey = `wids_mentor_draft_${userLdap || "anonymous"}`;
            const rawDraft = localStorage.getItem(localKey);
            if (rawDraft) {
              try {
                const draft = JSON.parse(rawDraft);
                if (draft.nonLdapEmail) setNonLdapEmail(draft.nonLdapEmail);
                if (draft.contactNumber) setContactNumber(draft.contactNumber);
                if (draft.yearOfStudyChoice) setYearOfStudyChoice(draft.yearOfStudyChoice);
                if (draft.yearOfStudyOther) setYearOfStudyOther(draft.yearOfStudyOther);
                if (draft.academicDepartment) setAcademicDepartment(draft.academicDepartment);
                if (draft.degreeChoice) setDegreeChoice(draft.degreeChoice);
                if (draft.degreeOther) setDegreeOther(draft.degreeOther);
                if (draft.coMentor) setCoMentor(draft.coMentor);

                if (draft.projectTitle) setProjectTitle(draft.projectTitle);
                if (draft.projectDescription) setProjectDescription(draft.projectDescription);
                if (Array.isArray(draft.selectedDomains)) setSelectedDomains(draft.selectedDomains);
                if (draft.projectCategory) setProjectCategory(draft.projectCategory);
                if (draft.durationWeeks) setDurationWeeks(draft.durationWeeks);
                if (draft.weeklyTimeCommitment) setWeeklyTimeCommitment(draft.weeklyTimeCommitment);
                if (draft.numMentees) setNumMentees(draft.numMentees);
                if (draft.prerequisites) setPrerequisites(draft.prerequisites);

                if (draft.pastProjectWork) setPastProjectWork(draft.pastProjectWork);
                if (draft.pythonMlExperience) setPythonMlExperience(draft.pythonMlExperience);
                if (draft.projectResourcesLink) setProjectResourcesLink(draft.projectResourcesLink);
                if (draft.commentsSuggestions) setCommentsSuggestions(draft.commentsSuggestions);

                setAutoSaveStatus("Restored draft from device");
              } catch (err) {
                console.warn("Could not parse local draft", err);
              }
            }
          }
        } catch (e) {
          console.warn("Could not check registration status", e);
        }
      } catch (err) {
        console.warn("Auth check failed:", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
        initialLoadDone.current = true;
      }
    })();
  }, []);

  // Save to LocalStorage immediately on state changes
  useEffect(() => {
    if (!initialLoadDone.current || isFinalSubmitted || !isLoggedIn) return;

    const draftData = {
      nonLdapEmail,
      contactNumber,
      yearOfStudyChoice,
      yearOfStudyOther,
      academicDepartment,
      degreeChoice,
      degreeOther,
      coMentor,
      projectTitle,
      projectDescription,
      selectedDomains,
      projectCategory,
      durationWeeks,
      weeklyTimeCommitment,
      numMentees,
      prerequisites,
      pastProjectWork,
      pythonMlExperience,
      projectResourcesLink,
      commentsSuggestions,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(draftKey, JSON.stringify(draftData));
    setAutoSaveStatus("Draft auto-saved on device");
  }, [
    nonLdapEmail,
    contactNumber,
    yearOfStudyChoice,
    yearOfStudyOther,
    academicDepartment,
    degreeChoice,
    degreeOther,
    coMentor,
    projectTitle,
    projectDescription,
    selectedDomains,
    projectCategory,
    durationWeeks,
    weeklyTimeCommitment,
    numMentees,
    prerequisites,
    pastProjectWork,
    pythonMlExperience,
    projectResourcesLink,
    commentsSuggestions,
    isFinalSubmitted,
    isLoggedIn,
    draftKey,
  ]);

  // Cloud Draft Auto-Save Function (called on blur or explicit click)
  const saveCloudDraft = useCallback(
    async (showToast = false) => {
      if (!isLoggedIn || isFinalSubmitted || isSubmitting || isSavingDraft) return;

      const finalYearOfStudy =
        yearOfStudyChoice === "other" ? yearOfStudyOther.trim() : yearOfStudyChoice;
      const finalDegree =
        degreeChoice === "other" ? degreeOther.trim() : degreeChoice;

      setIsSavingDraft(true);
      setAutoSaveStatus("Saving draft to cloud...");

      try {
        const token = localStorage.getItem("access_token") ?? "";
        const formData = new FormData();

        formData.append("is_draft", "true");
        formData.append("ldap_email", ldapEmail.trim());
        formData.append("name", name.trim());
        formData.append("roll_no", rollNo.trim());
        formData.append("non_ldap_email", nonLdapEmail.trim());
        formData.append("contact_number", contactNumber.trim());
        formData.append("year_of_study", finalYearOfStudy);
        formData.append("academic_department", academicDepartment.trim());
        formData.append("degree_enrolled", finalDegree);
        formData.append("co_mentor", coMentor);

        formData.append("project_title", projectTitle.trim());
        formData.append("project_description", projectDescription.trim());
        formData.append("domains", JSON.stringify(selectedDomains));
        formData.append("project_category", projectCategory);
        formData.append("duration_weeks", durationWeeks);
        formData.append("weekly_time_commitment", weeklyTimeCommitment.trim());
        formData.append("num_mentees", numMentees.trim());
        formData.append("prerequisites", prerequisites.trim());

        formData.append("past_project_work", pastProjectWork.trim());
        formData.append("python_ml_experience", pythonMlExperience.trim());
        formData.append("project_resources_link", projectResourcesLink.trim());
        formData.append("comments_suggestions", commentsSuggestions.trim());

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
          setAutoSaveStatus("Draft synced with cloud");
          if (data.image_name) setSavedImageName(data.image_name);
          if (data.image_url) setSavedImageUrl(data.image_url);
          if (showToast) toast.success("Draft saved successfully to cloud!");
        } else {
          setAutoSaveStatus("Draft saved locally");
        }
      } catch (e) {
        console.warn("Cloud draft save error:", e);
        setAutoSaveStatus("Draft saved locally");
      } finally {
        setIsSavingDraft(false);
      }
    },
    [
      isLoggedIn,
      isFinalSubmitted,
      isSubmitting,
      isSavingDraft,
      yearOfStudyChoice,
      yearOfStudyOther,
      degreeChoice,
      degreeOther,
      ldapEmail,
      name,
      rollNo,
      nonLdapEmail,
      contactNumber,
      academicDepartment,
      coMentor,
      projectTitle,
      projectDescription,
      selectedDomains,
      projectCategory,
      durationWeeks,
      weeklyTimeCommitment,
      numMentees,
      prerequisites,
      pastProjectWork,
      pythonMlExperience,
      projectResourcesLink,
      commentsSuggestions,
      imageFile,
    ]
  );

  // Periodic Cloud Auto-Save (Every 45 seconds if changes occurred)
  useEffect(() => {
    if (!isLoggedIn || isFinalSubmitted) return;

    const interval = setInterval(() => {
      saveCloudDraft(false);
    }, 45000);

    return () => clearInterval(interval);
  }, [isLoggedIn, isFinalSubmitted, saveCloudDraft]);

  const toggleDomain = (domain: string) => {
    if (isFinalSubmitted) return;
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
    if (isFinalSubmitted) return;
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

  // Open confirmation modal before final submit
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFinalSubmitted) return;

    // Validate Section 1
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

    // Validate Section 2
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

    // Validate Section 3
    if (!pastProjectWork.trim()) {
      toast.error("Please fill in question 1 in Section 3 (Past Project Work or 'No').");
      return;
    }
    if (!pythonMlExperience.trim()) {
      toast.error("Please fill in question 2 in Section 3 (Python/ML Experience).");
      return;
    }
    if (!projectResourcesLink.trim()) {
      toast.error("Please fill in question 3 in Section 3 (Project Resources Link).");
      return;
    }

    setShowConfirmModal(true);
  };

  // Execute Final One-Time Submission
  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    const finalYearOfStudy =
      yearOfStudyChoice === "other" ? yearOfStudyOther.trim() : yearOfStudyChoice;
    const finalDegree =
      degreeChoice === "other" ? degreeOther.trim() : degreeChoice;

    try {
      const token = localStorage.getItem("access_token") ?? "";
      const formData = new FormData();

      formData.append("is_draft", "false"); // Final submission!

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

      // Section 3
      formData.append("past_project_work", pastProjectWork.trim());
      formData.append("python_ml_experience", pythonMlExperience.trim());
      formData.append("project_resources_link", projectResourcesLink.trim());
      formData.append("comments_suggestions", commentsSuggestions.trim());

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
        toast.success("Mentor Registration submitted and finalized successfully!");
        setIsFinalSubmitted(true);
        setSubmittedAt(new Date().toISOString());
        setAutoSaveStatus("Application Finalized & Locked");
        if (data.image_name) setSavedImageName(data.image_name);
        if (data.image_url) setSavedImageUrl(data.image_url);
        if (data.image_drive_link) setDriveUrl(data.image_drive_link);
        localStorage.removeItem(draftKey);
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
          <p className="text-lg text-gray-300">Checking credentials & loading draft...</p>
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
            Please log in to view and fill the mentor portal
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

  const predictedFileName = `${
    projectTitle.trim()
      ? projectTitle.trim().replace(/[\\/*?:"<>|]/g, "")
      : "Project Title"
  }.${imageFile ? imageFile.name.split(".").pop()?.toLowerCase() || "jpg" : "jpg"}`;

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
            Are you passionate about Data Science, AI, or ML? Bring your innovative ideas to life through WiDS 6.0!
          </p>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
            We’re inviting skilled individuals to mentor the next generation of data enthusiasts!
          </p>
        </motion.div>

        {/* ======================================================== */}
        {/* EXPLICIT NOTIFICATION CARDS: AUTO-SAVE & SUBMISSION POLICY */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-8 grid sm:grid-cols-2 gap-4"
        >
          {/* Card 1: Auto-Save Active */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 backdrop-blur-md flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 mt-0.5 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-blue-200 text-sm">Automatic Progress Saving</p>
              <p className="text-xs text-blue-300/80 mt-1 leading-relaxed">
                Incompletely filled responses are saved automatically as a draft. You can close this tab and return anytime or log in tomorrow to complete your submission.
              </p>
            </div>
          </div>

          {/* Card 2: One-Time Final Submission */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 backdrop-blur-md flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 mt-0.5 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-amber-200 text-sm">One-Time Final Submission</p>
              <p className="text-xs text-amber-300/80 mt-1 leading-relaxed">
                Once submitted, your application is permanently locked and cannot be updated. Please review all details and resources thoroughly before submitting.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Mentorship Program Info & Guidelines Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
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

        {/* LOCKED BANNER (If already final submitted) */}
        {isFinalSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 sm:p-6 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 shadow-xl space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 mt-0.5 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-emerald-200 text-base sm:text-lg">
                    Application Submitted & Locked
                  </p>
                  <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    Finalized
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 leading-relaxed">
                  Your mentor registration and project proposal have been successfully submitted and are currently under review by The Analytics Club. In accordance with the submission policy, further updates or modifications cannot be made.
                </p>
                {submittedAt && (
                  <p className="text-xs text-emerald-300/80 mt-1.5 font-mono">
                    Submitted on: {new Date(submittedAt).toLocaleString()}
                  </p>
                )}
                {savedImageName && (
                  <p className="text-xs text-emerald-300/90 mt-1 font-mono">
                    Project Image: <span className="font-semibold">{savedImageName}</span>
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
          transition={{ duration: 0.7, delay: 0.15 }}
          className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#1e1726]/80 backdrop-blur-xl shadow-2xl relative"
        >
          {/* Top Status Bar: Auto-Save Tracker */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isFinalSubmitted
                    ? "bg-emerald-400"
                    : isSavingDraft
                    ? "bg-amber-400 animate-pulse"
                    : "bg-blue-400 animate-pulse"
                }`}
              ></span>
              <span className="text-gray-300 font-medium">{autoSaveStatus}</span>
            </div>

            {!isFinalSubmitted && (
              <button
                type="button"
                onClick={() => saveCloudDraft(true)}
                disabled={isSavingDraft}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition flex items-center gap-1.5"
              >
                {isSavingDraft ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                )}
                <span>Save Draft Now</span>
              </button>
            )}
          </div>

          <form onSubmit={handlePreSubmit} className="space-y-10">

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
                  disabled={isFinalSubmitted}
                  value={ldapEmail}
                  onChange={(e) => setLdapEmail(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="youremail@iitb.ac.in"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isFinalSubmitted}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isFinalSubmitted}
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="eg. xxBxxxx"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isFinalSubmitted}
                  value={nonLdapEmail}
                  onChange={(e) => setNonLdapEmail(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isFinalSubmitted}
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                        isFinalSubmitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      } ${
                        yearOfStudyChoice === opt
                          ? "bg-purple-600/30 border-purple-400 text-white shadow-sm"
                          : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="year_of_study"
                        value={opt}
                        disabled={isFinalSubmitted}
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
                      disabled={isFinalSubmitted}
                      value={yearOfStudyOther}
                      onChange={(e) => setYearOfStudyOther(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="Please specify your year of study (e.g., 1st Year, Ph.D. 2nd Year)"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-purple-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isFinalSubmitted}
                  value={academicDepartment}
                  onChange={(e) => setAcademicDepartment(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="e.g. Computer Science and Engineering"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* 8) Degree Enrolled For */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  8) Degree Enrolled For <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  disabled={isFinalSubmitted}
                  value={degreeChoice}
                  onChange={(e) => setDegreeChoice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#140e1b] border border-white/15 text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                      disabled={isFinalSubmitted}
                      value={degreeOther}
                      onChange={(e) => setDegreeOther(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="Please specify your degree"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-purple-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                      className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl border text-sm font-medium transition ${
                        isFinalSubmitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      } ${
                        coMentor === opt
                          ? "bg-purple-600/30 border-purple-400 text-white"
                          : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="co_mentor"
                        value={opt}
                        disabled={isFinalSubmitted}
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
                  Details about the data science project you propose to mentor for WiDS 6.0.
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
                  disabled={isFinalSubmitted}
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="e.g. Agentic Multi-Agent Framework for Algorithmic Trading"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isFinalSubmitted}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="Provide an overview of the project idea, motivation, key concepts explored, and expected outcomes..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
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
                        disabled={isFinalSubmitted || (isMaxReached && !isSelected)}
                        onClick={() => toggleDomain(domain)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-purple-600/35 to-blue-600/35 border-purple-400 text-white shadow-md"
                            : isMaxReached || isFinalSubmitted
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
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isFinalSubmitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    } ${
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
                        disabled={isFinalSubmitted}
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
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isFinalSubmitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                    } ${
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
                        disabled={isFinalSubmitted}
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
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition ${
                        isFinalSubmitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                      } ${
                        durationWeeks === dur
                          ? "bg-purple-600/30 border-purple-400 text-white shadow-sm"
                          : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="duration_weeks"
                        value={dur}
                        disabled={isFinalSubmitted}
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
                  disabled={isFinalSubmitted}
                  value={weeklyTimeCommitment}
                  onChange={(e) => setWeeklyTimeCommitment(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="e.g. 6 to 8 hours / week"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isFinalSubmitted}
                  value={numMentees}
                  onChange={(e) => setNumMentees(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="e.g. 5 to 10 mentees"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isFinalSubmitted}
                  value={prerequisites}
                  onChange={(e) => setPrerequisites(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="e.g. Proficiency in Python, basic familiarity with Pandas & NumPy, basic Linear Algebra, interest in Deep Learning..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
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
                  onClick={() => {
                    if (!isFinalSubmitted) fileInputRef.current?.click();
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 group ${
                    isFinalSubmitted
                      ? "border-white/10 bg-black/20 cursor-not-allowed opacity-75"
                      : "border-purple-500/30 hover:border-purple-400/60 bg-black/30 hover:bg-black/40 cursor-pointer"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={isFinalSubmitted}
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
                        {!isFinalSubmitted && (
                          <p className="text-gray-400 mt-0.5">
                            Click to choose a different image
                          </p>
                        )}
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

                {/* Target Name Preview & Google Drive Indicator */}
                <div className="mt-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-400/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-purple-200">
                    <span className="font-medium text-gray-400">Target Image Name:</span>
                    <span className="font-mono bg-black/40 px-2 py-0.5 rounded border border-white/10 text-purple-300">
                      {predictedFileName}
                    </span>
                  </div>
                  <a
                    href={driveUrl || GDRIVE_FOLDER_URL}
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

            {/* ======================================================== */}
            {/* SECTION 3: MENTOR INFORMATION */}
            {/* ======================================================== */}
            <div className="space-y-6 pt-6 border-t border-purple-500/20">
              <div className="border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-400/30">
                  Section 3
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  Mentor Information
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                  Your prior technical experience and initial week-wise resources for the project.
                </p>
              </div>

              {/* 1) Past project experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1 leading-relaxed">
                  1) Have you previously completed/worked on this (or a similar) project? If Yes, please share the GitHub Repo/Google Drive Link of the code files, if No, fill in "No"{" "}
                  <span className="text-red-400">*</span>
                </label>
                <p className="text-xs text-purple-300/90 mb-2 italic">
                  You are encouraged to create new projects and bring your unique ideas to life through WiDS 6.0
                </p>
                <textarea
                  required
                  rows={4}
                  disabled={isFinalSubmitted}
                  value={pastProjectWork}
                  onChange={(e) => setPastProjectWork(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="If Yes, share the GitHub repo or Google Drive link with brief details. If No, fill in 'No'..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* 2) Project/Course Experience in Python/ML */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1 leading-relaxed">
                  2) Project/Course Experience in Python/ML (Can be Self Projects, Institute projects/courses, Online Courses, Professional/Research Experience, etc.){" "}
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  disabled={isFinalSubmitted}
                  value={pythonMlExperience}
                  onChange={(e) => setPythonMlExperience(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="Detail relevant coursework (e.g. CS 725, CS 419), independent projects, internships, research or tools mastered..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* 3) GitHub Link/Google Drive Link/Notion Page Link for Project Resources */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1 leading-relaxed">
                  3) GitHub Link/Google Drive Link/Notion Page Link for Project Resources (Upload resources at least up to Week 1){" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  disabled={isFinalSubmitted}
                  value={projectResourcesLink}
                  onChange={(e) => setProjectResourcesLink(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="https://github.com/... or https://drive.google.com/... or Notion URL"
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>

              {/* 4) Comments/Questions/Suggestions */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1 leading-relaxed">
                  4) Comments/Questions/Suggestions:
                </label>
                <textarea
                  rows={3}
                  disabled={isFinalSubmitted}
                  value={commentsSuggestions}
                  onChange={(e) => setCommentsSuggestions(e.target.value)}
                  onBlur={() => saveCloudDraft(false)}
                  placeholder="Any questions or special requests for the WiDS team..."
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Final Submission Notice & Actions */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              {!isFinalSubmitted ? (
                <>
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-400/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <span className="font-semibold block text-amber-300">Important Submission Policy:</span>
                      Once you click Submit, your answers are final and locked for review. You will <strong>NOT</strong> be able to update or modify your submission afterwards.
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => saveCloudDraft(true)}
                      disabled={isSavingDraft || isSubmitting}
                      className="w-full sm:w-auto py-3.5 px-6 rounded-xl font-medium text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      <span>{isSavingDraft ? "Saving Draft..." : "Save Draft"}</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:flex-1 py-4 px-6 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 shadow-xl hover:shadow-purple-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Finalizing Application...</span>
                        </>
                      ) : (
                        <span>Submit Mentor Registration</span>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                  <p className="text-emerald-300 font-semibold text-sm">
                    🔒 Application Finalized & Locked
                  </p>
                  <p className="text-xs text-emerald-200/80 mt-1">
                    Your responses are submitted and securely stored in the WiDS database.
                  </p>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>

      {/* Confirmation Modal Before Final Submit */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full p-6 sm:p-8 rounded-2xl bg-[#21162d] border border-purple-500/30 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white">
                  Confirm Final Submission?
                </h3>
                <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                  Submitting your application is <strong>permanent</strong>. Once submitted, your registration will be locked and you will <strong>NOT</strong> be able to edit your project proposal or mentor details.
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-sm text-gray-300 bg-white/5 hover:bg-white/10 border border-white/10 transition"
                >
                  Review Again
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition shadow-lg hover:shadow-purple-500/25"
                >
                  Yes, Submit Final
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MentorPortal;
