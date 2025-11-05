"use client";

import UserDetails from "@/components/UserDetails";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/user"; // ✅ Import your User type

export default function ProcessLogin() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [responseMsg, setResponseMsg] = useState("Processing login...");
  const [user, setUser] = useState<User | null>(null);

  const exchangeUrl =
    "https://understandably-subquadrangular-keven.ngrok-free.dev/auth/callback/";
  const includeCreds = true;

  useEffect(() => {
    if (!code) {
      setResponseMsg("No authorization code found.");
      return;
    }

    const sendCodeToBackend = async () => {
      try {
        const res = await fetch(exchangeUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ code }),
          credentials: includeCreds ? "include" : "same-origin",
          mode: "cors",
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Server responded with ${res.status}: ${errText}`);
        }

        const data = await res.json();
        console.log("Backend response:", data);

        if (data.ok) {
          const { user, token_type, access_token } = data;

          // ✅ Save to localStorage
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("token_type", token_type);

          setUser(user);
          setResponseMsg(`Welcome ${user?.name || "User"}!`);
        } else {
          setResponseMsg(`Error: ${data.error || "Login failed"}`);
        }
      } catch (err) {
        console.error("Error:", err);
        setResponseMsg("Error processing login");
      }
    };

    sendCodeToBackend();
  }, [code]);

  return (
    <div className="pb-10 pt-30 flex flex-col items-center justify-center min-h-screen">
      {user ? (
        <UserDetails user={user} /> // ✅ Pass user as prop
      ) : (
        <p className="text-gray-600 text-lg">{responseMsg}</p>
      )}
    </div>
  );
}
