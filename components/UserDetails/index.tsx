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
                 bg-gradient-to-br from-[#180d2c] via-[#130724] to-[#0a0316]
                 border border-pink-500/25 shadow-xl 
                 hover:shadow-[0_0_40px_rgba(236,72,153,0.25)]
                 transition-all duration-300 hover:-translate-y-1 max-w-md mx-auto w-full"
    >
      {/* Profile Image */}
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
        <Image
          src="/wids-2025/images/user/avatar.png" // fallback avatar, or user.avatar if available
          alt="User avatar"
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>

      {/* User Info */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-300 via-fuchsia-300 to-purple-300 text-transparent bg-clip-text">
          Welcome, {user.name}
        </h1>
        {user.roll_no && (
          <p className="text-sm text-pink-200/70">Roll No: {user.roll_no}</p>
        )}
      </div>

      {/* CTA Button */}
      <button
        onClick={handleExplore}
        className="mt-4 bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white px-7 py-2.5 rounded-full 
                   font-semibold shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all duration-200 hover:scale-105"
      >
        Explore Projects
      </button>
    </motion.div>
  );
};

export default UserDetails;
