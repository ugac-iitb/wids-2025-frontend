"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Process Login page
 * - Expects to be visited as: /process-login/?code=...&state=...
 * - Reads `code` from URL, POSTs it to a backend exchange endpoint,
 *   stores returned user info in localStorage, and redirects the user.
 *
 * Configuration (set these in .env.local):
 * NEXT_PUBLIC_AUTH_EXCHANGE_URL - full URL to your backend endpoint that accepts { code, state }
 *                                e.g. https://your-backend.example.com/auth/exchange
 * NEXT_PUBLIC_POST_LOGIN_REDIRECT - where to send the user after successful login (default: /projects)
 */

const ProcessLogin = () => {
  const router = useRouter();
  const [status, setStatus] = useState("Processing login...");
  const [codeVal, setCodeVal] = useState<string | null>(null);
  const [stateVal, setStateVal] = useState<string | null>(null);
  const [exchangeUrlDisplay, setExchangeUrlDisplay] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  useEffect(() => {
    // Parse code and state from URL
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  console.log("process-login: extracted code from URL:", code);
  const state = params.get("state");

  setCodeVal(code);
  setStateVal(state);

    if (!code) {
      setStatus("No authorization code found in URL.");
      console.error("process-login: missing code in query string");
      return;
    }

    const exchange = async () => {
      try {
        setStatus("Exchanging code for token...");

        // Backend exchange endpoint (must be public to client since this runs in the browser)
        const exchangeUrl = "https://understandably-subquadrangular-keven.ngrok-free.dev/auth/callback";

        setExchangeUrlDisplay(exchangeUrl);
        console.log("process-login: POST to exchange URL:", exchangeUrl, { code, state });

        // Allow opting in to sending credentials via env var
        const includeCreds = process.env.NEXT_PUBLIC_AUTH_INCLUDE_CREDENTIALS === "true";

        let res: Response; 
        try { 
          res = await fetch(exchangeUrl, { 
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code, state }),
            credentials: includeCreds ? "include" : "same-origin",
            mode: "cors",
          });
        } catch (networkErr: any) {
          // Network-level error (CORS preflight blocked, DNS, connection refused, etc.)
          console.error("process-login network error:", networkErr);
          setStatus("Network error while contacting backend. See console for details.");
          setResponseText(String(networkErr));
          return;
        }

        setResponseStatus(res.status);

        const text = await res.text();
        setResponseText(text);

        if (!res.ok) {
          throw new Error(`Token exchange failed: ${res.status} ${text}`);
        }

        // Try to parse JSON from response
        let data: any = null;
        try {
          data = JSON.parse(text);
        } catch (e) {
          // Not JSON; keep raw text
          data = null;
        }

        console.log("process-login: exchange response:", { status: res.status, text, json: data });

        // Minimal validation
        if (!data || (!data.token && !data.access_token && !data.auth_token)) {
          throw new Error("Exchange response did not contain an auth token");
        }

        // Normalize token key
        const authToken = data.token || data.access_token || data.auth_token;

        // Store useful values in localStorage
        try {
          localStorage.setItem("auth_token", authToken);
          if (data.username) localStorage.setItem("username", data.username);
          if (data.roll) localStorage.setItem("roll", data.roll);
          if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        } catch (err) {
          console.warn("process-login: failed to write to localStorage", err);
        }

        setStatus("Login successful — redirecting...");

        // Redirect after short delay so user can see message (and logs).
        const redirectTo =
          (process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT as string) || "/projects";

        setTimeout(() => {
          router.push(redirectTo);
        }, 800);
      } catch (err: any) {
        console.error("process-login error:", err);
        setStatus(`Login failed: ${err.message || err}`);
      }
    };

    exchange();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1A141C] text-[#E7E3E5]">
      <div className="max-w-xl w-full p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Processing login</h1>
        <p className="mb-2">{status}</p>
        <p className="text-sm text-[#719EA8]">
          If this page hangs, open the console to see additional debug information.
        </p>
      </div>
    </main>
  );
};

export default ProcessLogin;
