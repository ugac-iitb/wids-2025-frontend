"use client";
import { motion } from "framer-motion";

const WhatIsWiDS = () => {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-black to-purple-900/20">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            What is Winter in Data Science?
          </h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6 text-lg text-gray-300"
          >
            <p>
              Winter in Data Science is your ultimate destination for comprehensive learning, exploration, and hands-on application in the realm of Al and ML-driven Data Analytics. Immerse yourself in the ML world through an extensive two-week boot camp and a user-friendly ML booklet that covers everything from Python basics to a sufficient grasp of Deep Learning. Following this boot camp, you can delve into a multitude of PROJECTS offered by the Analytics Club. It is a hands-on learning opportunity to learn ML and apply it through various projects offered.
            </p>

            

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Learn</h3>
                <p className="text-gray-300">Master data science fundamentals through structured learning modules and workshops</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Build</h3>
                <p className="text-gray-300">Work on practical projects with real-world datasets and industry-relevant problems</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white/5 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-blue-400 mb-3">Connect</h3>
                <p className="text-gray-300">Network with peers, mentors, and industry experts in the data science community</p>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 p-6 rounded-xl bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-sm"
            >
              <p className="text-lg text-gray-200">
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