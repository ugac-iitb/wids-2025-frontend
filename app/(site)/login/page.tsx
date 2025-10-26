'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your login logic here
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <section className="relative z-10 overflow-hidden pt-36 pb-16 lg:pt-[180px] lg:pb-28 bg-[#1A141C]">
      <div className="container mx-auto">
        <div className="-mx-4 flex flex-wrap justify-center">
          <div className="w-full px-4">
            <div className="mx-auto max-w-[500px] rounded-md bg-[#242B51] px-6 py-10 shadow-md">
              <h3 className="mb-3 text-center text-2xl font-bold text-[#E7E3E5] sm:text-3xl">
                Sign in to your account
              </h3>
              <p className="mb-11 text-center text-base font-medium text-[#719EA8]">
                Login to access your account and resources
              </p>
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-8">
                  <label htmlFor="email" className="mb-3 block text-sm text-[#E7E3E5]">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#6D6D71] bg-[#1A141C] py-3 px-4 text-[#E7E3E5] placeholder-[#6D6D71] focus:border-[#6A6FDB] focus:ring-1 focus:ring-[#6A6FDB] outline-none"
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-8">
                  <label htmlFor="password" className="mb-3 block text-sm text-[#E7E3E5]">
                    Your Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-md border border-[#6D6D71] bg-[#1A141C] py-3 px-4 text-[#E7E3E5] placeholder-[#6D6D71] focus:border-[#6A6FDB] focus:ring-1 focus:ring-[#6A6FDB] outline-none"
                    required
                  />
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="mb-8 flex flex-col justify-between sm:flex-row sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <label htmlFor="rememberMe" className="flex cursor-pointer select-none items-center text-[#E7E3E5]">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="mr-3 h-5 w-5 rounded border border-[#6D6D71] bg-[#1A141C] accent-[#6A6FDB]"
                      />
                      Keep me signed in
                    </label>
                  </div>
                  <div>
                    <a href="#0" className="text-[#6A6FDB] text-sm font-medium hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mb-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md bg-[#6A6FDB] py-4 px-9 text-base font-medium text-[#E7E3E5] transition duration-300 ease-in-out hover:bg-[#719EA8]"
                  >
                    Sign in
                  </button>
                </div>
              </form>

              {/* Signup Link */}
              <p className="text-center text-base font-medium text-[#E7E3E5]">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-[#6A6FDB] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
