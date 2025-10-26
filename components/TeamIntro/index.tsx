"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Introheader from "./introheader";
import teamdata from "./teamdata";

const TeamIntro = () => {
  return (
    <section className="relative z-50 mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
      {/* Section Header */}
      <Introheader />

      {/* Team Layout */}
      <div className="mt-16 flex flex-col items-center justify-center gap-12">
        {/* Top Row: First Member */}
        {teamdata[0] && (
          <motion.div
            key={teamdata[0].id}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="text-center">
              <div className="w-44 h-44 mx-auto rounded-full overflow-hidden shadow-lg">
                <Image
                  src={teamdata[0].imagePath}
                  alt={teamdata[0].name}
                  width={180}
                  height={180}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-black dark:text-white">
                {teamdata[0].name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {teamdata[0].designation}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {teamdata[0].mail}
              </p>
            </div>
          </motion.div>
        )}

        {/* Bottom Rows: Next 4 Members */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-35 gap-y-6">
          {teamdata.slice(1, 5).map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-44 h-44 mx-auto rounded-full overflow-hidden shadow-md">
                <Image
                  src={member.imagePath}
                  alt={member.name}
                  width={180}
                  height={180}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-black dark:text-white">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {member.designation}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {member.mail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamIntro;
