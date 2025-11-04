"use client";
import React, { useEffect, useState } from "react";
import { Reorder, motion } from "framer-motion";
import SubmissionCard from "./submissionCard";
import { ProjectItem } from "@/types/projectitem";

const Project = () => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/data/wishlist.json");
      const data = await res.json();
      setProjects(data.slice(0,5));
    };
    fetchData();
  }, []);

  const handleSubmit = () => {
    // 🔹 You’ll add backend submission logic here later
    setSubmitted(true);

    // Optional: auto-hide success after few seconds
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="px-4 md:px-8 lg:px-12 pt-20 pb-16 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 opacity-30"></div>

      {/* Header */}
      <div className="relative z-10 mx-auto max-w-c-1315 px-4 md:px-8 py-4 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            WishList Submission
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
           Review your shortlisted projects and add your SOPs below. Drag and drop the cards to arrange them in your preferred order — you can submit up to five preferences.
          </p>
        </motion.div>
      </div>

      {/* Cards List */}
      <div className="relative z-10 mx-auto mt-10 max-w-5xl px-4 md:px-8 xl:px-0">
        <Reorder.Group
          axis="y"
          values={projects}
          onReorder={setProjects}
          className="flex flex-col gap-10"
        >
          {projects.map((project, index) => (
            <Reorder.Item
              key={project.id}
              value={project}
              whileDrag={{ scale: 1.03 }}
              className="cursor-grab active:cursor-grabbing flex items-start gap-4"
            >
              {/* Number indicator */}
              <div className="flex-shrink-0 text-2xl font-bold text-purple-400 mt-2">
                {index + 1}.
              </div>

              {/* Project card */}
              <div className="flex-1">
                <SubmissionCard project={project} />
              </div>
            </Reorder.Item>
          ))}

        </Reorder.Group>


        {/* Submit Button */}
        <div className="flex justify-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={submitted}
            className={`px-10 py-3 text-lg font-semibold rounded-full shadow-lg transition-all duration-300 
              ${
                submitted
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              }`}
          >
            {submitted ? "Submitted Successfully" : "Submit Preferences"}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default Project;
