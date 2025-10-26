"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="border-t border-stroke bg-white dark:border-strokedark dark:bg-blacksection">
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
              <p className="text-xl font-semibold">WIDS 2025</p>
              <p>Dive deep in the realm of Academic and Industry related research projects</p>
              <p>Created with <span className="text-red-500">❤</span> by UGAC Web Team, 2025-2026</p>
              <p>&copy; {new Date().getFullYear()} UGAC, IIT Bombay</p>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;