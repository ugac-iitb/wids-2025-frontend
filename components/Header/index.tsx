"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import menuData from "./menuData";

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return { user, login, logout };
};

const Header = () => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [stickyMenu, setStickyMenu] = useState(false);
  const { user, logout } = useAuth();

  const pathUrl = usePathname();

  // Build the Gymkhana OAuth URL with debug logging
  const getAuthUrl = () => {
    const redirectUri = 'http://localhost:3000/process-login/';
    // Enhanced debug logging
    console.log('OAuth Debug Info:');
    console.log('1. Raw redirect URI:', redirectUri);
    console.log('2. Encoded redirect URI:', encodeURIComponent(redirectUri));
    console.log('3. Full OAuth URL about to be used:', `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=7fd2hw5HewaGKKDGzsWghCpcBonwe5ytqsNPH0I3&response_type=code&scope=basic&redirect_uri=${encodeURIComponent(redirectUri)}&state=some_state`);
    
    return `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=7fd2hw5HewaGKKDGzsWghCpcBonwe5ytqsNPH0I3&response_type=code&scope=basic&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=some_state`;
  };

  const authUrl = getAuthUrl();

  const handleStickyMenu = () => setStickyMenu(window.scrollY >= 80);

  useEffect(() => {
    window.addEventListener("scroll", handleStickyMenu);
    return () => window.removeEventListener("scroll", handleStickyMenu);
  }, []);

  return (
    <header
      className={`fixed left-0 top-0 z-[99999] w-full py-4 transition duration-200 ${
        stickyMenu
          ? "bg-[#1A141C]/95 shadow-md backdrop-blur-md"
          : "bg-[#1A141C]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-6 md:px-12 lg:px-20">
        {/* -------- 1️⃣ Logos Section -------- */}
        <div className="flex items-center gap-6">
          <div className="relative h-12 w-20">
            <Link href="/" className="block h-full w-full">
              <Image
                src="/images/logo/ugac.png"
                alt="ugaclogo"
                fill
                className="brightness-0 invert"
              />
            </Link>
          </div>
          <div className="relative h-12 w-12">
            <Link href="/" className="block h-full w-full">
              <Image src="/images/logo/analyticsclub.png" alt="analyticsclublogo" fill />
            </Link>
          </div>
        </div>

        {/* -------- 2️⃣ Nav Menu (Desktop) -------- */}
        <nav className="hidden xl:flex items-center justify-center flex-1 text-[#E7E3E5]">
          <ul className="flex items-center justify-center gap-10">
            {menuData.map((menuItem, key) => (
              <li key={key} className={menuItem.submenu ? "group relative" : ""}>
                {menuItem.submenu ? (
                  <>
                    <button
                      onClick={() => setDropdownToggler(!dropdownToggler)}
                      className="flex cursor-pointer items-center gap-2 hover:text-[#6A6FDB] transition"
                    >
                      {menuItem.title}
                      <svg
                        className="h-3 w-3 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                      </svg>
                    </button>
                    <ul
                      className={`absolute left-0 mt-2 flex-col rounded-md bg-[#1A141C] p-3 shadow-md ${
                        dropdownToggler ? "flex" : "hidden"
                      }`}
                    >
                      {menuItem.submenu.map((item, subkey) => (
                        <li key={subkey} className="px-3 py-1 hover:text-[#6A6FDB] transition">
                          <Link href={item.path || "#"}>{item.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    href={menuItem.path}
                    className={`transition hover:text-[#6A6FDB] ${
                      pathUrl === menuItem.path ? "text-[#6A6FDB]" : "text-[#E7E3E5]"
                    }`}
                  >
                    {menuItem.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* -------- 3️⃣ Auth Buttons (Desktop) -------- */}
        <div className="hidden xl:flex items-center ml-6">
          {!user ? (
            <a
              href={authUrl}
              className="rounded-full bg-[#6A6FDB] px-6 py-2 text-[#E7E3E5] hover:bg-[#719EA8] transition"
            >
              Login
            </a>
          ) : (
            <button
              onClick={logout}
              className="rounded-full bg-[#054066] px-6 py-2 text-[#E7E3E5] hover:bg-[#719EA8] transition"
            >
              Logout
            </button>
          )}
        </div>


        {/* -------- Mobile Menu Button -------- */}
        <button
          aria-label="menu"
          className="xl:hidden ml-4"
          onClick={() => setNavigationOpen(!navigationOpen)}
        >
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-0.5 w-6 rounded-sm transition-all duration-200 ease-in-out ${
                  navigationOpen ? "bg-[#719EA8]" : "bg-[#E7E3E5]"
                }`}
              />
            ))}
          </div>
        </button>
      </div>

      {/* -------- Mobile Navigation Drawer -------- */}
      {navigationOpen && (
        <div className="xl:hidden bg-[#1A141C] text-[#E7E3E5] flex flex-col items-center gap-5 p-6 mt-3">
          {menuData.map((menuItem, key) => (
            <Link
              key={key}
              href={menuItem.path}
              className={`transition hover:text-[#6A6FDB] ${
                pathUrl === menuItem.path ? "text-[#6A6FDB]" : "text-[#E7E3E5]"
              }`}
              onClick={() => setNavigationOpen(false)}
            >
              {menuItem.title}
            </Link>
          ))}

          {/* Auth Button inside Mobile Menu */}
          {!user ? (
            <a
              href={authUrl}
              className="rounded-full bg-[#6A6FDB] px-6 py-2 text-[#E7E3E5] hover:bg-[#719EA8] transition"
              onClick={() => setNavigationOpen(false)}
            >
              Login
            </a>
          ) : (
            <button
              onClick={() => {
                logout();
                setNavigationOpen(false);
              }}
              className="rounded-full bg-[#054066] px-6 py-2 text-[#E7E3E5] hover:bg-[#719EA8] transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
