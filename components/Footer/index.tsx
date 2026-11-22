"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="border-t border-[#a54781]/25 bg-[#080212]">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  y: -20,
                },
                visible: {
                  opacity: 1,
                  y: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top flex flex-col items-center text-center space-y-2"
            >
              <p className="text-xl font-bold bg-gradient-to-r from-pink-400 via-fuchsia-300 to-purple-400 text-transparent bg-clip-text">
                WIDS 2026
              </p>
              <p className="text-gray-400 text-sm">
                Dive deep in the realm of Academic and Industry related research projects
              </p>
              <p className="text-[#f1e8f8] text-sm">
                Created with <span className="text-pink-500 animate-pulse inline-block">❤</span> by UGAC Web Team, 2026-2027
              </p>
              <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} UGAC, IIT Bombay</p>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
