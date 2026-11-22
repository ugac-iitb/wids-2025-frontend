'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EventStatus = 'Closed' | 'Ongoing' | 'Upcoming';
type FilterType = 'All' | 'Upcoming' | 'Ongoing' | 'Closed';

interface ClubEvent {
  date: string;
  title: string;
  status: EventStatus;
  description: string;
}

const eventData: { year: string; events: ClubEvent[] } = {
  year: '2026-27',
  events: [
    {
      date: 'Jun 2026',
      title: 'Internship Preparation Program',
      status: 'Closed',
      description: 'Analytics, FMCG and Supply Chain, and Quant sessions with seniors.',
    },
    {
      date: 'Jun–Jul 2026',
      title: 'Learner’s Space',
      status: 'Closed',
      description: 'Agentic AI, Big Data Handling and Data Science with Python.',
    },
    {
      date: 'Aug–Oct 2026',
      title: 'Stratify',
      status: 'Closed',
      description: 'Finals held 24 Oct with five shortlisted teams per problem statement.',
    },
    {
      date: '3–4 Oct 2026',
      title: 'Global AI Hackathon',
      status: 'Closed',
      description: 'Bombay hub: ship a working AI product in under 24 hours.',
    },
    {
      date: 'Oct–Nov 2026',
      title: 'Epoch Zero',
      status: 'Ongoing',
      description: 'Two-week ML bootcamp with CV, NLP and RL tracks.',
    },
    {
      date: '30 Oct 2026',
      title: 'AI Fluency Session',
      status: 'Closed',
      description: 'With the DAV Team: AI tools for campus life and DAV platforms.',
    },
    {
      date: 'Nov 2026–Jan 2027',
      title: 'WiDS (Winter in Data Science)',
      status: 'Ongoing',
      description: 'Comprehensive AI/ML bootcamp covering Python fundamentals to Deep Learning, followed by hands-on projects exploring real-world applications of Machine Learning.',
    },
    {
      date: '6 Dec 2026',
      title: 'Personal Data Agents Hackathon',
      status: 'Upcoming',
      description: 'Build privacy-first agents that put people in control of their own data.',
    },
    {
      date: '25 Dec 2026',
      title: 'Convolve',
      status: 'Upcoming',
      description: 'The inter-IIT AI/ML hackathon, run with eight other IITs and open worldwide.',
    },
    {
      date: 'Dec 2026',
      title: 'ML Symposium',
      status: 'Upcoming',
      description: 'Project showcase with community upvotes, built with OpenAI.',
    },
    {
      date: '23 Jan 2027',
      title: 'Confluence',
      status: 'Upcoming',
      description: 'Our flagship analytics and consulting fest, run with Consult Club.',
    },
  ],
};

const AboutPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const counts: Record<FilterType, number> = {
    All: eventData.events.length,
    Upcoming: eventData.events.filter((e) => e.status === 'Upcoming').length,
    Ongoing: eventData.events.filter((e) => e.status === 'Ongoing').length,
    Closed: eventData.events.filter((e) => e.status === 'Closed').length,
  };

  const filteredEvents =
    activeFilter === 'All'
      ? eventData.events
      : eventData.events.filter((e) => e.status === activeFilter);

  return (
    <>
      {/* ======================================================== */}
      {/* HERO / ABOUT SECTION */}
      {/* ======================================================== */}
      <section className="relative min-h-[440px] w-full bg-gradient-to-br from-[#1c082e] via-[#12061e] to-[#07030e] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
          style={{ backgroundImage: "url('/wids-2025/images/logo/analytics-club-logo.jpeg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#07030e] pointer-events-none" />

        {/* Ambient Blur Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 md:pt-20 lg:pt-24 pb-14 sm:pb-16 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Visual Club Card / Logo Badge */}
            <div className="md:col-span-5 flex justify-center mt-2 md:mt-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="relative p-6 sm:p-7 rounded-3xl border border-pink-500/20 bg-gradient-to-br from-[#1d0e30]/85 via-[#130623]/85 to-[#0a0316]/95 backdrop-blur-xl shadow-[0_10px_45px_rgba(236,72,153,0.15)] text-center max-w-xs w-full group hover:border-pink-500/40 transition-all duration-300"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-pink-500/30 p-2 bg-black/40 shadow-[0_0_25px_rgba(236,72,153,0.25)] flex items-center justify-center">
                  <img
                    src="/wids-2025/images/logo/analytics-club-logo.jpeg"
                    alt="Analytics Club IIT Bombay"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Analytics Club</h3>
                <p className="text-xs font-semibold text-pink-300 uppercase tracking-widest">
                  IIT Bombay
                </p>
              </motion.div>
            </div>

            {/* About Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="md:col-span-7"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 mt-2 md:mt-4 tracking-tight">
                <span className="block bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
                  About Analytics Club
                </span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-5">
                Analytics Club at IIT Bombay stands at the forefront of data science innovation and learning.
                We are a community of passionate individuals dedicated to exploring the vast possibilities
                in data analytics, machine learning, and artificial intelligence.
              </p>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Our mission is to foster a dynamic environment where students can dive deep into the world
                of data science, collaborate on cutting-edge projects, and develop practical skills that
                are essential in today&apos;s data-driven world. Through our various initiatives, workshops,
                and events, we create opportunities for hands-on learning and real-world application of
                analytical concepts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* ANALYTICS CLUB EVENTS SECTION */}
      {/* ======================================================== */}
      <section className="pt-12 sm:pt-14 pb-20 sm:pb-24 bg-gradient-to-b from-[#07030e] via-[#140826] to-[#07030e] relative overflow-hidden">
        {/* Background Aurora Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-pink-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
              <span>Academic Year {eventData.year}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
                Analytics Club Events
              </span>
            </h2>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Explore our annual lineup of competitions, hands-on bootcamps, community hackathons, and flagship symposiums for the {eventData.year} session.
            </p>

            {/* Status Filter Pills */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md w-fit mx-auto">
              {(['All', 'Upcoming', 'Ongoing', 'Closed'] as FilterType[]).map((tab) => {
                const count = counts[tab];
                const isActive = activeFilter === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilter(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#e16993] to-[#c2185b] text-white shadow-[0_0_15px_rgba(225,105,147,0.4)] border border-pink-400/50'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{tab}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-black/30 text-white'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* TIMELINE VIEW */}
          {/* ======================================================== */}
          <div className="relative max-w-5xl mx-auto">
            {/* Center illuminated spine (Desktop) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-0.5 top-6 bottom-6 bg-gradient-to-b from-pink-500/80 via-purple-500/80 to-pink-500/30 pointer-events-none" />

            {/* Left illuminated spine (Mobile) */}
            <div className="md:hidden absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-pink-500/80 via-purple-500/80 to-pink-500/30 pointer-events-none" />

            <div className="space-y-8 md:space-y-12">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <motion.div
                      key={event.title}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.45, delay: idx * 0.04 }}
                      className="relative flex items-center"
                    >
                      {/* Center Spine Node (Desktop) */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-8 items-center justify-center z-10">
                        <div
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            event.status === 'Ongoing'
                              ? 'border-emerald-400 bg-[#07030e] shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                              : event.status === 'Upcoming'
                              ? 'border-pink-400 bg-[#07030e] shadow-[0_0_15px_rgba(244,114,182,0.8)]'
                              : 'border-purple-400/60 bg-[#07030e] shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                          }`}
                        >
                          {event.status === 'Ongoing' ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          ) : event.status === 'Upcoming' ? (
                            <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-purple-400/70" />
                          )}
                        </div>
                      </div>

                      {/* Left Spine Node (Mobile) */}
                      <div className="md:hidden absolute left-4 -translate-x-1/2 top-7 flex items-center justify-center z-10">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            event.status === 'Ongoing'
                              ? 'border-emerald-400 bg-[#07030e] shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                              : event.status === 'Upcoming'
                              ? 'border-pink-400 bg-[#07030e] shadow-[0_0_12px_rgba(244,114,182,0.8)]'
                              : 'border-purple-400/60 bg-[#07030e] shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                          }`}
                        >
                          {event.status === 'Ongoing' ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          ) : event.status === 'Upcoming' ? (
                            <span className="w-2 h-2 rounded-full bg-pink-400" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400/70" />
                          )}
                        </div>
                      </div>

                      {/* Timeline Card */}
                      <div
                        className={`w-full md:w-[calc(50%-2.5rem)] ml-10 md:ml-0 ${
                          isEven ? 'md:mr-auto' : 'md:ml-auto'
                        }`}
                      >
                        <div
                          className={`p-6 sm:p-7 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:-translate-y-1 group ${
                            event.status === 'Ongoing'
                              ? 'bg-gradient-to-br from-[#122822]/90 via-[#130724]/90 to-[#0a0316]/95 border-emerald-500/40 hover:border-emerald-400/70 shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]'
                              : event.status === 'Upcoming'
                              ? 'bg-gradient-to-br from-[#1f0e2b]/90 via-[#140724]/90 to-[#0a0316]/95 border-pink-500/30 hover:border-pink-400/60 shadow-[0_0_25px_rgba(236,72,153,0.15)] hover:shadow-[0_0_35px_rgba(236,72,153,0.25)]'
                              : 'bg-gradient-to-br from-[#150a24]/90 via-[#0e041b]/90 to-[#080211]/95 border-purple-500/20 hover:border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.08)]'
                          }`}
                        >
                          {/* Card Top: Date & Status */}
                          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5">
                            {/* Date Pill */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-gray-200">
                              <svg
                                className="w-3.5 h-3.5 text-pink-300 shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>{event.date}</span>
                            </div>

                            {/* Status Badge */}
                            {event.status === 'Ongoing' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                                </span>
                                <span>Ongoing</span>
                              </span>
                            )}

                            {event.status === 'Upcoming' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/40">
                                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                                <span>Upcoming</span>
                              </span>
                            )}

                            {event.status === 'Closed' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300/80 border border-purple-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/60"></span>
                                <span>Closed</span>
                              </span>
                            )}
                          </div>

                          {/* Event Title */}
                          <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-pink-200 transition-colors">
                            {event.title}
                          </h3>

                          {/* Event Description */}
                          <p className="text-sm sm:text-base text-gray-300 leading-relaxed mt-2.5">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Empty state if filter has 0 events */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-base sm:text-lg">No events found under this status filter.</p>
              <button
                type="button"
                onClick={() => setActiveFilter('All')}
                className="mt-4 px-5 py-2 rounded-full text-xs font-semibold bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 transition"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AboutPage;
