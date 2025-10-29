'use client';
import React from 'react';

const AboutPage = () => {
  const events = [
    {
      date: 'OCT 26, 2023',
      title: 'DATA VISUALIZATION WORKSHOP',
      icon: '📊',
      status: 'past'
    },
    {
      date: 'NOV 15, 2023',
      title: 'PREDICTIVE MODELING SEMINAR',
      icon: '📈',
      status: 'past'
    },
    {
      date: 'DEC 5, 2024',
      title: 'MACHINE LEARNING HACKATHON',
      icon: '🤖',
      status: 'upcoming'
    },
    {
      date: 'FEB 10, 2024',
      title: 'AI ETHICS PANEL',
      icon: '⚖️',
      status: 'upcoming'
    },
  ];

  return (
    <>
      {/* Analytics Club Section - themed to match landing Hero */}
      <section className="relative min-h-[600px] w-full bg-gradient-to-br from-blue-900 via-purple-900 to-black">
        {/* Decorative Background Image (public/analytics-club-logo.jpg) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('/images/analytics-club-logo.jpeg')" }}
          aria-hidden="true"
        />

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            {/* Left Column - Intentionally Empty to create the visual offset */}
            <div className="md:col-span-1" />

            {/* Right Column - Content */}
            <div className="md:col-span-1 py-24">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
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

      {/* Analytics Club Events Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Analytics Club Events</h2>
          
          {/* Timeline */}
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-500"></div>

            {/* Events */}
            {events.map((event, index) => (
              <div key={index} className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'flex-row-reverse' : ''
              }`}>
                {/* Event Content */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                  <div className={`p-6 rounded-lg ${
                    event.status === 'upcoming' 
                      ? 'bg-orange-500/10 border border-orange-500/30' 
                      : 'bg-blue-500/10 border border-blue-500/30'
                  }`}>
                    <div className="text-2xl mb-2">{event.icon}</div>
                    <h3 className="text-white text-xl font-semibold mb-2">{event.title}</h3>
                    <p className={`text-sm ${
                      event.status === 'upcoming' ? 'text-orange-400' : 'text-blue-400'
                    }`}>
                      {event.date}
                    </p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-dark">
                  <div className="w-4 h-4 rounded-full bg-blue-400 animate-ping"></div>
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


