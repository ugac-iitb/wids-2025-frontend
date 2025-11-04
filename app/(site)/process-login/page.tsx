"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProcessLogin() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [responseMsg, setResponseMsg] = useState("Processing login...");

  // Your Django endpoint (must match your backend route exactly)
  const exchangeUrl =
    "https://understandably-subquadrangular-keven.ngrok-free.dev/auth/callback/";
  const includeCreds = true; // Django session cookie

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
          body: new URLSearchParams({ code }), // ✅ only sending code
          credentials: includeCreds ? "include" : "same-origin",
          mode: "cors",
        });

        if (!res.ok) {
          const errText = await res.text();
          // ❌ previously used quotes incorrectly — should use backticks for template strings
          throw new Error(`Server responded with ${res.status}: ${errText}`);
        }

        const data = await res.json();
        console.log("Backend response:", data);

        if (data.ok) {
          // ✅ backticks used properly now
          setResponseMsg(`Welcome ${data.user?.name || "User"}!`);
        } else {
          setResponseMsg(`Error: ${data.error || "Login failed"}`);
        }
      } catch (err) {
        console.error("Error:", err);
        setResponseMsg("Error processing login");
      }
    };

    sendCodeToBackend();
  }, [code, exchangeUrl, includeCreds]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Processing Login...</h1>
      <p>
        <strong>Code:</strong> {code || "No code found"}
      </p>
      <p className="mt-4 text-blue-600">{responseMsg}</p>
    </div>
  );
}
