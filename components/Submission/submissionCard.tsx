"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { ProjectItem } from "@/types/projectitem";

type Props = {
  project: ProjectItem;
  onSopChange: (sop: string) => void;
};

const SubmissionCard = ({ project, onSopChange }: Props) => {
  const {
    project_title,
    project_type,
    difficulty,
    project_domain_1,
    project_domain_2,
  } = project;

  const safeSrc = `/images/projects/project_image_${project.id}.jpg` || "/images/placeholder.png";


  const handleSopChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSopChange(e.target.value);
  };

  const tags = [project_type, difficulty, project_domain_1, project_domain_2].filter(
    (t) => t && t.trim().length > 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-2xl 
                 bg-gradient-to-br from-[#1b1530] via-[#191622] to-[#15131b]
                 border border-white/10 shadow-lg 
                 hover:shadow-[0_0_30px_rgba(120,100,255,0.25)]
                 transition-all duration-300 hover:-translate-y-1"
    >
      {/* LEFT: IMAGE */}
      <div className="relative w-full md:w-1/3 h-56 md:h-64 rounded-xl overflow-hidden flex-shrink-0">
        <Image
          src={safeSrc}
          alt={project_title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* RIGHT: DETAILS */}
      <div className="flex-1 flex flex-col justify-between text-left space-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-blue-300 mb-2">
            {project_title}
          </h3>
          <p className="text-s text-white/50">ID: {project.id}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-medium rounded-full 
                             bg-blue-500/10 text-blue-300 border border-blue-400/20 
                             hover:bg-blue-500/20 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SOP TEXTAREA */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-blue-300 mb-2">
            Statement of Purpose
          </label>
          <textarea
            value={project.sop || ""}
            onChange={handleSopChange}
            placeholder="Write your motivation, approach, or experience related to this project..."
            className="w-full min-h-[120px] rounded-xl bg-[#1d1a27] text-gray-200 text-sm 
                       p-3 border border-white/10 focus:border-blue-400 
                       focus:ring-1 focus:ring-blue-400 outline-none resize-none"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SubmissionCard;
