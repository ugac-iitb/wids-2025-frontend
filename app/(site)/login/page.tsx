'use client';

import React, { useEffect } from 'react';

const Login = () => {
  // Build Gymkhana OAuth URL from env vars if available, otherwise fall
  // back to the provided ngrok callback URL.
  const clientId = process.env.NEXT_PUBLIC_GYMKHANA_CLIENT_ID as string | undefined;
  const redirectUri = process.env.NEXT_PUBLIC_GYMKHANA_REDIRECT_URI as string | undefined;
  const state = (process.env.NEXT_PUBLIC_GYMKHANA_STATE as string) || 'some_state';

  const target =
    clientId && redirectUri
      ? `https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=${encodeURIComponent(
          clientId
        )}&response_type=code&scope=basic&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&state=${encodeURIComponent(state)}`
      : 'https://gymkhana.iitb.ac.in/profiles/oauth/authorize/?client_id=YOUR_CLIENT_ID&response_type=code&scope=basic&redirect_uri=https://understandably-subquadrangular-keven.ngrok-free.dev/auth/callback&state=some_state';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Gymkhana auth URL (login page):', target);
      window.location.href = target;
    }
  }, [target]);

  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 lg:pt-[180px] lg:pb-28 bg-[#1A141C]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[500px] rounded-md bg-[#242B51] px-6 py-10 shadow-md text-center">
              <h3 className="mb-3 text-center text-2xl font-bold text-[#E7E3E5] sm:text-3xl">
                Redirecting...
              </h3>
              <p className="mb-11 text-center text-base font-medium text-[#719EA8]">
                You are being redirected to the authentication server. If the redirect
                does not happen, <a className="text-[#6A6FDB] underline" href={target}>click here</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
