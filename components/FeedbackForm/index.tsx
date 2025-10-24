"use client";
import { motion } from "framer-motion";

const FeedbackForm = () => {
  return (
    <footer className="mt-20 py-10 pb-0 border-t border-stroke bg-white dark:border-strokedark dark:bg-blacksection">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 1, delay: 0.1 }}
          viewport={{ once: true }}
          className="animate_top"
        >
          <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
            Contact Us
          </h2>
          <form className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Full name"
              className="w-full border-b border-stroke bg-transparent pb-1 focus:border-primary focus:outline-none dark:border-strokedark dark:focus:border-primary"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full border-b border-stroke bg-transparent pb-1 focus:border-primary focus:outline-none dark:border-strokedark dark:focus:border-primary"
            />
            <input
              type="text"
              placeholder="Phone number"
              className="w-full border-b border-stroke bg-transparent pb-1 focus:border-primary focus:outline-none dark:border-strokedark dark:focus:border-primary"
            />
            <textarea
              placeholder="Message"
              rows={3}
              className="w-full border-b border-stroke bg-transparent pb-1 focus:border-primary focus:outline-none dark:border-strokedark dark:focus:border-primary"
            ></textarea>
            <button
              type="submit"
              className="mt-2 w-max rounded-full bg-black px-4 py-1 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors"
            >
              Send
            </button>
          </form>
        </motion.div>
      </div>
    </footer>
  );
};

export default FeedbackForm;
