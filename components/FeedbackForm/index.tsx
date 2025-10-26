"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

const Contact = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <section id="support" className="px-4 md:px-8 2xl:px-0 mt-10">
        <div className="relative mx-auto max-w-c-1390 px-6 pt-6 pb-10 lg:px-12 lg:pt-8 xl:px-16 xl:pt-10">
          {/* Smaller gradient overlay */}
          <div className="absolute left-0 top-0 -z-1 h-[35%] w-full rounded-lg bg-linear-to-t from-transparent to-[#dee7ff47] dark:bg-linear-to-t dark:to-[#252A42]"></div>

          {/* FIXED smaller dotted background */}
          <div className="absolute bottom-0 left-0 -z-1 flex w-full justify-center">
            <div className="relative w-full max-w-5xl h-[180px] opacity-70">
              <Image
                src="./images/shape/shape-dotted-light.svg"
                alt="Dotted"
                fill
                className="dark:hidden object-contain object-bottom"
              />
              <Image
                src="./images/shape/shape-dotted-dark.svg"
                alt="Dotted"
                fill
                className="hidden dark:block object-contain object-bottom"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-6 md:flex-row md:items-center md:justify-between xl:gap-14">
            {/* ===== Left Side ===== */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1.2, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-[48%] xl:w-[45%] ml-4"
            >
              <h2 className="mb-4 text-2xl font-semibold text-black dark:text-white xl:text-3xl">
                Send us feedback
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                We value your thoughts! Whether it’s a suggestion, issue, or appreciation,
                your feedback helps us improve.
              </p>

              <Image
                width={260}
                height={300}
                src="/images/shape/shape-04.png"
                alt="Illustration"
                className="rounded-md"
              />
            </motion.div>

            {/* ===== Right Side ===== */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_top w-full md:w-[52%] rounded-lg bg-white p-5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-black xl:p-8"
            >
              <form action="#" method="POST" className="flex flex-col text-left">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="mb-4 w-full border-b border-stroke bg-transparent pb-2 text-sm focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="mb-4 w-full border-b border-stroke bg-transparent pb-2 text-sm focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                />
                {/* <input
                  type="text"
                  placeholder="Subject"
                  className="mb-4 w-full border-b border-stroke bg-transparent pb-2 text-sm focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                /> */}
                <textarea
                  placeholder="Message"
                  rows={3}
                  className="mb-5 w-full border-b border-stroke bg-transparent pb-2 text-sm focus:border-waterloo focus-visible:outline-hidden dark:border-strokedark dark:focus:border-manatee"
                ></textarea>

                <button
                  aria-label="send message"
                  className="inline-flex items-center gap-2.5 rounded-full bg-black px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark w-fit"
                >
                  Send Message
                  <svg
                    className="fill-white"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.4767 6.16664L6.00668 1.69664L7.18501 0.518311L13.6667 6.99998L7.18501 13.4816L6.00668 12.3033L10.4767 7.83331H0.333344V6.16664H10.4767Z"
                      fill=""
                    />
                  </svg>
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
