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
              WINTER IN DATA SCIENCE 2025
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-in-up animation-delay-200">
            Explore the world of data science through hands-on projects and expert guidance
          </p>

          <div className="flex justify-center gap-6 animate-fade-in-up animation-delay-300">
            <motion.button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Get Started
            </motion.button>
            <motion.button 
              onClick={handleLearnMore}
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-lg font-semibold transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Learn More
            </motion.button>
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
