"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authEvents } from "@/app/utils/authEvent";
import { API_URL } from "@/lib/constants";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "WiDS-Processing Login",

  // other metadata
  description: "This is page for processing login"
};

export default function ProcessLogin() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [responseMsg, setResponseMsg] = useState("Processing login...");

  const exchangeUrl =
    `${API_URL}/auth/callback/`;
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
        // console.log("Backend response:", data);

        if (data.ok) {
          const { user, token_type, access_token } = data;

          // ✅ Save auth info
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("token_type", token_type);

          // ✅ Trigger navbar update
          authEvents.trigger();

          // ✅ Redirect immediately to /user
          router.push("/user");
        } else {
          setResponseMsg(`Error: ${data.error || "Login failed"}`);
        }
      } catch (err) {
        console.error("Error:", err);
        setResponseMsg("Error processing login");
      }
    };

    sendCodeToBackend();
  }, [code, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-[#E7E3E5]">
      <h1 className="text-2xl font-semibold">{responseMsg}</h1>
    </div>
  );
}
