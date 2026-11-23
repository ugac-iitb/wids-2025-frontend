// ...existing code...
"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import FAQItem from "./FAQItem";
import faqData from "./faqData";

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(1);

  const handleFaqToggle = (id: number) => {
    activeFaq === id ? setActiveFaq(0) : setActiveFaq(id);
  };

  // interactive blobs: motion values driven by mouse inside the section
  const sectionRef = useRef<HTMLElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // gentle springing for smooth movement
  const springConfig = { damping: 20, stiffness: 120 };
  const blob1X = useSpring(useTransform(mouseX, (v) => v * 0.28), springConfig);
  const blob1Y = useSpring(useTransform(mouseY, (v) => v * 0.28), springConfig);
  const blob1Rotate = useTransform(mouseX, (v) => v * 0.02);
  const blob1Opacity = useTransform(mouseY, (v) => Math.max(0.6, 1 - Math.abs(v) / 900));

  const blob2X = useSpring(useTransform(mouseX, (v) => v * -0.22), springConfig);
  const blob2Y = useSpring(useTransform(mouseY, (v) => v * -0.18), springConfig);
  const blob2Rotate = useTransform(mouseX, (v) => v * -0.015);
  const blob2Opacity = useTransform(mouseY, (v) => Math.max(0.45, 0.85 - Math.abs(v) / 1100));

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <>
      {/* ===== WiDS Bootcamp Start ===== */}
      <section
        ref={sectionRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-[#090514] via-[#16082b] to-[#090514] relative overflow-hidden"
      >
        {/* animated background blobs (interactive with mouse) */}
        <motion.div
          style={{ x: blob1X, y: blob1Y, rotate: blob1Rotate, opacity: blob1Opacity }}
          className="absolute -left-20 top-8 w-72 h-72 rounded-full blur-3xl bg-gradient-to-r from-pink-600/40 to-fuchsia-400/30 mix-blend-screen pointer-events-none z-0"
        />
        <motion.div
          style={{ x: blob2X, y: blob2Y, rotate: blob2Rotate, opacity: blob2Opacity }}
          className="absolute -right-10 -bottom-6 w-96 h-96 rounded-full blur-2xl bg-gradient-to-tr from-purple-600/35 to-pink-500/25 mix-blend-screen pointer-events-none z-0"
        />

        <div className="relative z-10 mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
          <div className="flex justify-center text-center mb-8 md:mb-12">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -16 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.8, delay: 0.05 }}
              viewport={{ once: true }}
              className="w-full max-w-4xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
                WiDS Bootcamp (coming soon)
              </h2>
              <p className="text-gray-300 text-base sm:text-lg max-w-4xl mx-auto mb-4 leading-relaxed">
                The Data Science and Machine Learning Bootcamp, held in collaboration with Gradient Learning aims to help you kickstart your Data Science journey. Whether you’re a complete beginner looking to find a holistic starter point into DS, or someone established willing to go beyond basics and learn straight from industry professionals, look no further than this Bootcamp.
              </p>
              <p className="text-gray-300 text-base sm:text-lg max-w-4xl mx-auto mb-8 leading-relaxed">
                Spanning across the 5 weeks of December and early January, this program pairs live interactive sessions which connect you to experts in the field, with hands-on assignments that build your understanding. Neither do you need any pre-requisites, nor do you have to be registered for a WiDS project to avail the full benefit of this Bootcamp.
              </p>

              <div className="text-left max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1d0e30]/70 via-[#130623]/70 to-[#0a0316]/80 border border-pink-500/20 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-pink-400">✨</span>
                  <span>What you’ll get:</span>
                </h4>
                <ul className="space-y-3 text-gray-300 text-sm sm:text-base leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-pink-400 font-bold mt-1">•</span>
                    <span>
                      <strong className="text-white font-semibold">A complete Data Science journey:</strong> From absolute basics to building and deploying real-world ML applications.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-pink-400 font-bold mt-1">•</span>
                    <span>
                      <strong className="text-white font-semibold">Essential foundations:</strong> Python, Statistics, Data Preprocessing, and Exploratory Data Analysis (EDA).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-pink-400 font-bold mt-1">•</span>
                    <span>
                      <strong className="text-white font-semibold">Core & Advanced ML:</strong> Regression, Classification, Unsupervised Learning, Ensemble Techniques, Model Optimization, and Explainable AI.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-pink-400 font-bold mt-1">•</span>
                    <span>
                      <strong className="text-white font-semibold">Generative AI:</strong> Neural Networks, LLMs, Prompt Engineering, RAG, and AI Agents.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-pink-400 font-bold mt-1">•</span>
                    <span>
                      <strong className="text-white font-semibold">From Model to Product:</strong> Hands-on experience with APIs, Docker, Cloud Deployment, and MLOps, guided by industry professionals.
                    </span>
                  </li>
                </ul>
              </div>

              {/* <div className="mt-6 flex justify-center">
                <a
                  href="https://forms.gle/Zi6uzVH3Y4Xh59NFA"
                  className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 px-5 rounded-lg shadow-lg hover:opacity-95 transition"
                >
                  Register for Bootcamp
                </a>
              </div> */}
            </motion.div>
          </div>
        </div>
      </section>
      {/* ===== WiDS Bootcamp End ===== */}

      {/* ===== FAQ Start ===== */}
      <section className="py-18 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-[#090514] via-[#140828] to-[#090514] relative overflow-hidden">
        {/* Main Content */}
        <div className="relative mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
          {/* Heading Section */}
          <div className="flex justify-center text-center mb-10 md:mb-16">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="w-full md:w-3/4 lg:w-2/3"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Here’s everything you need to know about applying, submitting SOPs, and managing your project preferences.
              </p>
            </motion.div>
          </div>

          {/* FAQ List */}
          <div className="flex justify-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-full md:w-3/4 lg:w-2/3"
            >
              <div className="space-y-5">
                {faqData.map((faq, key) => (
                  <motion.div
                    key={key}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.5, delay: key * 0.1 }}
                    viewport={{ once: true }}
                    className="rounded-2xl bg-gradient-to-br from-[#180d2c]/80 to-[#0a0316]/90
                              border border-pink-500/20 backdrop-blur-xl
                              shadow-[0_0_20px_rgba(236,72,153,0.06)]
                              hover:border-pink-400/40 hover:shadow-[0_0_25px_rgba(236,72,153,0.18)]
                              transition-all duration-300"
                  >
                    <FAQItem faqData={{ ...faq, activeFaq, handleFaqToggle }} />
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </div>
        </div>
      </section>
      {/* ===== FAQ End ===== */}
    </>
  );
};

export default FAQ;
// ...existing code...