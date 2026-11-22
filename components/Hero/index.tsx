"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import WhatIsWIDS from "../WhatisWiDS";
import { useRef } from "react";

const Hero = () => {
  const router = useRouter();
  const whatIsWIDSRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    router.push("/projects");
  };

  const handleLearnMore = () => {
    whatIsWIDSRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-black">
        {/* Dynamic Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Animated Network Lines Background */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {/* Add more network lines or particles here if needed */}
            <div className="absolute top-0 left-0 w-full h-full">
              <svg className="w-full h-full opacity-20" viewBox="0 0 100 100">
                {/* You can add more SVG paths for network visualization */}
                <path d="M0,50 Q25,0 50,50 T100,50" stroke="white" fill="none" strokeWidth="0.5">
                  <animate attributeName="d" dur="10s" repeatCount="indefinite"
                    values="M0,50 Q25,0 50,50 T100,50;
                            M0,50 Q25,100 50,50 T100,50;
                            M0,50 Q25,0 50,50 T100,50"/>
                </path>
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in-up">
            <span className="block">WELCOME TO</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mt-2">
              WINTER IN DATA SCIENCE 2026
            </span>
          </h1>

          <div className="max-w-4xl mx-auto mb-12 animate-fade-in-up animation-delay-200 flex flex-col items-center">
            <p className="text-xl md:text-2xl text-purple-200 font-medium mb-5">
              Mentor registrations are now open!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-lg md:text-xl text-gray-300">
              <span>Click</span>
              <motion.button 
                onClick={() => router.push("/mentor")}
                className="px-6 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_25px_rgba(147,51,234,0.45)] border border-purple-400/50 transition-all duration-300 inline-flex items-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span>Register as Mentor</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </motion.button>
              <span>to register yourself as a mentor.</span>
            </div>
          </div>
        </div>
      </div>
      <div ref={whatIsWIDSRef} className="mt-20 w-full">
          <WhatIsWIDS />
        </div>
    </>
  );
};

export default Hero;
