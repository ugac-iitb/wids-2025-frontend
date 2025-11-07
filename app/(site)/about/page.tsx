'use client';
import React from 'react';

const AboutPage = () => {
  const events = [
    {
      date: '1st August, 2025',
      title: 'Stratify',
      status: 'past'
    },
    {
      date: '21st September, 2025',
      title: 'Codelite Analytics',
      status: 'past'
    },
    {
      date: '17th October, 2025',
      title: 'Deep Learning Bootcamp',
      status: 'past'
    },
    {
      date: '1st December,2025',  
      title: 'WiDS 5.0',
      status: 'upcoming'
    },
  ];

  return (
    <>
      {/* Hero / About Section (unchanged) */}
      <section className="relative min-h-[600px] w-full bg-gradient-to-br from-blue-900 via-purple-900 to-black">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('/images/logo/analytics-club-logo.jpeg')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div className="md:col-span-1" />
            <div className="md:col-span-1 py-24">
              <h2 className="text-4xl md:text-5xl font-bold mb-8 mt-8">
                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
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

{/* === Responsive Event Timeline === */}
<section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f1a] to-black overflow-hidden">
  {/* Background Blurs */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] bg-blue-600/10 blur-3xl rounded-full"></div>
    <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-purple-600/10 blur-3xl rounded-full"></div>
  </div>

  <div className="relative container mx-auto px-6 md:px-12">
    <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
      Our Events
    </h2>

    {/* Timeline Line (desktop only) */}
    <div className="hidden md:block absolute left-0 right-0 top-[54%] h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-orange-400 opacity-40"></div>

    {/* Cards */}
    <div
      className="relative flex flex-col md:flex-row md:justify-center md:items-center gap-12 md:gap-20 z-10"
    >
      {events.map((event, index) => (
        <div
          key={index}
          className={`group relative rounded-3xl overflow-hidden p-[2px] w-full sm:w-72 md:w-64 transition-all duration-300
            ${
              event.status === "upcoming"
                ? "bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 hover:shadow-[0_0_40px_rgba(255,161,75,0.15)]"
                : "bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-700 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]"
            }
            ${index % 2 === 0 ? "md:translate-y-8" : "md:-translate-y-8"}
          `}
        >
          {/* Inner card */}
          <div className="relative bg-[#0b0b15]/90 backdrop-blur-lg rounded-3xl h-full flex flex-col justify-between p-6 transition-transform duration-500 group-hover:-translate-y-1">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                {event.title}
              </h3>
              <p
                className={`text-sm md:text-base ${
                  event.status === "upcoming" ? "text-orange-300" : "text-blue-300"
                }`}
              >
                {event.date}
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={`self-start mt-4 px-4 py-1.5 text-sm font-medium rounded-full border 
                ${
                  event.status === "upcoming"
                    ? "border-orange-400 text-orange-300 bg-orange-500/10"
                    : "border-blue-400 text-blue-300 bg-blue-500/10"
                }`}
            >
              {event.status === "upcoming" ? "Upcoming" : "Past"}
            </div>

            {/* Glow Orb */}
            <div
              className={`absolute -bottom-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-30 
                ${event.status === "upcoming" ? "bg-orange-500" : "bg-blue-500"}`}
            ></div>
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
