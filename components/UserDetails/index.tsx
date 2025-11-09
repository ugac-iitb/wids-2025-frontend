"use client";

import { motion } from "framer-motion";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import Image from "next/image";

const UserDetails = ({ user }: { user: User }) => {
  const router = useRouter();

  const handleExplore = () => {
    router.push("/projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex flex-col items-center gap-5 p-8 rounded-2xl 
                 bg-gradient-to-br from-[#1b1530] via-[#191622] to-[#15131b]
                 border border-white/10 shadow-lg 
                 hover:shadow-[0_0_40px_rgba(120,100,255,0.02)]
                 transition-all duration-300 hover:-translate-y-1 max-w-md mx-auto w-full"
    >
      {/* Profile Image */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-400 shadow-md">
        <Image
          src="/images/user/avatar.png" // fallback avatar, or user.avatar if available
          alt="User avatar"
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      {/* User Info */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold text-blue-300">
          Welcome, {user.name}
        </h1>
        {user.roll_no && (
          <p className="text-sm text-gray-400">Roll No: {user.roll_no}</p>
        )}
        {/* {user.id && (
          <p className="text-xs text-gray-500">User ID: {user.id}</p>
        )} */}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleExplore}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg 
                   font-medium shadow-md transition-all duration-200 hover:shadow-lg"
      >
        Explore Projects
      </button>
    </motion.div>
  );
};

export default UserDetails;
