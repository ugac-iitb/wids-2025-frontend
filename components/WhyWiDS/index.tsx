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
      description: "Find a community of like-minded people and network with professionals.",
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
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-purple-900/20 to-black">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Why Choose WiDS?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how Winter in Data Science can transform your journey into the world of data science
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
              <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900/50 to-purple-900/50 hover:from-blue-800/50 hover:to-purple-800/50 backdrop-blur-sm transition-all duration-300 h-full">
                <div className="mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
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
