"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  // Add scroll animation state
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Enhanced Header with scroll animation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            SAGE: Student Assistance & Guidance System
          </h1>
          <div className="space-x-4">
            <Link href="/student-login" className="px-4 py-2 rounded-full text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors duration-200">
              Student Login
            </Link>
            <Link href="/teacher-login" className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 shadow-sm hover:shadow-md transition-all duration-200">
              Teacher Login
            </Link>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-sm font-medium">
                University Research Initiative
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Exploring the future of <span className="text-indigo-600">academic support</span>
              </h2>
              <p className="mt-4 text-xl text-gray-600 leading-relaxed">
                A research project investigating AI-powered assistance, faculty knowledge exchange, and personalized academic guidance systems.
              </p>
            </div>
            
            <div className="space-y-6">
              <Feature 
                icon={<ChatBubbleIcon />}
                title="AI Interaction Research" 
                description="Exploring how AI systems can provide contextually relevant academic information and support to students." 
              />
              <Feature 
                icon={<PhoneIcon />}
                title="Faculty-Student Communication" 
                description="Studying new models for direct faculty guidance and mentorship through integrated communication channels." 
              />
              <Feature 
                icon={<BookOpenIcon />}
                title="Learning Augmentation" 
                description="Investigating AI-generated study materials and their impact on knowledge retention and academic performance." 
              />
            </div>
            
            <div className="pt-4">
              <Link href="/student-login" className="px-8 py-4 rounded-full text-base font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-md shadow-sm transition-all duration-300 inline-flex items-center group">
                Get Started 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block transform hover:scale-105 transition-transform duration-500 hover:rotate-1">
            {/* SVG illustration with research focus */}
            <div className="rounded-2xl shadow-lg overflow-hidden bg-white p-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="w-full h-auto">
                {/* Background elements */}
                <defs>
                  <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f3f4fa" />
                    <stop offset="100%" stopColor="#eef2ff" />
                  </linearGradient>
                  <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                
                {/* Background shape */}
                <rect x="0" y="0" width="800" height="600" fill="url(#bg-gradient)" rx="20" ry="20" />
                
                {/* Decorative elements */}
                <circle cx="700" cy="100" r="60" fill="#f3f4fa" opacity="0.6" />
                <circle cx="650" cy="180" r="40" fill="#eef2ff" opacity="0.7" />
                <circle cx="730" cy="220" r="25" fill="#f3f4fa" opacity="0.5" />
                
                {/* Researcher with laptop */}
                <g transform="translate(150, 180)">
                  {/* Laptop */}
                  <rect x="70" y="130" width="180" height="120" rx="10" ry="10" fill="#4f46e5" />
                  <rect x="80" y="140" width="160" height="100" fill="#f3f4fa" />
                  <rect x="60" y="250" width="200" height="15" rx="7" ry="7" fill="#4338ca" />
                  
                  {/* Researcher - simplified figure */}
                  <circle cx="160" cy="90" r="40" fill="#4f46e5" /> {/* Head */}
                  <path d="M160 130 L160 230 Q180 240, 200 230 L200 190 Q180 200, 160 190 Z" fill="#4f46e5" /> {/* Body */}
                  <path d="M160 130 L120 190 L130 195 L160 150 Z" fill="#4f46e5" /> {/* Arm */}
                </g>
                
                {/* Research elements */}
                {/* Data visualization */}
                <g transform="translate(450, 150)">
                  <rect x="0" y="0" width="200" height="80" rx="20" ry="20" fill="url(#accent-gradient)" />
                  <rect x="20" y="100" width="180" height="60" rx="20" ry="20" fill="#f3f4fa" stroke="#4f46e5" strokeWidth="2" />
                  <rect x="40" y="180" width="160" height="70" rx="20" ry="20" fill="#f3f4fa" stroke="#4f46e5" strokeWidth="2" />
                  
                  {/* Data visualization elements */}
                  <line x1="30" y1="25" x2="170" y2="25" stroke="white" strokeWidth="3" />
                  <line x1="30" y1="45" x2="140" y2="45" stroke="white" strokeWidth="3" />
                  <line x1="30" y1="65" x2="120" y2="65" stroke="white" strokeWidth="3" />
                  
                  <line x1="40" y1="125" x2="180" y2="125" stroke="#4f46e5" strokeWidth="2" opacity="0.7" />
                  <line x1="40" y1="145" x2="150" y2="145" stroke="#4f46e5" strokeWidth="2" opacity="0.7" />
                  
                  <line x1="60" y1="205" x2="180" y2="205" stroke="#4f46e5" strokeWidth="2" opacity="0.7" />
                  <line x1="60" y1="225" x2="170" y2="225" stroke="#4f46e5" strokeWidth="2" opacity="0.7" />
                  <line x1="60" y1="245" x2="130" y2="245" stroke="#4f46e5" strokeWidth="2" opacity="0.7" />
                </g>
                
                {/* Research materials */}
                <g transform="translate(100, 400)">
                  {/* Stack of research papers */}
                  <rect x="0" y="0" width="140" height="30" rx="5" ry="5" fill="#4338ca" />
                  <rect x="10" y="-20" width="130" height="25" rx="5" ry="5" fill="#4f46e5" />
                  <rect x="5" y="-40" width="120" height="25" rx="5" ry="5" fill="#6366f1" />
                  
                  {/* Research symbols */}
                  <rect x="170" y="-20" width="80" height="10" fill="#4338ca" />
                  <polygon points="210,0 180,-40 240,-40 210,0" fill="#4338ca" />
                  <circle cx="210" cy="-20" r="8" fill="#f3f4fa" />
                </g>
                
                {/* AI/Research symbols */}
                <g transform="translate(550, 400)">
                  {/* Neural network pattern */}
                  <line x1="0" y1="0" x2="50" y2="0" stroke="#4f46e5" strokeWidth="3" />
                  <line x1="50" y1="0" x2="50" y2="50" stroke="#4f46e5" strokeWidth="3" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="#4f46e5" strokeWidth="3" />
                  <line x1="100" y1="50" x2="100" y2="0" stroke="#4f46e5" strokeWidth="3" />
                  <line x1="100" y1="0" x2="150" y2="0" stroke="#4f46e5" strokeWidth="3" />
                  
                  <circle cx="50" cy="0" r="8" fill="#4338ca" />
                  <circle cx="50" cy="50" r="8" fill="#4338ca" />
                  <circle cx="100" cy="50" r="8" fill="#4338ca" />
                  <circle cx="100" cy="0" r="8" fill="#4338ca" />
                </g>
                
                {/* Research icons */}
                {/* Data icon */}
                <g transform="translate(430, 80)">
                  <rect x="0" y="0" width="40" height="40" rx="10" ry="10" fill="#4f46e5" />
                  <path d="M8 15 H32 M8 25 H25" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </g>
                
                {/* Document icon */}
                <g transform="translate(320, 400)">
                  <path d="M0 0 H30 V40 H0 Z" fill="white" stroke="#4f46e5" strokeWidth="2" />
                  <line x1="5" y1="10" x2="25" y2="10" stroke="#4f46e5" strokeWidth="2" />
                  <line x1="5" y1="20" x2="25" y2="20" stroke="#4f46e5" strokeWidth="2" />
                  <line x1="5" y1="30" x2="15" y2="30" stroke="#4f46e5" strokeWidth="2" />
                </g>
                
                {/* Research idea icon */}
                <g transform="translate(490, 330)">
                  <circle cx="15" cy="15" r="15" fill="#8b5cf6" opacity="0.9" />
                  <path d="M15 25 L15 35 M10 35 H20" stroke="#4f46e5" strokeWidth="2" />
                </g>
                
                {/* Connection lines */}
                <g opacity="0.3">
                  <path d="M200 250 C 300 280, 400 260, 450 230" stroke="#4f46e5" strokeWidth="2" fill="none" />
                  <path d="M250 400 C 300 350, 380 330, 430 350" stroke="#4f46e5" strokeWidth="2" fill="none" />
                  <path d="M380 150 C 400 200, 420 220, 450 150" stroke="#4f46e5" strokeWidth="2" fill="none" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Research Impact Section */}
      <section className="py-16 bg-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold">Research Objectives</h3>
            <p className="mt-4 text-indigo-100 max-w-3xl mx-auto">Our interdisciplinary research aims to understand and improve educational support systems through technological innovation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ResearchObjective 
              number="01" 
              title="AI Interaction"
              description="Investigating how students interact with AI systems for academic assistance."
            />
            <ResearchObjective 
              number="02" 
              title="Knowledge Transfer"
              description="Studying the efficiency of AI-mediated knowledge dissemination in educational contexts."
            />
            <ResearchObjective 
              number="03" 
              title="Learning Outcomes"
              description="Measuring the impact of AI guidance on student performance and engagement."
            />
          </div>
        </div>
      </section>

      {/* Participation CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900">Join our research initiative</h3>
          <p className="mt-4 text-xl text-gray-600">Help shape the future of educational technology by participating in our ongoing research.</p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/student-login" className="px-8 py-4 rounded-full text-base font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-md shadow-sm transition-all duration-300">
              Sign Up Now
            </Link>
            <Link href="/learn-more" className="px-8 py-4 rounded-full text-base font-medium border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-300">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
     
    </div>
  );
}

// Feature component with enhanced design
function Feature({ icon, title, description }) {
  return (
    <div className="flex items-start p-4 rounded-xl hover:bg-indigo-50 transition-colors duration-300">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  );
}

// Research objective component
function ResearchObjective({ number, title, description }) {
  return (
    <div className="bg-indigo-800 p-6 rounded-xl hover:bg-indigo-700 transition-colors duration-300">
      <div className="text-indigo-300 text-sm font-mono mb-2">{number}</div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-indigo-100">{description}</p>
    </div>
  );
}

// Footer link component
function FooterLink({ href, children }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-white transition-colors duration-200">
        {children}
      </Link>
    </li>
  );
}

// Social media icon
function SocialIcon({ href, aria, children }) {
  return (
    <a href={href} aria-label={aria} className="text-gray-400 hover:text-white transition-colors duration-200">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </a>
  );
}

// Icons
function ChatBubbleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}