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
        className="py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-[#0b0710] via-purple-900/5 to-[#0b0710] relative overflow-hidden"
      >
        {/* animated background blobs (interactive with mouse) */}
        <motion.div
          style={{ x: blob1X, y: blob1Y, rotate: blob1Rotate, opacity: blob1Opacity }}
          className="absolute -left-20 top-8 w-72 h-72 rounded-full blur-3xl bg-gradient-to-r from-purple-600/50 to-blue-400/30 mix-blend-screen pointer-events-none z-0"
        />
        <motion.div
          style={{ x: blob2X, y: blob2Y, rotate: blob2Rotate, opacity: blob2Opacity }}
          className="absolute -right-10 -bottom-6 w-96 h-96 rounded-full blur-2xl bg-gradient-to-tr from-pink-500/30 to-indigo-500/25 mix-blend-screen pointer-events-none z-0"
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
              className="w-full md:w-3/4 lg:w-2/3"
            >
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                WiDS Bootcamp
              </h2>
              <p className="text-gray-300 text-lg max-w-4xl mx-auto mb-4">
                Data Science Bootcamp in collaboration with School Of DS —
                Kickstart your journey into Data Science this December with our intensive 3-week bootcamp, specially crafted for beginners.
              </p>
              <p className="text-gray-400 text-base max-w-4xl mx-auto mb-6">
                Spanning the first three weeks of December, the program pairs online self-paced resources with live interactive sessions and hands-on assignments. You can register whether or not you've applied for a WiDS project.
              </p>

              <div className="text-left max-w-4xl mx-auto">
                <h4 className="text-lg font-semibold text-white mb-3">What you’ll get:</h4>
                <ul className="list-inside list-disc space-y-2 text-gray-300">
                  <li>A complete introduction to data science — no prerequisites required.</li>
                  <li>Essential foundations: Statistics, Python programming, and Exploratory Data Analysis (EDA).</li>
                  <li>Core ML skills: supervised & unsupervised learning, with exposure to different models.</li>
                  <li>Insights into ensemble techniques and a peek into AutoML.</li>
                  <li>Regular assignments and projects for practical experience — ideal alongside your WiDS project or as an entry point to DS.</li>
                </ul>
              </div>

              <div className="mt-6 flex justify-center">
                <a
                  href="https://forms.gle/Zi6uzVH3Y4Xh59NFA"
                  className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2 px-5 rounded-lg shadow-lg hover:opacity-95 transition"
                >
                  Register for Bootcamp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* ===== WiDS Bootcamp End ===== */}

      {/* ===== FAQ Start ===== */}
      <section className="py-18 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C] relative overflow-hidden">
       

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
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                    className="rounded-2xl bg-gradient-to-br from-[#0d0d1f]/60 to-[#050212]/40
                              border border-white/10 backdrop-blur-xl
                              shadow-[0_0_20px_rgba(79,70,229,0.05)]
                              hover:shadow-[0_0_25px_rgba(168,85,247,0.005)]
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