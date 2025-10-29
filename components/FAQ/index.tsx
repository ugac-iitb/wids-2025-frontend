"use client";
import { motion } from "framer-motion";
import Image from "next/image";
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
      {/* <!-- ===== FAQ Start ===== --> */}
  <section className="pt-16 md:pt-24 overflow-hidden pb-20 lg:pb-25 xl:pb-30 bg-gradient-to-br from-black via-[#05021a] to-[#0b0212] relative">
        <div className="relative mx-auto max-w-c-1235 px-4 md:px-8 xl:px-0">
          {/* Background Dotted Image */}
          <div className="absolute -bottom-16 -z-1 h-full w-full">
            <Image
              fill
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="dark:hidden"
            />
            <Image
              fill
              src="/images/shape/shape-dotted-light.svg"
              alt="Dotted"
              className="hidden dark:block"
            />
          </div>

          {/* Heading Section */}
          <div className="flex justify-center text-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left w-full md:w-3/4 lg:w-2/3"
            >
              <h2 className="relative z-10 mb-10 text-3.5xl xl:text-6xl drop-shadow-sm">
                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                  Frequently Asked Questions
                </span>
              </h2>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <div className="flex justify-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right w-full md:w-3/4 lg:w-2/3"
            >
              <div className="rounded-lg bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-md border border-white/8 relative z-10">
                {faqData.map((faq, key) => (
                  <FAQItem
                    key={key}
                    faqData={{ ...faq, activeFaq, handleFaqToggle }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* <!-- ===== FAQ End ===== --> */}
    </>
  );
};

export default FAQ;
