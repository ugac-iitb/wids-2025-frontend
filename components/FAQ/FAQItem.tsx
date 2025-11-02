"use client";
import { motion, AnimatePresence } from "framer-motion";

type FaqData = {
  activeFaq: number;
  id: number;
  handleFaqToggle: (id: number) => void;
  quest: string;
  ans: string;
};

const FAQItem = ({ faqData }: { faqData: FaqData }) => {
  const { activeFaq, id, handleFaqToggle, quest, ans } = faqData;
  const isActive = activeFaq === id;

  return (
    <div className="flex flex-col border-b border-stroke last-of-type:border-none dark:border-strokedark">
      <button
        onClick={() => handleFaqToggle(id)}
        className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left text-metatitle3 font-medium text-gray-200 hover:text-white lg:px-9 lg:py-7.5"
      >
        <span className="flex-1 text-left">{quest}</span>

        {isActive ? (
          <svg
            width="18"
            height="4"
            viewBox="0 0 18 4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.1666 0.833374H10.1666H7.83331H0.833313V3.16671H7.83331H10.1666H17.1666V0.833374Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.83331 7.83337V0.833374H10.1666V7.83337H17.1666V10.1667H10.1666V17.1667H7.83331V10.1667H0.833313V7.83337H7.83331Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>


      {/* Smooth slide animation */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden border-t border-stroke dark:border-strokedark"
          >
            <p className="px-6 py-5 text-gray-300 lg:px-9 lg:py-7.5">
              {ans}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FAQItem;
