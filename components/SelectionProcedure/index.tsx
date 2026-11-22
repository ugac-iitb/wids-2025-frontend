"use client";
import { motion } from "framer-motion";
import { BsFileEarmarkText } from "react-icons/bs";
import { MdOutlineAssignment } from "react-icons/md";
import { AiOutlineProject } from "react-icons/ai";

const SelectionProcedure = () => {
  const stages = [
    {
      icon: <BsFileEarmarkText className="w-8 h-8" />,
      number: "01",
      title: "Application for Projects",
      description: "Please fill in your general motivation to apply and your previous work experience in the application form.",
      deadline: "30th November ‘26",
      delay: 0.2,
    },
    {
      icon: <MdOutlineAssignment className="w-8 h-8" />,
      number: "02",
      title: "SOP shortlisting by WiDS team",
      description: "This will help the mentors of WiDS gauge whether a student is really driven and will see the project through. Only one project will be allocated per student.",
      deadline: "3rd December ‘26",
      delay: 0.4,
    },
    {
      icon: <AiOutlineProject className="w-8 h-8" />,
      number: "03",
      title: "Mentor Allocation and Project Kick-off",
      description: "Mentors will guide the mentees on material to refer and a tentative action plan. Mentor feedback forms will be released towards the end of December.",
      deadline: "1st Week of December ‘26",
      delay: 0.6,
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#090514] via-[#1a0a33] to-[#090514] relative overflow-hidden">
      {/* Aurora Background Ambient Blobs */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-600 rounded-full filter blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-[150px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
            WiDS 2026 Selection Procedure
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Note: The timelines are tentative and subject to change based on the guidance of the project mentors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Lines (visible on md+ screens) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500/40 via-purple-500/50 to-pink-500/40"></div>

          {stages.map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stage.delay }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Stage Number Badge */}
              <div className="absolute -top-4 right-4 z-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-300/40">
                Stage {stage.number}
              </div>

              <div className="relative z-0 p-8 rounded-2xl bg-gradient-to-br from-[#180d2c]/90 via-[#120722]/80 to-[#0a0316]/95 backdrop-blur-md border border-pink-500/20 hover:border-pink-400/50 hover:shadow-[0_0_35px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-2">
                {/* Icon with connecting line */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 group-hover:text-pink-300 transition-colors duration-300">
                    {stage.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-pink-300 transition-colors duration-300">
                  {stage.title}
                </h3>

                <p className="text-gray-300 mb-4 leading-relaxed">
                  {stage.description}
                </p>

                {/* Timeline Badge */}
                <div className="bg-pink-900/30 border border-pink-500/30 text-pink-200 px-4 py-2 rounded-lg inline-block text-sm">
                  {stage.deadline}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectionProcedure;