"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="border-t border-[#6D6D71] bg-[#1A141C]">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="flex flex-col items-center justify-center py-7 space-y-2">
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
              <p className="text-xl font-semibold text-[#E7E3E5]">WIDS 2025</p>
              <p className="text-[#6D6D71]">
                Dive deep in the realm of Academic and Industry related research projects
              </p>
              <p className="text-[#E7E3E5]">
                Created with <span className="text-[#6A6FDB]">❤</span> by UGAC Web Team, 2025-2026
              </p>
              <p className="text-[#6D6D71]">&copy; {new Date().getFullYear()} UGAC, IIT Bombay</p>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
