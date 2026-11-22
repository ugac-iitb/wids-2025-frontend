"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import menuData from "./menuData";
import { checkIsMentor } from "@/lib/api";
import { authEvents } from "@/app/utils/authEvent";
import { API_URL } from "@/lib/constants";
import { clientID, redirectURI } from "@/lib/constants";

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
      const res = await fetch(`${API_URL}/auth/logout`, {
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
  const [menuItems, setMenuItems] = useState(menuData);

  const [isMentor, setIsMentor] = useState(false);
  const { user, logout } = useAuth();

  const pathUrl = usePathname();
  const router = useRouter();
  const path = pathUrl || "/";

  // Build the Gymkhana OAuth URL with debug logging
  const getAuthUrl = () => {
    // Enhanced debug logging
    console.log('OAuth Debug Info:');
    console.log('1. Raw redirect URI:', redirectURI);
    console.log('2. Encoded redirect URI:', encodeURIComponent(redirectURI));
    console.log('3. Full OAuth URL about to be used:', `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${clientID}&response_type=code&scope=basic&redirect_uri=${encodeURIComponent(redirectURI)}&state=some_state`);
    
    return `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${clientID}&response_type=code&scope=basic%20profile%20ldap%20program&redirect_uri=${encodeURIComponent(
    redirectURI
  )}&state=some_state`;
  };

  const authUrl = getAuthUrl();

  const handleStickyMenu = () => setStickyMenu(window.scrollY >= 80);

  useEffect(() => {
    const handleScroll = () => setStickyMenu(window.scrollY >= 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateMentorMenu = () => {
      const storedUser = localStorage.getItem("user");

      let isMentorFlag = false;

      if (storedUser) {
        try {
          const userObj = JSON.parse(storedUser);
          isMentorFlag = Boolean(userObj.is_mentor);
          setIsMentor(isMentorFlag);
        } catch (err) {
          console.error("Invalid user JSON in localStorage");
          setIsMentor(false);
        }
      } else {
        setIsMentor(false);
      }

      // Now update the menu based on isMentorFlag
      if (isMentorFlag) {
        setMenuItems(menuData);
      } else {
        setMenuItems(menuData.filter(item => item.path !== "/mentor"));
      }
    };

    updateMentorMenu();
  }, [user]);  // Runs again on logout





  return (
    <header
      className={`fixed left-0 top-0 z-[99999] w-full py-4 transition duration-300 ${
        stickyMenu
          ? "bg-[#0d0418]/92 shadow-[0_4px_30px_rgba(225,105,147,0.2)] backdrop-blur-xl border-b border-[#a54781]/30"
          : "bg-[#0d0418]/75 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-3 md:px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <Image
            src="/wids-2025/images/logo/ugac.png"
            alt="UGAC"
            width={80}
            height={40}
            className="brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all group-hover:scale-105"
          />
          <Image
            src="/wids-2025/images/logo/analyticsclub-dark.png"
            alt="Analytics Club"
            width={40}
            height={40}
            className="drop-shadow-[0_0_12px_rgba(236,72,153,0.4)] transition-all group-hover:scale-105"
          />
        </Link>

        {/* Menu (Desktop) */}
        <nav className="hidden xl:flex items-center gap-10 text-[#f1e8f8]">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className={`transition-colors duration-200 font-medium ${
                path === item.path
                  ? "text-pink-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)] font-semibold"
                  : "text-[#f1e8f8]/90 hover:text-pink-300"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Right side: Login or Avatar + Hamburger */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          {/* Distinct Standout Mentor Button - Aurora Themed */}
          <Link
            href="/mentor"
            className={`relative inline-flex items-center justify-center px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 shadow-sm group ${
              path === "/mentor"
                ? "bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white shadow-[0_0_25px_rgba(236,72,153,0.6)] border border-pink-300"
                : "bg-gradient-to-r from-pink-950/70 via-fuchsia-950/60 to-purple-950/70 text-pink-200 border border-pink-500/40 hover:border-pink-300 hover:text-white hover:shadow-[0_0_25px_rgba(236,72,153,0.45)] hover:scale-105 active:scale-95"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              <span>Mentor Portal</span>
            </span>
          </Link>

          {/* Auth Section */}
          {user ? (
            <>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                <Image
                  src={user.avatar || "/wids-2025/images/user/avatar.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full border border-pink-400/50 hover:opacity-85 shadow-[0_0_12px_rgba(236,72,153,0.3)] transition"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-[2.5rem] w-44 bg-[#120726]/95 border border-pink-500/20 backdrop-blur-xl rounded-xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-2 text-[#f1e8f8]">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push("/user");
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-pink-500/15 hover:text-pink-300 transition"
                  >
                    User Details
                  </button>
                  <button
                    onClick={async () => {
                      await logout();
                      setDropdownOpen(false);
                      router.push("/");
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-pink-500/15 hover:text-pink-300 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <a
              href={authUrl}
              className="rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 px-6 py-2 text-white font-medium shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
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
                    navOpen ? "bg-pink-400" : "bg-[#f1e8f8]"
                  }`}
                />
              ))}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {navOpen && (
        <div className="xl:hidden bg-[#0d061c]/98 backdrop-blur-2xl text-[#f1e8f8] flex flex-col items-center gap-5 p-6 border-t border-pink-500/20 shadow-2xl">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className={`transition hover:text-pink-300 font-medium ${
                path === item.path ? "text-pink-400 font-semibold" : "text-[#f1e8f8]"
              }`}
              onClick={() => setNavOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
