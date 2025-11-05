"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { User } from "@/types/user";

const handleExplore = () => {
    window.location.href = "/projects";
  };

const UserDetails = ({ user }: { user: User }) => {
  const {
    id,
    name,
    roll_no  
  } = user;

  return (
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="flex flex-col overflow-hidden rounded-2xl 
                   bg-gradient-to-br from-[#1b1530] via-[#191622] to-[#15131b]
                   hover:from-[#221a4d] hover:to-[#1a1429]
                   border border-white/10 shadow-lg 
                   hover:shadow-[0_0_35px_rgba(120,100,255,0.25)]
                   transform transition-all duration-300 hover:-translate-y-2"
      >

        {/* CONTENT */}
        <div className="flex flex-col flex-1 px-5 py-6 space-y-3 text-center">
          <h1 className="line-clamp-2 text-lg font-semibold text-blue-300">
            Welcome, {user.name}
          </h1>
        </div>

        <button
            onClick={handleExplore}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
        >
            Explore Projects
        </button>
      </motion.div>
  );
};

export default UserDetails;
