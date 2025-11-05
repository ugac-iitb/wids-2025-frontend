"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import menuData from "./menuData";
import { authEvents } from "@/app/utils/authEvent";

/* ✅ Centralized Auth Hook */
const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    const unsubscribe = authEvents.subscribe(() => {
      const savedUser = localStorage.getItem("user");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    });
    return unsubscribe;
  }, []);

  const login = (userData: any) => {
    localStorage.setItem("user", JSON.stringify(userData));
    authEvents.trigger();
  };

  const logout = async () => {
    try {
      const res = await fetch("https://understandably-subquadrangular-keven.ngrok-free.dev/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Logout failed: ${res.status} ${errText}`);
      }

      await res.json().catch(() => ({}));
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      authEvents.trigger?.();
    }
  };

  return { user, login, logout };
};

/* ✅ Header Component */
const Header = () => {
  const [stickyMenu, setStickyMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();
  const path = usePathname();

  const authUrl = `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=7fd2hw5HewaGKKDGzsWghCpcBonwe5ytqsNPH0I3&response_type=code&scope=basic%20profile%20ldap%20program&redirect_uri=${encodeURIComponent(
    "http://localhost:3000/process-login/"
  )}&state=some_state`;

  useEffect(() => {
    const handleScroll = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-[99999] w-full py-4 transition duration-200 ${
        stickyMenu ? "bg-[#1A141C]/95 shadow-md backdrop-blur-md" : "bg-[#1A141C]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 md:px-12 lg:px-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <Image
            src="/images/logo/ugac.png"
            alt="UGAC"
            width={80}
            height={40}
            className="brightness-0 invert"
          />
          <Image
            src="/images/logo/analyticsclub.png"
            alt="Analytics Club"
            width={40}
            height={40}
          />
        </Link>

        {/* Menu (Desktop) */}
        <nav className="hidden xl:flex items-center gap-10 text-[#E7E3E5]">
          {menuData.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className={`transition hover:text-[#6A6FDB] ${
                path === item.path ? "text-[#6A6FDB]" : "text-[#E7E3E5]"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right side: Login or Avatar + Hamburger */}
        <div className="flex items-center gap-4 relative">
          {/* Auth Section */}
          {user ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <Image
                  src={user.avatar || "/images/avatar.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-[#719EA8] hover:opacity-80"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-[#1A141C] rounded-md shadow-md p-2 text-[#E7E3E5]">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/user");
                    }}
                    className="block w-full text-left px-3 py-2 hover:text-[#6A6FDB] transition"
                  >
                    User Details
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      setDropdownOpen(false);
                      router.push("/");
                    }}
                    className="block w-full text-left px-3 py-2 hover:text-[#6A6FDB] transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <a
              href={authUrl}
              className="rounded-full bg-[#6A6FDB] px-6 py-2 text-[#E7E3E5] hover:bg-[#719EA8] transition"
            >
              Login
            </a>
          )}

          {/* Mobile Menu Button */}
          <button
            className="xl:hidden ml-2"
            onClick={() => setNavOpen(!navOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`h-0.5 w-6 rounded-sm transition-all duration-200 ${
                    navOpen ? "bg-[#719EA8]" : "bg-[#E7E3E5]"
                  }`}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {navOpen && (
        <div className="xl:hidden bg-[#1A141C] text-[#E7E3E5] flex flex-col items-center gap-5 p-6 border-t border-white/10">
          {menuData.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className={`transition hover:text-[#6A6FDB] ${
                path === item.path ? "text-[#6A6FDB]" : "text-[#E7E3E5]"
              }`}
              onClick={() => setNavOpen(false)}
            >
              {item.title}
            </Link>
          ))}
          {/* 🔥 Removed user details + logout from here */}
        </div>
      )}
    </header>
  );
};

export default Header;
