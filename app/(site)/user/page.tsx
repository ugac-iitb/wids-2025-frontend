"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";
import UserDetails from "@/components/UserDetails";
import { authEvents } from "@/app/utils/authEvent";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Subscribe to authEvents for login/logout updates
    const unsubscribe = authEvents.subscribe(() => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      } else {
        setUser(null);
      }
    });

    setLoading(false);
    return () => unsubscribe();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && user === null) {
      router.push("/");
    }
  }, [user, loading, router]);

  // While loading or redirecting
  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[#E7E3E5]">
        <p>Loading user details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-[#E7E3E5]">
      <h1 className="text-2xl font-semibold mb-6">Your Profile</h1>
      <UserDetails user={user} />
    </div>
  );
}
