"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import WhatIsWIDS from "../WhatisWiDS";
import { useRef } from "react";

const Hero = () => {
  const router = useRouter();
  const whatIsWIDSRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-[#0d0418]">
        {/* ======================================================== */}
        {/* 🌌 DYNAMIC MOVING AURORA ASSET & COSMIC NIGHT SKY */}
        {/* ======================================================== */}
        
        {/* Base cosmic deep sky gradient matching reference image */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0314] via-[#160728] to-[#0d0418] pointer-events-none" />

        {/* Moving Aurora Video Loop Asset (Web-sourced real Northern Lights) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen pointer-events-none filter saturate-150 contrast-125"
          >
            <source src="/wids-2025/videos/aurora-pink.mp4" type="video/mp4" />
            <source src="/wids-2025/videos/aurora.mp4" type="video/mp4" />
          </video>

          {/* Vertical Dancing Aurora Curtains matching the uploaded pink/magenta palette */}
          <div className="animate-aurora-1 absolute -top-24 left-1/4 w-[45vw] h-[120%] bg-gradient-to-b from-transparent via-[#e16993]/40 to-transparent blur-[85px] rotate-[-8deg] mix-blend-screen" />
          <div className="animate-aurora-2 absolute -top-32 right-1/4 w-[40vw] h-[120%] bg-gradient-to-b from-transparent via-[#a54781]/45 to-transparent blur-[95px] rotate-[10deg] mix-blend-screen" />
          <div className="animate-aurora-3 absolute -top-10 left-1/3 w-[30vw] h-[110%] bg-gradient-to-b from-transparent via-[#6d3d72]/45 to-transparent blur-[90px] mix-blend-screen" />
          <div className="animate-aurora-1 absolute top-0 right-1/10 w-[35vw] h-[95%] bg-gradient-to-b from-transparent via-[#f06292]/35 to-transparent blur-[110px] rotate-[-5deg] mix-blend-screen" />

          {/* Vignette Gradients for Text Legibility & Cosmic Depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0418]/50 via-transparent to-[#0d0418]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d0418]/40 to-[#0d0418]/90" />
        </div>

        {/* Ambient Starlight Twinkles in the Aurora Sky (No snowflakes) */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <div className="animate-sparkle absolute top-28 left-[15%] text-[#ffa6c9]/70 text-base" style={{ animationDelay: "0.5s" }}>
            ✦
          </div>
          <div className="animate-sparkle absolute top-40 right-[20%] text-[#e16993]/60 text-lg" style={{ animationDelay: "1.8s" }}>
            ✧
          </div>
          <div className="animate-sparkle absolute bottom-36 left-[22%] text-[#ededf1]/60 text-sm" style={{ animationDelay: "2.5s" }}>
            ✦
          </div>
          <div className="animate-sparkle absolute top-20 right-[35%] text-[#f48fb1]/60 text-xs" style={{ animationDelay: "1.1s" }}>
            ·
          </div>
          <div className="animate-sparkle absolute bottom-28 right-[15%] text-[#ffa6c9]/60 text-base" style={{ animationDelay: "3.2s" }}>
            ✧
          </div>
          <div className="animate-sparkle absolute top-60 left-[35%] text-[#ededf1]/50 text-xs" style={{ animationDelay: "0.9s" }}>
            ·
          </div>
        </div>

        {/* Bottom Aurora Horizon Sheen */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0d0418] via-[#e16993]/15 to-transparent pointer-events-none" />

        {/* ======================================================== */}
        {/* HERO CONTENT */}
        {/* ======================================================== */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20 pb-12">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block text-[#ededf1]/90 tracking-wider text-xl sm:text-2xl md:text-3xl font-medium mb-3">
              WELCOME TO
            </span>
            <span className="block bg-gradient-to-r from-white via-[#fed7e2] to-[#ffa6c9] text-transparent bg-clip-text drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] drop-shadow-[0_0_35px_rgba(255,166,201,0.5)]">
              WINTER IN DATA SCIENCE 2026
            </span>
          </h1>

          {/* Call to action: Mentor registrations announcement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="max-w-3xl mx-auto mt-6 flex flex-col items-center"
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-white font-semibold mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
              Mentor registrations are now open!
            </p>

            <button 
              onClick={() => router.push("/mentor")}
              className="px-8 py-3.5 rounded-full font-bold text-white text-lg sm:text-xl bg-gradient-to-r from-[#e16993] via-[#c2185b] to-[#7b1fa2] hover:from-[#f06292] hover:to-[#8e24aa] shadow-[0_0_25px_rgba(225,105,147,0.5)] border border-[#ffa6c9]/60 transition-transform duration-200 hover:scale-[1.03] active:scale-95 inline-flex items-center gap-2.5 group cursor-pointer"
            >
              <span>Register as Mentor</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>

            <p className="mt-3.5 text-sm sm:text-base text-pink-200/90 font-medium tracking-wide drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] text-center">
              (Mentor Registration Deadline: 25 December, 11:59 PM)
            </p>
          </motion.div>
        </div>
      </div>

      <div ref={whatIsWIDSRef} className="w-full">
        <WhatIsWIDS />
      </div>
    </>
  );
};

export default Hero;
