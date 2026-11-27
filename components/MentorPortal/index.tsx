"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL, clientID, redirectURI } from "@/lib/constants";

const API = `${API_URL}`;
import toast from "react-hot-toast";

async function fetchJSON(url: string, opts: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "ngrok-skip-browser-warning": "true",
    ...(opts.headers || {}),
  };
  const res = await fetch(url, { ...opts, headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const yearOptions = ["2nd", "3rd", "4th", "5th", "other"];
const degreeOptions = [
  "B.Tech",
  "Dual Degree",
  "M.Tech",
  "B.S",
  "M.Sc",
  "B.Des",
  "M.Des",
  "Ph.D",
  "Other",
];

const domainOptions = [
  "Finance & Algorithmic Trading",
  "Bio-Medical & Health Analytics",
  "Natural Language Processing (NLP) & LLMs",
  "Computer Vision & Multi-Modal",
  "Speech, Audio & Acoustics",
  "Deep Learning & Neural Architectures",
  "Quantitative Analytics",
  "Theoretical Machine Learning",
  "Reinforcement Learning",
  "Miscellaneous",
];

const durationOptions = ["3 weeks", "4 weeks", "5 weeks", "6 weeks"];

interface FormStep {
  id: number;
  key: "section-1" | "section-1-appendix" | "section-2" | "section-3";
  title: string;
  badge: string;
}

const MentorPortal = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("Draft auto-save ready");

  // Multi-step Section Navigation
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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

  // Section 1 Appendix: Co-Mentor Information
  const [comentorLdapEmail, setComentorLdapEmail] = useState("");
  const [comentorName, setComentorName] = useState("");
  const [comentorRollNo, setComentorRollNo] = useState("");
  const [comentorNonLdapEmail, setComentorNonLdapEmail] = useState("");
  const [comentorContactNumber, setComentorContactNumber] = useState("");
  const [comentorYearOfStudyChoice, setComentorYearOfStudyChoice] = useState("2nd");
  const [comentorYearOfStudyOther, setComentorYearOfStudyOther] = useState("");
  const [comentorAcademicDepartment, setComentorAcademicDepartment] = useState("");
  const [comentorDegreeChoice, setComentorDegreeChoice] = useState("");
  const [comentorDegreeOther, setComentorDegreeOther] = useState("");

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
  const [imageUploadedToCloud, setImageUploadedToCloud] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [savedImageName, setSavedImageName] = useState<string | null>(null);
  const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null);
  const [imageDriveLink, setImageDriveLink] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialLoadDone = useRef(false);
  const isNavigatingStep = useRef(false);

  const authUrl = `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${clientID}&response_type=code&scope=basic%20profile%20ldap%20program&redirect_uri=${encodeURIComponent(
    redirectURI
  )}&state=some_state`;

  const draftKey = `wids_mentor_draft_${ldapEmail || "anonymous"}`;

  const getFullImageUrl = (url: string | null): string | null => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const baseBackend = API.replace(/\/apis-wids.*/, "");
    return `${baseBackend}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Dynamic Step List based on Co-Mentor choice
  const stepList: FormStep[] = useMemo(() => {
    const steps: FormStep[] = [
      { id: 1, key: "section-1", title: "General Information", badge: "Section 1" },
    ];
    if (coMentor === "Yes") {
      steps.push({
        id: 2,
        key: "section-1-appendix",
        title: "Co-Mentor Details",
        badge: "Section 1 Appendix",
      });
      steps.push({
        id: 3,
        key: "section-2",
        title: "Project Information",
        badge: "Section 2",
      });
      steps.push({
        id: 4,
        key: "section-3",
        title: "Mentor Information",
        badge: "Section 3",
      });
    } else {
      steps.push({
        id: 2,
        key: "section-2",
        title: "Project Information",
        badge: "Section 2",
      });
      steps.push({
        id: 3,
        key: "section-3",
        title: "Mentor Information",
        badge: "Section 3",
      });
    }
    return steps;
  }, [coMentor]);

  // Clamp step index if steps array shrinks (e.g. Yes -> No)
  useEffect(() => {
    if (currentStepIndex >= stepList.length) {
      setCurrentStepIndex(stepList.length - 1);
    }
  }, [stepList.length, currentStepIndex]);

  const currentStepKey = stepList[currentStepIndex]?.key || "section-1";

  // Helpers to resolve degree/year values
  const getPrimaryYear = () =>
    yearOfStudyChoice === "other" ? yearOfStudyOther.trim() : yearOfStudyChoice;

  const getPrimaryDegree = () =>
    degreeChoice.toLowerCase() === "other" ? degreeOther.trim() : degreeChoice;

  const getComentorYear = () =>
    comentorYearOfStudyChoice === "other"
      ? comentorYearOfStudyOther.trim()
      : comentorYearOfStudyChoice;

  const getComentorDegree = () =>
    comentorDegreeChoice.toLowerCase() === "other"
      ? comentorDegreeOther.trim()
      : comentorDegreeChoice;

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

            // Section 1
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
            if (degreeOptions.slice(0, 8).includes(data.degree_enrolled)) {
              setDegreeChoice(data.degree_enrolled);
            } else if (data.degree_enrolled) {
              setDegreeChoice("Other");
              setDegreeOther(data.degree_enrolled);
            }

            // Section 1 Appendix: Co-Mentor
            if (data.comentor_ldap_email) setComentorLdapEmail(data.comentor_ldap_email);
            if (data.comentor_name) setComentorName(data.comentor_name);
            if (data.comentor_roll_no) setComentorRollNo(data.comentor_roll_no);
            if (data.comentor_non_ldap_email) setComentorNonLdapEmail(data.comentor_non_ldap_email);
            if (data.comentor_contact_number) setComentorContactNumber(data.comentor_contact_number);
            if (data.comentor_academic_department) setComentorAcademicDepartment(data.comentor_academic_department);

            if (data.comentor_year_of_study) {
              if (yearOptions.slice(0, 4).includes(data.comentor_year_of_study)) {
                setComentorYearOfStudyChoice(data.comentor_year_of_study);
              } else {
                setComentorYearOfStudyChoice("other");
                setComentorYearOfStudyOther(data.comentor_year_of_study);
              }
            }

            if (data.comentor_degree_enrolled) {
              if (degreeOptions.slice(0, 8).includes(data.comentor_degree_enrolled)) {
                setComentorDegreeChoice(data.comentor_degree_enrolled);
              } else {
                setComentorDegreeChoice("Other");
                setComentorDegreeOther(data.comentor_degree_enrolled);
              }
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
            if (data.project_image_url) {
              setSavedImageUrl(getFullImageUrl(data.project_image_url));
              setImageUploadedToCloud(true);
            }
            if (data.image_drive_link) setImageDriveLink(data.image_drive_link);

            // Load local draft as fallback if cloud draft is missing any fields
            const localKey = `wids_mentor_draft_${userLdap || "anonymous"}`;
            const rawDraft = localStorage.getItem(localKey);
            let localDraft: any = null;
            if (rawDraft) {
              try {
                localDraft = JSON.parse(rawDraft);
              } catch {}
            }

            // Section 3
            if (data.past_project_work) {
              setPastProjectWork(data.past_project_work);
            } else if (localDraft?.pastProjectWork) {
              setPastProjectWork(localDraft.pastProjectWork);
            }

            if (data.python_ml_experience) {
              setPythonMlExperience(data.python_ml_experience);
            } else if (localDraft?.pythonMlExperience) {
              setPythonMlExperience(localDraft.pythonMlExperience);
            }

            if (data.project_resources_link) {
              setProjectResourcesLink(data.project_resources_link);
            } else if (localDraft?.projectResourcesLink) {
              setProjectResourcesLink(localDraft.projectResourcesLink);
            }

            if (data.comments_suggestions) {
              setCommentsSuggestions(data.comments_suggestions);
            } else if (localDraft?.commentsSuggestions) {
              setCommentsSuggestions(localDraft.commentsSuggestions);
            }

            setAutoSaveStatus(data.is_submitted ? "Application Finalized" : "Draft synced from account");
          } else {
            // Check local device storage fallback
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

                if (draft.comentorLdapEmail) setComentorLdapEmail(draft.comentorLdapEmail);
                if (draft.comentorName) setComentorName(draft.comentorName);
                if (draft.comentorRollNo) setComentorRollNo(draft.comentorRollNo);
                if (draft.comentorNonLdapEmail) setComentorNonLdapEmail(draft.comentorNonLdapEmail);
                if (draft.comentorContactNumber) setComentorContactNumber(draft.comentorContactNumber);
                if (draft.comentorYearOfStudyChoice) setComentorYearOfStudyChoice(draft.comentorYearOfStudyChoice);
                if (draft.comentorYearOfStudyOther) setComentorYearOfStudyOther(draft.comentorYearOfStudyOther);
                if (draft.comentorAcademicDepartment) setComentorAcademicDepartment(draft.comentorAcademicDepartment);
                if (draft.comentorDegreeChoice) setComentorDegreeChoice(draft.comentorDegreeChoice);
                if (draft.comentorDegreeOther) setComentorDegreeOther(draft.comentorDegreeOther);

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
                if (draft.imageDriveLink) setImageDriveLink(draft.imageDriveLink);

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
    if (!initialLoadDone.current || isFinalSubmitted) return;

    const draft = {
      nonLdapEmail,
      contactNumber,
      yearOfStudyChoice,
      yearOfStudyOther,
      academicDepartment,
      degreeChoice,
      degreeOther,
      coMentor,
      // Co-mentor
      comentorLdapEmail,
      comentorName,
      comentorRollNo,
      comentorNonLdapEmail,
      comentorContactNumber,
      comentorYearOfStudyChoice,
      comentorYearOfStudyOther,
      comentorAcademicDepartment,
      comentorDegreeChoice,
      comentorDegreeOther,
      // Section 2
      projectTitle,
      projectDescription,
      selectedDomains,
      projectCategory,
      durationWeeks,
      weeklyTimeCommitment,
      numMentees,
      prerequisites,
      // Section 3
      pastProjectWork,
      pythonMlExperience,
      projectResourcesLink,
      commentsSuggestions,
      imageDriveLink,
      savedImageName,
    };

    localStorage.setItem(draftKey, JSON.stringify(draft));
  }, [
    draftKey,
    isFinalSubmitted,
    nonLdapEmail,
    contactNumber,
    yearOfStudyChoice,
    yearOfStudyOther,
    academicDepartment,
    degreeChoice,
    degreeOther,
    coMentor,
    comentorLdapEmail,
    comentorName,
    comentorRollNo,
    comentorNonLdapEmail,
    comentorContactNumber,
    comentorYearOfStudyChoice,
    comentorYearOfStudyOther,
    comentorAcademicDepartment,
    comentorDegreeChoice,
    comentorDegreeOther,
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
    imageDriveLink,
    savedImageName,
  ]);

  // Periodic Auto-Save to Cloud
  useEffect(() => {
    if (!initialLoadDone.current || isFinalSubmitted || !isLoggedIn) return;

    const timer = setInterval(() => {
      saveCloudDraft(false);
    }, 45000);

    return () => clearInterval(timer);
  }, [
    isFinalSubmitted,
    isLoggedIn,
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
  ]);

  // Save Draft to Backend
  const saveCloudDraft = async (showToast = false) => {
    if (isFinalSubmitted || isSavingDraft || !isLoggedIn) return;

    setIsSavingDraft(true);
    setAutoSaveStatus("Auto-saving to WiDS Cloud...");

    try {
      const token = localStorage.getItem("access_token") ?? "";
      const formData = new FormData();

      formData.append("is_draft", "true");

      // Section 1
      formData.append("ldap_email", ldapEmail.trim());
      formData.append("name", name.trim());
      formData.append("roll_no", rollNo.trim());
      formData.append("non_ldap_email", nonLdapEmail.trim());
      formData.append("contact_number", contactNumber.trim());
      formData.append("year_of_study", getPrimaryYear());
      formData.append("academic_department", academicDepartment.trim());
      formData.append("degree_enrolled", getPrimaryDegree());
      formData.append("co_mentor", coMentor);

      // Section 1 Appendix: Co-Mentor
      if (coMentor === "Yes") {
        formData.append("comentor_ldap_email", comentorLdapEmail.trim());
        formData.append("comentor_name", comentorName.trim());
        formData.append("comentor_roll_no", comentorRollNo.trim());
        formData.append("comentor_non_ldap_email", comentorNonLdapEmail.trim());
        formData.append("comentor_contact_number", comentorContactNumber.trim());
        formData.append("comentor_year_of_study", getComentorYear());
        formData.append("comentor_academic_department", comentorAcademicDepartment.trim());
        formData.append("comentor_degree_enrolled", getComentorDegree());
      } else {
        formData.append("comentor_ldap_email", "");
        formData.append("comentor_name", "");
        formData.append("comentor_roll_no", "");
        formData.append("comentor_non_ldap_email", "");
        formData.append("comentor_contact_number", "");
        formData.append("comentor_year_of_study", "");
        formData.append("comentor_academic_department", "");
        formData.append("comentor_degree_enrolled", "");
      }

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
      const draftPastWork = pastProjectWork.trim() || (typeof document !== "undefined" ? (document.getElementById("field-past-project-work") as HTMLTextAreaElement)?.value?.trim() || "" : "");
      formData.append("past_project_work", draftPastWork);

      const draftPythonExp = pythonMlExperience.trim() || (typeof document !== "undefined" ? (document.getElementById("field-python-ml-experience") as HTMLTextAreaElement)?.value?.trim() || "" : "");
      formData.append("python_ml_experience", draftPythonExp);

      const draftResLink = projectResourcesLink.trim() || (typeof document !== "undefined" ? (document.getElementById("field-project-resources-link") as HTMLInputElement)?.value?.trim() || "" : "");
      formData.append("project_resources_link", draftResLink);
      formData.append("comments_suggestions", commentsSuggestions.trim());

      if (imageDriveLink.trim()) {
        formData.append("image_drive_link", imageDriveLink.trim());
      }
      if (imageFile && !imageUploadedToCloud) {
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

      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn("Non-JSON auto-save draft response:", rawText);
        setAutoSaveStatus("Draft saved locally");
        return;
      }

      if (res.ok && data?.ok) {
        setAutoSaveStatus("Draft synced with cloud");
        if (data.image_name) {
          setSavedImageName(data.image_name);
          setImageUploadedToCloud(true);
        }
        if (data.image_url) setSavedImageUrl(getFullImageUrl(data.image_url));
        if (data.image_drive_link) setImageDriveLink(data.image_drive_link);
        if (showToast) {
          toast.success("Draft saved to cloud successfully!");
        }
      } else {
        setAutoSaveStatus("Draft saved locally");
      }
    } catch (e) {
      console.warn("Cloud draft save error:", e);
      setAutoSaveStatus("Draft saved locally");
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Toggle domain selection (max 2)
  const toggleDomain = (domain: string) => {
    if (isFinalSubmitted) return;
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      if (selectedDomains.length >= 2) {
        toast.error("You can select at most 2 domains for your project.");
        return;
      }
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  // Image Upload handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinalSubmitted) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toast.error("File size exceeds 15MB limit. Please upload a smaller image.");
      return;
    }

    setImageFile(file);
    setImageUploadedToCloud(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setTimeout(() => {
      saveCloudDraft(false);
    }, 300);
  };

  // Auto-scroll helper with navbar offset
  const scrollToField = (fieldId: string) => {
    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (el) {
        const yOffset = -140;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        if ("focus" in el && typeof (el as HTMLElement).focus === "function") {
          (el as HTMLElement).focus();
        }
      }
    }, 60);
  };

  const scrollToFormTop = () => {
    setTimeout(() => {
      const container = document.getElementById("mentor-form-container");
      if (container) {
        const yOffset = -100;
        const y = container.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 50);
  };

  // ========================================================
  // PER-SECTION VALIDATION
  // ========================================================
  const validateSection1 = (): boolean => {
    const finalYearOfStudy = getPrimaryYear();
    const finalDegree = getPrimaryDegree();

    if (!ldapEmail.trim()) {
      toast.error("Please enter your LDAP Email ID.");
      scrollToField("field-ldap-email");
      return false;
    }
    if (!name.trim()) {
      toast.error("Please enter your Name.");
      scrollToField("field-name");
      return false;
    }
    if (!rollNo.trim()) {
      toast.error("Please enter your Roll Number.");
      scrollToField("field-roll-no");
      return false;
    }
    if (!nonLdapEmail.trim()) {
      toast.error("Please enter your Non-LDAP Email ID.");
      scrollToField("field-non-ldap-email");
      return false;
    }
    if (!contactNumber.trim()) {
      toast.error("Please enter your Contact Number.");
      scrollToField("field-contact-number");
      return false;
    }
    if (!finalYearOfStudy) {
      toast.error("Please specify your Year of Study.");
      scrollToField("field-year-of-study");
      return false;
    }
    if (!academicDepartment.trim()) {
      toast.error("Please enter your Academic Department.");
      scrollToField("field-academic-department");
      return false;
    }
    if (!finalDegree) {
      toast.error("Please select or specify your Degree.");
      scrollToField("field-degree");
      return false;
    }
    return true;
  };

  const validateSection1Appendix = (): boolean => {
    const finalComentorYear = getComentorYear();
    const finalComentorDegree = getComentorDegree();

    if (!comentorLdapEmail.trim()) {
      toast.error("Please enter the Co-Mentor's LDAP Email ID.");
      scrollToField("field-comentor-ldap-email");
      return false;
    }
    if (!comentorName.trim()) {
      toast.error("Please enter the Co-Mentor's Name.");
      scrollToField("field-comentor-name");
      return false;
    }
    if (!comentorRollNo.trim()) {
      toast.error("Please enter the Co-Mentor's Roll Number.");
      scrollToField("field-comentor-roll-no");
      return false;
    }
    if (!comentorNonLdapEmail.trim()) {
      toast.error("Please enter the Co-Mentor's Non-LDAP Email ID.");
      scrollToField("field-comentor-non-ldap-email");
      return false;
    }
    if (!comentorContactNumber.trim()) {
      toast.error("Please enter the Co-Mentor's Contact Number.");
      scrollToField("field-comentor-contact-number");
      return false;
    }
    if (!finalComentorYear) {
      toast.error("Please specify the Co-Mentor's Year of Study.");
      scrollToField("field-comentor-year-of-study");
      return false;
    }
    if (!comentorAcademicDepartment.trim()) {
      toast.error("Please enter the Co-Mentor's Academic Department.");
      scrollToField("field-comentor-academic-department");
      return false;
    }
    if (!finalComentorDegree) {
      toast.error("Please select or specify the Co-Mentor's Degree.");
      scrollToField("field-comentor-degree");
      return false;
    }
    return true;
  };

  const validateSection2 = (): boolean => {
    if (!projectTitle.trim()) {
      toast.error("Please enter the Project Title.");
      scrollToField("field-project-title");
      return false;
    }
    if (!projectDescription.trim()) {
      toast.error("Please enter the Project Description.");
      scrollToField("field-project-description");
      return false;
    }
    if (selectedDomains.length === 0) {
      toast.error("Please select 1 or up to 2 domain(s) for the project.");
      scrollToField("field-project-domains");
      return false;
    }
    if (!projectCategory) {
      toast.error("Please select a project category.");
      scrollToField("field-project-category");
      return false;
    }
    if (!durationWeeks) {
      toast.error("Please select the project duration.");
      scrollToField("field-duration-weeks");
      return false;
    }
    if (!weeklyTimeCommitment.trim()) {
      toast.error("Please enter the weekly time commitment required.");
      scrollToField("field-weekly-time-commitment");
      return false;
    }
    if (!numMentees.trim()) {
      toast.error("Please enter the recommended number of mentees.");
      scrollToField("field-num-mentees");
      return false;
    }
    if (!prerequisites.trim()) {
      toast.error("Please enter the pre-requisites for the project.");
      scrollToField("field-prerequisites");
      return false;
    }
    if (!imageFile && !savedImageUrl && !savedImageName) {
      toast.error("Please upload an image relevant to the project.");
      scrollToField("field-project-image");
      return false;
    }
    return true;
  };

  const validateSection3 = (): boolean => {
    const pastVal = pastProjectWork.trim() || (typeof document !== "undefined" ? (document.getElementById("field-past-project-work") as HTMLTextAreaElement)?.value?.trim() || "" : "");
    if (!pastVal) {
      toast.error("Please fill in question 1 in Section 3 (Past Project Work or 'No').");
      scrollToField("field-past-project-work");
      return false;
    }
    if (!pastProjectWork.trim() && pastVal) setPastProjectWork(pastVal);

    const pyVal = pythonMlExperience.trim() || (typeof document !== "undefined" ? (document.getElementById("field-python-ml-experience") as HTMLTextAreaElement)?.value?.trim() || "" : "");
    if (!pyVal) {
      toast.error("Please fill in question 2 in Section 3 (Python/ML Experience).");
      scrollToField("field-python-ml-experience");
      return false;
    }
    if (!pythonMlExperience.trim() && pyVal) setPythonMlExperience(pyVal);

    const resVal = projectResourcesLink.trim() || (typeof document !== "undefined" ? (document.getElementById("field-project-resources-link") as HTMLInputElement)?.value?.trim() || "" : "");
    if (!resVal) {
      toast.error("Please fill in question 3 in Section 3 (Project Resources Link). If not ready yet, write 'Will provide before bootcamp' or 'To be updated'.");
      scrollToField("field-project-resources-link");
      return false;
    }
    if (!projectResourcesLink.trim() && resVal) setProjectResourcesLink(resVal);

    return true;
  };

  // Multi-step Navigation Handlers
  const handleNextStep = () => {
    if (isNavigatingStep.current) return;
    if (isFinalSubmitted) {
      if (currentStepIndex < stepList.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
        scrollToFormTop();
      }
      return;
    }

    const currentKey = stepList[currentStepIndex]?.key;
    if (currentKey === "section-1") {
      if (!validateSection1()) return;
    } else if (currentKey === "section-1-appendix") {
      if (!validateSection1Appendix()) return;
    } else if (currentKey === "section-2") {
      if (!validateSection2()) return;
    }

    isNavigatingStep.current = true;
    setTimeout(() => {
      isNavigatingStep.current = false;
    }, 400);

    saveCloudDraft(false);
    if (currentStepIndex < stepList.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      scrollToFormTop();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      if (!isFinalSubmitted) {
        saveCloudDraft(false);
      }
      setCurrentStepIndex((prev) => prev - 1);
      scrollToFormTop();
    }
  };

  // Final Form Pre-Submit (Only triggered by clicking the final Submit button)
  const handlePreSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (isFinalSubmitted) return;

    // Strict guard: Only allow submission when on the final step
    if (currentStepIndex !== stepList.length - 1) {
      return;
    }

    if (!validateSection1()) {
      const s1Idx = stepList.findIndex((s) => s.key === "section-1");
      if (s1Idx >= 0) setCurrentStepIndex(s1Idx);
      return;
    }
    if (coMentor === "Yes") {
      if (!validateSection1Appendix()) {
        const appendixIdx = stepList.findIndex((s) => s.key === "section-1-appendix");
        if (appendixIdx >= 0) setCurrentStepIndex(appendixIdx);
        return;
      }
    }
    if (!validateSection2()) {
      const s2Idx = stepList.findIndex((s) => s.key === "section-2");
      if (s2Idx >= 0) setCurrentStepIndex(s2Idx);
      return;
    }
    if (!validateSection3()) {
      const s3Idx = stepList.findIndex((s) => s.key === "section-3");
      if (s3Idx >= 0) setCurrentStepIndex(s3Idx);
      return;
    }

    setShowConfirmModal(true);
  };

  // Execute Final One-Time Submission
  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("access_token") ?? "";
      const formData = new FormData();

      formData.append("is_draft", "false");

      // Section 1
      formData.append("ldap_email", ldapEmail.trim());
      formData.append("name", name.trim());
      formData.append("roll_no", rollNo.trim());
      formData.append("non_ldap_email", nonLdapEmail.trim());
      formData.append("contact_number", contactNumber.trim());
      formData.append("year_of_study", getPrimaryYear());
      formData.append("academic_department", academicDepartment.trim());
      formData.append("degree_enrolled", getPrimaryDegree());
      formData.append("co_mentor", coMentor);

      // Section 1 Appendix: Co-Mentor
      if (coMentor === "Yes") {
        formData.append("comentor_ldap_email", comentorLdapEmail.trim());
        formData.append("comentor_name", comentorName.trim());
        formData.append("comentor_roll_no", comentorRollNo.trim());
        formData.append("comentor_non_ldap_email", comentorNonLdapEmail.trim());
        formData.append("comentor_contact_number", comentorContactNumber.trim());
        formData.append("comentor_year_of_study", getComentorYear());
        formData.append("comentor_academic_department", comentorAcademicDepartment.trim());
        formData.append("comentor_degree_enrolled", getComentorDegree());
      } else {
        formData.append("comentor_ldap_email", "");
        formData.append("comentor_name", "");
        formData.append("comentor_roll_no", "");
        formData.append("comentor_non_ldap_email", "");
        formData.append("comentor_contact_number", "");
        formData.append("comentor_year_of_study", "");
        formData.append("comentor_academic_department", "");
        formData.append("comentor_degree_enrolled", "");
      }

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
      const draftPastWork = pastProjectWork.trim() || (typeof document !== "undefined" ? (document.getElementById("field-past-project-work") as HTMLTextAreaElement)?.value?.trim() || "" : "");
      formData.append("past_project_work", draftPastWork);

      const draftPythonExp = pythonMlExperience.trim() || (typeof document !== "undefined" ? (document.getElementById("field-python-ml-experience") as HTMLTextAreaElement)?.value?.trim() || "" : "");
      formData.append("python_ml_experience", draftPythonExp);

      const draftResLink = projectResourcesLink.trim() || (typeof document !== "undefined" ? (document.getElementById("field-project-resources-link") as HTMLInputElement)?.value?.trim() || "" : "");
      formData.append("project_resources_link", draftResLink);
      formData.append("comments_suggestions", commentsSuggestions.trim());

      if (imageDriveLink.trim()) {
        formData.append("image_drive_link", imageDriveLink.trim());
      }
      if (imageFile && !imageUploadedToCloud) {
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

      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch (parseErr) {
        console.error("Non-JSON server response on submit:", rawText);
        toast.error(`Server error (${res.status}). The server returned an invalid response. Please try again.`);
        return;
      }

      if (res.ok && data?.ok) {
        toast.success("Mentor Registration submitted and finalized successfully!");
        setIsFinalSubmitted(true);
        setSubmittedAt(new Date().toISOString());
        setAutoSaveStatus("Application Finalized & Locked");
        if (data.image_name) setSavedImageName(data.image_name);
        if (data.image_url) setSavedImageUrl(getFullImageUrl(data.image_url));
        if (data.image_drive_link) setImageDriveLink(data.image_drive_link);
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

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 text-sm">Loading Mentor Portal...</p>
      </div>
    );
  }

  // Not Logged In Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full p-8 rounded-3xl border border-pink-500/20 bg-gradient-to-br from-[#180d2c]/90 to-[#0a0316]/95 backdrop-blur-xl shadow-2xl text-center space-y-6 relative z-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Mentor Portal
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Please sign in using your IIT Bombay LDAP SSO account to access the mentor registration and project proposal portal.
            </p>
          </div>

          <a
            href={authUrl}
            className="block w-full py-3.5 px-6 rounded-full font-semibold text-white bg-gradient-to-r from-[#e16993] via-[#c2185b] to-[#7b1fa2] hover:from-[#f06292] hover:to-[#8e24aa] shadow-[0_0_25px_rgba(225,105,147,0.5)] border border-[#ffa6c9]/60 transition-transform duration-200 hover:scale-[1.03] active:scale-95 text-center"
          >
            Login with IITB SSO
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="py-18 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-[#090514] via-[#140828] to-[#090514] relative overflow-hidden min-h-screen">
      {/* Decorative Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-4xl py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.2] bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            WiDS 6.0 Mentor Registration Form
          </h1>
          <p className="text-lg sm:text-xl font-medium text-purple-200/90 max-w-2xl mx-auto mb-2">
            Greetings from the Analytics Club!
          </p>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base mb-2">
            Are you passionate about Data Science, AI, or ML? Bring your innovative ideas to life through WiDS 6.0!
          </p>
          <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base">
            We’re inviting skilled individuals to mentor the next generation of data enthusiasts!
          </p>
        </motion.div>

        {/* EXPLICIT NOTIFICATION CARDS: AUTO-SAVE & SUBMISSION POLICY */}
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
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 leading-relaxed">
                  Your mentor registration and project proposal have been successfully submitted and are currently under review by The Analytics Club.
                </p>
                {submittedAt && (
                  <p className="text-xs text-emerald-300/80 mt-1.5 font-mono">
                    Submitted on: {new Date(submittedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Dynamic Stepper Bar */}
        <div className="mb-6 p-2.5 sm:p-3 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {stepList.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              const isAccessible = isPast || isCurrent || isFinalSubmitted;

              return (
                <button
                  key={step.key}
                  type="button"
                  disabled={!isAccessible}
                  onClick={() => {
                    if (isAccessible) {
                      setCurrentStepIndex(idx);
                      scrollToFormTop();
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? "bg-gradient-to-r from-pink-500/30 to-purple-600/35 text-white border border-pink-400/60 shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                      : isPast
                      ? "text-emerald-300 hover:text-white bg-white/5 hover:bg-white/10 cursor-pointer"
                      : "text-gray-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  <span
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                        : isPast
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                        : "bg-white/10 text-gray-500"
                    }`}
                  >
                    {isPast ? (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="hidden sm:inline">{step.badge}:</span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form Card */}
        <motion.div
          id="mentor-form-container"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="p-6 sm:p-10 rounded-3xl border border-pink-500/20 bg-gradient-to-br from-[#180d2c]/90 via-[#130724]/80 to-[#0a0316]/95 backdrop-blur-xl shadow-[0_10px_50px_rgba(236,72,153,0.15)] relative"
        >
          {/* Top Status Bar: Auto-Save Tracker & Submission Deadline */}
          {!isFinalSubmitted && (
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSavingDraft
                      ? "bg-amber-400 animate-pulse"
                      : "bg-blue-400 animate-pulse"
                  }`}
                ></span>
                <span className="text-gray-300 font-medium">{autoSaveStatus}</span>
              </div>

              <div className="text-xs sm:text-sm font-semibold text-pink-300/90 text-center tracking-wide">
                (Deadline for form submission : 27th November, 11:59 PM)
              </div>

              <button
                type="button"
                onClick={() => saveCloudDraft(true)}
                disabled={isSavingDraft}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
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
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-8"
          >
            <AnimatePresence mode="wait">
              {/* ======================================================== */}
              {/* STEP: SECTION 1 - GENERAL INFORMATION */}
              {/* ======================================================== */}
              {currentStepKey === "section-1" && (
                <motion.div
                  key="section-1"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/10 pb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Section 1
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                      General Information
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      Basic details and primary mentor background information.
                    </p>
                  </div>

                  {/* 1) LDAP Email ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      1) LDAP Email ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="field-ldap-email"
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
                      id="field-name"
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
                      id="field-roll-no"
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
                      id="field-non-ldap-email"
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
                      id="field-contact-number"
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
                  <div id="field-year-of-study">
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
                      id="field-academic-department"
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
                  <div id="field-degree">
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

                    {degreeChoice.toLowerCase() === "other" && (
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

                  {/* 9) Do you want a Co-Mentor? */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      9) Do you want a Co-Mentor? <span className="text-red-400">*</span>
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
                    {coMentor === "Yes" && (
                      <p className="text-xs text-cyan-300/90 mt-2.5 flex items-center gap-1.5">
                        <span>ℹ️</span>
                        <span>Co-Mentor details will be collected in the next section (Section 1 Appendix).</span>
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ======================================================== */}
              {/* STEP: SECTION 1 APPENDIX - CO-MENTOR DETAILS */}
              {/* ======================================================== */}
              {currentStepKey === "section-1-appendix" && (
                <motion.div
                  key="section-1-appendix"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="border-b border-white/10 pb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      Section 1 Appendix
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                      Co-Mentor Details
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      General background and contact details for your proposed co-mentor.
                    </p>
                  </div>

                  {/* 1) Co-Mentor LDAP Email ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      1) Co-Mentor LDAP Email ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="field-comentor-ldap-email"
                      type="email"
                      required
                      disabled={isFinalSubmitted}
                      value={comentorLdapEmail}
                      onChange={(e) => setComentorLdapEmail(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="comentor@iitb.ac.in"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* 2) Co-Mentor Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      2) Co-Mentor Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="field-comentor-name"
                      type="text"
                      required
                      disabled={isFinalSubmitted}
                      value={comentorName}
                      onChange={(e) => setComentorName(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="Enter co-mentor's full name"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* 3) Co-Mentor Roll Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      3) Co-Mentor Roll Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="field-comentor-roll-no"
                      type="text"
                      required
                      disabled={isFinalSubmitted}
                      value={comentorRollNo}
                      onChange={(e) => setComentorRollNo(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="e.g. xxBxxxx"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* 4) Co-Mentor Non LDAP Email ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      4) Co-Mentor Non LDAP Email ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="field-comentor-non-ldap-email"
                      type="email"
                      required
                      disabled={isFinalSubmitted}
                      value={comentorNonLdapEmail}
                      onChange={(e) => setComentorNonLdapEmail(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="e.g. comentor@gmail.com"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* 5) Co-Mentor Contact Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      5) Co-Mentor Contact Number (Preferably WhatsApp) <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="field-comentor-contact-number"
                      type="tel"
                      required
                      disabled={isFinalSubmitted}
                      value={comentorContactNumber}
                      onChange={(e) => setComentorContactNumber(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* 6) Co-Mentor Year Of Study */}
                  <div id="field-comentor-year-of-study">
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      6) Co-Mentor Year Of Study <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                      {yearOptions.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                            isFinalSubmitted ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                          } ${
                            comentorYearOfStudyChoice === opt
                              ? "bg-purple-600/30 border-purple-400 text-white shadow-sm"
                              : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name="comentor_year_of_study"
                            value={opt}
                            disabled={isFinalSubmitted}
                            checked={comentorYearOfStudyChoice === opt}
                            onChange={() => setComentorYearOfStudyChoice(opt)}
                            className="accent-purple-500"
                          />
                          <span className="capitalize">{opt}</span>
                        </label>
                      ))}
                    </div>

                    {comentorYearOfStudyChoice === "other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          required
                          disabled={isFinalSubmitted}
                          value={comentorYearOfStudyOther}
                          onChange={(e) => setComentorYearOfStudyOther(e.target.value)}
                          onBlur={() => saveCloudDraft(false)}
                          placeholder="Please specify co-mentor's year of study (e.g., 1st Year, Ph.D. 2nd Year)"
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-purple-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* 7) Co-Mentor Academic Department */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      7) Co-Mentor Academic Department <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="field-comentor-academic-department"
                      type="text"
                      required
                      disabled={isFinalSubmitted}
                      value={comentorAcademicDepartment}
                      onChange={(e) => setComentorAcademicDepartment(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="e.g. Computer Science and Engineering"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* 8) Co-Mentor Degree Enrolled For */}
                  <div id="field-comentor-degree">
                    <label className="block text-sm font-semibold text-gray-200 mb-2">
                      8) Co-Mentor Degree Enrolled For <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      disabled={isFinalSubmitted}
                      value={comentorDegreeChoice}
                      onChange={(e) => setComentorDegreeChoice(e.target.value)}
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

                    {comentorDegreeChoice.toLowerCase() === "other" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          required
                          disabled={isFinalSubmitted}
                          value={comentorDegreeOther}
                          onChange={(e) => setComentorDegreeOther(e.target.value)}
                          onBlur={() => saveCloudDraft(false)}
                          placeholder="Please specify co-mentor's degree"
                          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-purple-400/50 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ======================================================== */}
              {/* STEP: SECTION 2 - PROJECT INFORMATION */}
              {/* ======================================================== */}
              {currentStepKey === "section-2" && (
                <motion.div
                  key="section-2"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
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
                      id="field-project-title"
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
                      id="field-project-description"
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
                  <div id="field-project-domains">
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
                                : "bg-black/30 border-white/10 text-gray-300 hover:border-white/20 hover:text-white cursor-pointer"
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
                  <div id="field-project-category">
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
                  <div id="field-duration-weeks">
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
                      id="field-weekly-time-commitment"
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
                      id="field-num-mentees"
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
                      id="field-prerequisites"
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
                  <div id="field-project-image">
                    <label className="block text-sm font-semibold text-gray-200 mb-1">
                      9) An image relevant to the project to be displayed on the site (try to make it appealing){" "}
                      <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-gray-400 mb-3">
                      Upload a high-quality illustration or graphic representing your project.
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

                      {imagePreview || savedImageUrl || savedImageName ? (
                        <div className="space-y-4">
                          {imagePreview || savedImageUrl ? (
                            <div className="relative inline-block mx-auto max-w-xs max-h-48 overflow-hidden rounded-xl border border-white/20 shadow-lg">
                              <img
                                src={imagePreview || savedImageUrl || ""}
                                alt="Project Preview"
                                className="w-full h-auto object-cover max-h-48"
                                onError={(e) => {
                                  // Fallback if image fails to load directly
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                          ) : null}
                          <div className="text-xs text-gray-300">
                            {savedImageName && !imageFile && (
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
                                <span>✓</span>
                                <span>Image saved on server</span>
                              </div>
                            )}
                            <p className="font-semibold text-purple-300">
                              {imageFile ? imageFile.name : savedImageName || "Saved Project Image"}
                            </p>
                            {!isFinalSubmitted && (
                              <p className="text-gray-400 mt-1">
                                Click or drag & drop to replace this image
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
                  </div>
                </motion.div>
              )}

              {/* ======================================================== */}
              {/* STEP: SECTION 3 - MENTOR INFORMATION */}
              {/* ======================================================== */}
              {currentStepKey === "section-3" && (
                <motion.div
                  key="section-3"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
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
                      id="field-past-project-work"
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
                      id="field-python-ml-experience"
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
                      id="field-project-resources-link"
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
                      id="field-comments-suggestions"
                      rows={3}
                      disabled={isFinalSubmitted}
                      value={commentsSuggestions}
                      onChange={(e) => setCommentsSuggestions(e.target.value)}
                      onBlur={() => saveCloudDraft(false)}
                      placeholder="Any questions or special requests for the WiDS team..."
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition leading-relaxed disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Submission Policy Alert */}
                  {!isFinalSubmitted && (
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-400/30 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5">
                      <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <span className="font-semibold block text-amber-300">Important Submission Policy:</span>
                        Once you click Submit, your answers are final and locked for review. You will <strong>NOT</strong> be able to update or modify your submission afterwards.
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ======================================================== */}
            {/* STEP NAVIGATION BUTTON BAR */}
            {/* ======================================================== */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Previous Section Button */}
              <div>
                {currentStepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-semibold text-gray-200 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Previous Section</span>
                  </button>
                ) : (
                  <div />
                )}
              </div>

              {/* Right: Save Draft & Next / Submit */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {!isFinalSubmitted && (
                  <button
                    type="button"
                    onClick={() => saveCloudDraft(true)}
                    disabled={isSavingDraft || isSubmitting}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSavingDraft ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    )}
                    <span>{isSavingDraft ? "Saving..." : "Save Draft"}</span>
                  </button>
                )}

                {currentStepIndex < stepList.length - 1 ? (
                  <button
                    key="step-nav-next-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNextStep();
                    }}
                    className="w-full sm:w-auto py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:from-pink-400 hover:to-purple-500 transition shadow-[0_0_20px_rgba(236,72,153,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Next Section</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : !isFinalSubmitted ? (
                  <button
                    key="step-nav-submit-btn"
                    type="button"
                    onClick={handlePreSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto py-3 px-7 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:from-pink-400 hover:via-fuchsia-500 hover:to-purple-500 transition shadow-[0_0_25px_rgba(236,72,153,0.45)] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Finalizing Application...</span>
                      </>
                    ) : (
                      <span>Submit Mentor Registration</span>
                    )}
                  </button>
                ) : (
                  <div className="px-5 py-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-semibold text-xs sm:text-sm">
                    🔒 Application Finalized & Locked
                  </div>
                )}
              </div>
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
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white font-medium text-sm transition"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-semibold text-sm transition shadow-lg shadow-pink-500/25"
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
