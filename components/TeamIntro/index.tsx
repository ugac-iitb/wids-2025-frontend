"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Introheader from "./introheader";
import type { TeamMember } from "@/types/teammember";

const TeamIntro = () => {
  const [teamdata, setTeamData] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/data/teamdata.json")
      .then((res) => res.json())
      .then((data) => setTeamData(data))
      .catch((err) => console.error("Error loading team data:", err));
  }, []);

  if (teamdata.length === 0) return null; // avoid rendering before data loads

  return (
    <section className="relative z-50 bg-gradient-to-b from-[#1A141C] via-purple-900/10 to-[#1A141C]">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <Introheader />

        {/* Team Layout */}
        <div className="mt-16 flex flex-col items-center justify-center gap-20">
          {/* Top Row: First Member */}
          <motion.div
            key={teamdata[0].id}
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <div className="text-center">
              <div className="w-44 h-44 mx-auto rounded-full overflow-hidden shadow-lg">
                <Image
                  src={teamdata[0].imagePath}
                  alt={teamdata[0].name}
                  width={176}
                  height={176}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-200">
                {teamdata[0].name}
              </h3>
              <p className="text-sm text-gray-400">{teamdata[0].designation}</p>
              <p className="text-sm text-blue-400 hover:underline">
                <a href={`mailto:${teamdata[0].mail}`}>{teamdata[0].mail}</a>
              </p>
            </div>
          </motion.div>

          {/* Bottom Rows: Remaining Members */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-20 gap-y-14">
            {teamdata.slice(1).map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-44 h-44 mx-auto rounded-full overflow-hidden shadow-md">
                  <Image
                    src={member.imagePath}
                    alt={member.name}
                    width={176}
                    height={176}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-200">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-400">{member.designation}</p>
                <p className="text-sm text-blue-400 hover:underline">
                  <a href={`mailto:${member.mail}`}>{member.mail}</a>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamIntro;
