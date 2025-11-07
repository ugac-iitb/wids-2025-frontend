"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import FAQItem from "./FAQItem";
import faqData from "./faqData";

const FAQ = () => {
  const [activeFaq, setActiveFaq] = useState(1);

  const handleFaqToggle = (id: number) => {
    activeFaq === id ? setActiveFaq(0) : setActiveFaq(id);
  };

  return (
    <>
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
