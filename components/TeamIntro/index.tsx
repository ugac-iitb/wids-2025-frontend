"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Introheader from "./introheader";
import type { TeamMember } from "@/types/teammember";

const MemberCard = ({
  member,
  delay = 0,
}: {
  member: TeamMember;
  delay?: number;
}) => (
  <motion.div
    key={member.id}
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
    viewport={{ once: true }}
    className="text-center group"
  >
    {/* Profile Image */}
    <div className="w-44 h-44 mx-auto rounded-full overflow-hidden shadow-xl border-2 border-pink-400/50 shadow-[0_0_25px_rgba(236,72,153,0.25)] group-hover:border-pink-300 group-hover:shadow-[0_0_35px_rgba(236,72,153,0.45)] transition-all duration-300">
      <Image
        src={member.imagePath || "/wids-2025/images/placeholder.png"}
        alt={member.name}
        width={176}
        height={176}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    {/* Name & Designation */}
    <h3 className="mt-4 text-lg sm:text-xl font-bold text-pink-100 group-hover:text-white transition-colors">
      {member.name}
    </h3>
    <p className="text-sm text-pink-200/75 mt-0.5">{member.designation}</p>

    {/* Contact Number */}
    {member.contactNumber && (() => {
      const isTech = /technical issues/i.test(member.contactNumber);
      const cleanNumber = member.contactNumber.replace(/\s*\(for technical issues only\)/i, "").trim();
      return (
        <div className="mt-2 text-xs sm:text-sm font-medium">
          <span className="text-pink-200/80">Contact Number: </span>
          <span className="text-pink-100 font-semibold">{cleanNumber}</span>
          {isTech && (
            <span className="text-pink-200/80"> (for technical issues only)</span>
          )}
        </div>
      );
    })()}
  </motion.div>
);

const TeamIntro = () => {
  const [teamdata, setTeamData] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetch("/wids-2025/data/teamdata.json")
      .then((res) => res.json())
      .then((data) => setTeamData(data))
      .catch((err) => console.error("Error loading team data:", err));
  }, []);

  if (teamdata.length === 0) return null;

  // Split into designated groups
  const member1 = teamdata[0];
  const members2To5 = teamdata.slice(1, 5);
  const members6And7 = teamdata.slice(5, 7);
  const members8To11 = teamdata.slice(7, 11);

  return (
    <section className="relative z-50 pt-2 pb-16 bg-gradient-to-b from-[#090514] via-[#140828] to-[#090514]">
      <div className="mx-auto max-w-screen-xl px-6 sm:px-8 lg:px-12">
        {/* Section 1 Header: Analytics Club */}
        <Introheader title="Analytics Club" />

        {/* Team Layout */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-center gap-14 sm:gap-16">
          {/* Row 1: ID 1 (Manager, center aligned) */}
          {member1 && (
            <div className="flex justify-center w-full">
              <MemberCard member={member1} delay={0.1} />
            </div>
          )}

          {/* Row 2: IDs 2-5 (4 members on horizontal line) */}
          {members2To5.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 lg:gap-x-20 gap-y-12 w-full justify-items-center">
              {members2To5.map((member, idx) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  delay={0.1 * (idx + 1)}
                />
              ))}
            </div>
          )}

          {/* Web Team Divider */}
          <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent my-2" />

          {/* Section 2 Header: Web Team (same font & styling) */}
          <Introheader title="Web Team" />

          {/* Row 3: IDs 6 and 7 (center aligned on same horizontal line) */}
          {members6And7.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 md:gap-28 w-full -mt-4">
              {members6And7.map((member, idx) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  delay={0.1 * (idx + 1)}
                />
              ))}
            </div>
          )}

          {/* Row 4: IDs 8-11 (other 4 on horizontal line just below IDs 6-7, like IDs 2-5) */}
          {members8To11.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 lg:gap-x-20 gap-y-12 w-full justify-items-center">
              {members8To11.map((member, idx) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  delay={0.1 * (idx + 1)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TeamIntro;
