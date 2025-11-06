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
      deadline: "11.59 PM on 27th November ‘25.",
      delay: 0.2,
    },
    {
      icon: <MdOutlineAssignment className="w-8 h-8" />,
      number: "02",
      title: "SOP shortlisting by WiDS team",
      description: "This will help the mentors of WiDS gauge whether a student is really driven and will see the project through. Only one project will be allocated per student.",
      deadline: "1st December ‘25 to 6th December ‘25",
      delay: 0.4,
    },
    {
      icon: <AiOutlineProject className="w-8 h-8" />,
      number: "03",
      title: "Mentor Allocation and Project Kick-off",
      description: "Mentors will guide the mentees on material to refer and a tentative action plan. Mentor feedback forms will be released towards the end of December.",
      deadline: "1st Week of December ‘25- 3rd Week of January ‘26",
      delay: 0.6,
    },
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-black to-purple-900/20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-[150px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            WiDS 2025 Selection Procedure
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your journey to becoming a part of Winter in Data Science 2025
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection Lines (visible on md+ screens) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-blue-500/50"></div>

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
              <div className="absolute -top-4 right-4 z-20 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                Stage {stage.number}
              </div>

              <div className="relative z-0 p-8 rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                {/* Icon with connecting line */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                    {stage.icon}
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                  {stage.title}
                </h3>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {stage.description}
                </p>

                {/* Timeline Badge */}
                <div className="bg-blue-900/30 text-blue-300 px-4 py-2 rounded-lg inline-block text-sm">
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