"use client";
import { motion } from "framer-motion";
import { LuCode } from "react-icons/lu";
import { IoTimeOutline } from "react-icons/io5";
import { HiOutlineUserGroup } from "react-icons/hi2";

const WhyWiDS = () => {
  const benefits = [
    {
      icon: <LuCode className="w-12 h-12" />,
      title: "Hands-on Learning",
      description: "Gain practical experience by working on real projects.",
      delay: 0.2,
    },
    {
      icon: <IoTimeOutline className="w-12 h-12" />,
      title: "Make use of free time",
      description: "Utilize your winter season to delve deeply into Data Science.",
      delay: 0.4,
    },
    {
      icon: <HiOutlineUserGroup className="w-12 h-12" />,
      title: "Develop connections",
      description: "Find a community of like-minded people and network with peers.",
      delay: 0.6,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-[#090514] via-[#140828] to-[#090514]">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
            Why Choose WiDS?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how Winter in Data Science can be your gateway to the exciting world of data science
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: benefit.delay }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="p-8 rounded-2xl bg-gradient-to-br from-[#180d2c]/90 via-[#130724]/80 to-[#0a0316]/95 hover:from-[#22103d] hover:to-[#16072a] border border-pink-500/20 hover:border-pink-400/50 hover:shadow-[0_0_35px_rgba(236,72,153,0.3)] backdrop-blur-md transition-all duration-300 h-full hover:-translate-y-2">
                <div className="mb-6 p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 group-hover:text-pink-300 transition-colors duration-300 w-fit">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-pink-300 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          {/* <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Join us this winter and take your first step towards becoming a data scientist.
            Whether you're just starting out or looking to enhance your skills, WiDS provides
            the perfect environment for growth and learning.
          </p> */}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyWiDS;