'use client';
import React from 'react';

const AboutPage = () => {
  const events = [
    {
      date: '1st August, 2026',
      title: 'Stratify',
      status: 'past'
    },
    {
      date: '21st September, 2026',
      title: 'Codelite Analytics',
      status: 'past'
    },
    {
      date: '17th October, 2026',
      title: 'Deep Learning Bootcamp',
      status: 'past'
    },
    {
      date: '1st December, 2026',  
      title: 'WiDS 6.0',
      status: 'upcoming'
    },
  ];

  return (
    <>
      {/* Hero / About Section */}
      <section className="relative min-h-[600px] w-full bg-gradient-to-br from-[#1c082e] via-[#12061e] to-[#07030e]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{ backgroundImage: "url('/wids-2025/images/logo/analytics-club-logo.jpeg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="md:col-span-1" />
            <div className="md:col-span-1 py-24">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-8 mt-8">
                <span className="block bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
                  About Analytics Club
                </span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Analytics Club at IIT Bombay stands at the forefront of data science innovation and learning.
                We are a community of passionate individuals dedicated to exploring the vast possibilities
                in data analytics, machine learning, and artificial intelligence.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Our mission is to foster a dynamic environment where students can dive deep into the world
                of data science, collaborate on cutting-edge projects, and develop practical skills that
                are essential in today's data-driven world. Through our various initiatives, workshops,
                and events, we create opportunities for hands-on learning and real-world application of
                analytical concepts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section - Aurora Glow */}
      <section className="py-24 bg-gradient-to-b from-[#07030e] via-[#140826] to-[#07030e] relative overflow-hidden">
        {/* Background Gradient Blur Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-pink-600/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[600px] h-[600px] bg-purple-600/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-16 bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(236,72,153,0.35)]">
            Analytics Club Events
          </h2>

          {/* Central Line (Hidden on small screens) */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-pink-500 via-fuchsia-500 to-purple-500 opacity-50 hidden md:block"></div>

            {/* Event Cards */}
            {events.map((event, index) => (
              <div
                key={index}
                className={`relative flex items-center justify-between mb-20 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                } flex-col md:flex-row`}
              >
                {/* Connector Dot (Hidden on small screens) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex-col items-center hidden md:flex">
                  <div
                    className={`relative w-6 h-6 rounded-full border-2 
                      ${
                        event.status === 'upcoming'
                          ? 'border-pink-400 bg-pink-500/30'
                          : 'border-purple-400 bg-purple-500/30'
                      }`}
                  >
                    <div
                      className={`absolute inset-0 rounded-full blur-md 
                        ${
                          event.status === 'upcoming'
                            ? 'bg-pink-500/60'
                            : 'bg-purple-500/60'
                        }`}
                    ></div>
                  </div>

                  {/* Glowing pulse */}
                  <div
                    className={`absolute w-6 h-6 rounded-full animate-ping 
                      ${
                        event.status === 'upcoming'
                          ? 'bg-pink-400/50'
                          : 'bg-purple-400/40'
                      }`}
                  ></div>
                </div>

                {/* Event Card */}
                <div
                  className={`relative w-full md:w-[45%] p-6 rounded-2xl backdrop-blur-md shadow-lg
                    transition-all duration-300 hover:scale-105 
                    ${
                      event.status === 'upcoming'
                        ? 'bg-gradient-to-br from-pink-500/20 via-fuchsia-900/20 to-purple-900/30 border border-pink-400/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.35)]'
                        : 'bg-gradient-to-br from-[#180d2c]/90 to-[#0c0418]/90 border border-purple-500/20 hover:border-pink-500/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]'
                    }
                    ${index % 2 === 0 ? 'md:text-left text-center' : 'md:text-right text-center'}
                  `}
                >
                  <h3 className="text-white text-2xl font-semibold mb-2">{event.title}</h3>
                  <p
                    className={`text-sm tracking-wide font-medium ${
                      event.status === 'upcoming' ? 'text-pink-300' : 'text-purple-300'
                    }`}
                  >
                    {event.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;