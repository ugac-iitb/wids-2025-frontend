"use client";
import { motion } from "framer-motion";

const WhatIsWiDS = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#090514] via-[#140828] to-[#090514]">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
            What is Winter in Data Science?
          </h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6 text-lg text-gray-300"
          >
            <p className="leading-relaxed">
              Winter in Data Science is your ultimate destination for comprehensive learning, exploration, and hands-on application in the realm of AI and ML-driven Data Analytics. Immerse yourself in the ML world through an extensive bootcamp and curated learning resources covering everything from Python basics to Deep Learning. Following this, you can delve into a multitude of PROJECTS offered by the Analytics Club. It is a hands-on learning opportunity to learn ML and apply it through various projects offered.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#180d2c]/90 to-[#0c0418]/90 border border-pink-500/20 hover:border-pink-400/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)] backdrop-blur-sm transition-all hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-pink-400 mb-3">Learn</h3>
                <p className="text-gray-300">Master data science fundamentals through structured learning modules and workshops</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#180d2c]/90 to-[#0c0418]/90 border border-pink-500/20 hover:border-pink-400/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)] backdrop-blur-sm transition-all hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-fuchsia-400 mb-3">Build</h3>
                <p className="text-gray-300">Work on practical projects with real-world datasets and industry-relevant problems</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gradient-to-br from-[#180d2c]/90 to-[#0c0418]/90 border border-pink-500/20 hover:border-pink-400/50 hover:shadow-[0_0_25px_rgba(236,72,153,0.2)] backdrop-blur-sm transition-all hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-purple-400 mb-3">Connect</h3>
                <p className="text-gray-300">Network with peers, mentors, and industry experts in the data science community</p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-indigo-950/40 border border-pink-500/25 backdrop-blur-md"
            >
              <p className="text-lg text-pink-100">
                Join us this winter to kickstart your journey into the exciting field of data science. Whether you're a beginner 
                or have some programming experience, WiDS provides the perfect platform to develop your skills and build a strong 
                foundation in data science.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatIsWiDS;