"use client";
import { motion } from "framer-motion";
import React from "react";
import { Student } from "@/types/student";

type Props = {
  student: Student;
};

const StudentCard = ({ student }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="
        flex flex-col 
        items-start text-left
        gap-3 p-4 rounded-xl
        bg-gradient-to-br from-[#1b1530] via-[#191622] to-[#15131b]
        border border-white/10 shadow-md
        hover:shadow-[0_0_20px_rgba(120,100,255,0.25)]
        transition-all duration-300 hover:-translate-y-1
      "
    >
      {/* NAME */}
      <h3 className="text-xl font-semibold text-blue-300">
        {student.user_name}
      </h3>

      {/* SOP */}
      <div className="w-full">
        <p className="text-sm text-gray-400 font-semibold mb-1">SOP:</p>
        <p className="text-gray-200 text-base leading-relaxed">
          {student.sop}
        </p>
      </div>
    </motion.div>
  );
};

export default StudentCard;
