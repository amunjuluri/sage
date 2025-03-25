
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Enhanced Header with scroll animation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Student Assistance & Guidance Engine
          </h1>
          <div className="space-x-4">
            <Link href="/student-login" className="px-4 py-2 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200">
              Student Login
            </Link>
            <Link href="/teacher-login" className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-md hover:shadow-lg transition-all duration-200">
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
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                University Support Platform
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                Get the university support you <span className="text-blue-600">deserve</span>
              </h2>
              <p className="mt-4 text-xl text-gray-600 leading-relaxed">
                AI-powered assistance, faculty knowledge, and personalized help—all in one platform.
              </p>
            </div>
            
            <div className="space-y-6">
              <Feature 
                icon={<ChatBubbleIcon />}
                title="AI-Powered Answers" 
                description="Get instant responses to your university-related questions through our AI assistant." 
              />
              <Feature 
                icon={<PhoneIcon />}
                title="Connect with Professors" 
                description="Request callbacks from your professors for personalized guidance when you need it most." 
              />
              <Feature 
                icon={<BookOpenIcon />}
                title="Study Assistance" 
                description="Access AI-generated flashcards, summaries, and quizzes to boost your learning." 
              />
            </div>
            
            <div className="pt-4">
              <Link href="/student-login" className="px-8 py-4 rounded-full text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg shadow-md transition-all duration-300 inline-flex items-center group">
                Get Started 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="hidden lg:block transform hover:scale-105 transition-transform duration-500 hover:rotate-1">
            {/* SVG illustration instead of placeholder */}
            <div className="rounded-2xl shadow-xl overflow-hidden bg-white p-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="w-full h-auto">
                {/* Background elements */}
                <defs>
                  <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f0f4ff" />
                    <stop offset="100%" stopColor="#e6eeff" />
                  </linearGradient>
                  <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4169e1" />
                    <stop offset="100%" stopColor="#3257c5" />
                  </linearGradient>
                </defs>
                
                {/* Background shape */}
                <rect x="0" y="0" width="800" height="600" fill="url(#bg-gradient)" rx="20" ry="20" />
                
                {/* Decorative circles */}
                <circle cx="700" cy="100" r="60" fill="#f0f4ff" opacity="0.6" />
                <circle cx="650" cy="180" r="40" fill="#e6eeff" opacity="0.7" />
                <circle cx="730" cy="220" r="25" fill="#f0f4ff" opacity="0.5" />
                
                {/* Student figure with laptop */}
                <g transform="translate(150, 180)">
                  {/* Laptop */}
                  <rect x="70" y="130" width="180" height="120" rx="10" ry="10" fill="#3257c5" />
                  <rect x="80" y="140" width="160" height="100" fill="#f0f4ff" />
                  <rect x="60" y="250" width="200" height="15" rx="7" ry="7" fill="#2a4bab" />
                  
                  {/* Student - simplified figure */}
                  <circle cx="160" cy="90" r="40" fill="#4169e1" /> {/* Head */}
                  <path d="M160 130 L160 230 Q180 240, 200 230 L200 190 Q180 200, 160 190 Z" fill="#4169e1" /> {/* Body */}
                  <path d="M160 130 L120 190 L130 195 L160 150 Z" fill="#4169e1" /> {/* Arm */}
                </g>
                
                {/* Digital elements */}
                {/* Chat bubbles */}
                <g transform="translate(450, 150)">
                  <rect x="0" y="0" width="200" height="80" rx="20" ry="20" fill="url(#accent-gradient)" />
                  <rect x="20" y="100" width="180" height="60" rx="20" ry="20" fill="#f0f4ff" stroke="#4169e1" strokeWidth="2" />
                  <rect x="40" y="180" width="160" height="70" rx="20" ry="20" fill="#f0f4ff" stroke="#4169e1" strokeWidth="2" />
                  
                  {/* Message content lines */}
                  <line x1="30" y1="25" x2="170" y2="25" stroke="white" strokeWidth="3" />
                  <line x1="30" y1="45" x2="140" y2="45" stroke="white" strokeWidth="3" />
                  <line x1="30" y1="65" x2="120" y2="65" stroke="white" strokeWidth="3" />
                  
                  <line x1="40" y1="125" x2="180" y2="125" stroke="#4169e1" strokeWidth="2" opacity="0.7" />
                  <line x1="40" y1="145" x2="150" y2="145" stroke="#4169e1" strokeWidth="2" opacity="0.7" />
                  
                  <line x1="60" y1="205" x2="180" y2="205" stroke="#4169e1" strokeWidth="2" opacity="0.7" />
                  <line x1="60" y1="225" x2="170" y2="225" stroke="#4169e1" strokeWidth="2" opacity="0.7" />
                  <line x1="60" y1="245" x2="130" y2="245" stroke="#4169e1" strokeWidth="2" opacity="0.7" />
                </g>
                
                {/* Books and study elements */}
                <g transform="translate(100, 400)">
                  {/* Stack of books */}
                  <rect x="0" y="0" width="140" height="30" rx="5" ry="5" fill="#3257c5" />
                  <rect x="10" y="-20" width="130" height="25" rx="5" ry="5" fill="#4169e1" />
                  <rect x="5" y="-40" width="120" height="25" rx="5" ry="5" fill="#5a7ce9" />
                  
                  {/* Graduation cap */}
                  <rect x="170" y="-20" width="80" height="10" fill="#2a4bab" />
                  <polygon points="210,0 180,-40 240,-40 210,0" fill="#2a4bab" />
                  <circle cx="210" cy="-20" r="8" fill="#f0f4ff" />
                </g>
                
                {/* AI/Tech symbols */}
                <g transform="translate(550, 400)">
                  {/* Circuit-like pattern */}
                  <line x1="0" y1="0" x2="50" y2="0" stroke="#4169e1" strokeWidth="3" />
                  <line x1="50" y1="0" x2="50" y2="50" stroke="#4169e1" strokeWidth="3" />
                  <line x1="50" y1="50" x2="100" y2="50" stroke="#4169e1" strokeWidth="3" />
                  <line x1="100" y1="50" x2="100" y2="0" stroke="#4169e1" strokeWidth="3" />
                  <line x1="100" y1="0" x2="150" y2="0" stroke="#4169e1" strokeWidth="3" />
                  
                  <circle cx="50" cy="0" r="8" fill="#3257c5" />
                  <circle cx="50" cy="50" r="8" fill="#3257c5" />
                  <circle cx="100" cy="50" r="8" fill="#3257c5" />
                  <circle cx="100" cy="0" r="8" fill="#3257c5" />
                </g>
                
                {/* Floating icons */}
                {/* Chat icon */}
                <g transform="translate(430, 80)">
                  <rect x="0" y="0" width="40" height="40" rx="10" ry="10" fill="#4169e1" />
                  <path d="M8 15 H32 M8 25 H25" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </g>
                
                {/* Document icon */}
                <g transform="translate(320, 400)">
                  <path d="M0 0 H30 V40 H0 Z" fill="white" stroke="#4169e1" strokeWidth="2" />
                  <line x1="5" y1="10" x2="25" y2="10" stroke="#4169e1" strokeWidth="2" />
                  <line x1="5" y1="20" x2="25" y2="20" stroke="#4169e1" strokeWidth="2" />
                  <line x1="5" y1="30" x2="15" y2="30" stroke="#4169e1" strokeWidth="2" />
                </g>
                
                {/* Lightbulb icon */}
                <g transform="translate(490, 330)">
                  <circle cx="15" cy="15" r="15" fill="#ffcc00" opacity="0.9" />
                  <path d="M15 25 L15 35 M10 35 H20" stroke="#4169e1" strokeWidth="2" />
                </g>
                
                {/* Subtle connection lines */}
                <g opacity="0.3">
                  <path d="M200 250 C 300 280, 400 260, 450 230" stroke="#4169e1" strokeWidth="2" fill="none" />
                  <path d="M250 400 C 300 350, 380 330, 430 350" stroke="#4169e1" strokeWidth="2" fill="none" />
                  <path d="M380 150 C 400 200, 420 220, 450 150" stroke="#4169e1" strokeWidth="2" fill="none" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900">Ready to transform your academic experience?</h3>
          <p className="mt-4 text-xl text-gray-600">Join thousands of students who are already benefiting from our platform.</p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/student-login" className="px-8 py-4 rounded-full text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg shadow-md transition-all duration-300">
              Sign Up Now
            </Link>
            <Link href="/learn-more" className="px-8 py-4 rounded-full text-base font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-300">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Platform</h4>
              <ul className="space-y-2">
                <FooterLink href="/features">Features</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/careers">Careers</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <FooterLink href="/blog">Blog</FooterLink>
                <FooterLink href="/guides">Guides</FooterLink>
                <FooterLink href="/webinars">Webinars</FooterLink>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink href="/cookies">Cookie Policy</FooterLink>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Student Assistance & Guidance Engine. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <SocialIcon href="#" aria="Facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </SocialIcon>
              <SocialIcon href="#" aria="Twitter">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </SocialIcon>
              <SocialIcon href="#" aria="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </SocialIcon>
              <SocialIcon href="#" aria="LinkedIn">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </SocialIcon>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature component with enhanced design
function Feature({ icon, title, description }) {
  return (
    <div className="flex items-start p-4 rounded-xl hover:bg-blue-50 transition-colors duration-300">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
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

// Statistics item
function StatItem({ number, label }) {
  return (
    <div>
      <p className="text-4xl font-bold text-white">{number}</p>
      <p className="mt-2 text-blue-100">{label}</p>
    </div>
  );
}

// Testimonial card
function TestimonialCard({ quote, author, role }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
      <svg width="45" height="36" className="mb-4 text-blue-400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.415.43c-2.523-.21-4.694.24-6.446 1.371C4.929 3.08 3.522 5.33 2.558 7.896c-.748 1.976-1.227 4.025-1.435 6.164A36.404 36.404 0 0 0 .629 20.5c0 2.453.174 4.897.523 6.442.523 2.383 1.483 4.34 2.87 5.873 1.39 1.531 3.12 2.298 5.203 2.298 1.39 0 2.583-.436 3.581-1.307.998-.87 1.798-1.984 2.407-3.33.61-1.37.915-2.743.915-4.134 0-1.617-.305-3.068-.915-4.373-.61-1.331-1.45-2.378-2.495-3.154-1.046-.776-2.203-1.167-3.494-1.167-.915 0-1.74.148-2.465.427-.759.277-1.389.646-1.9 1.108a193.498 193.498 0 0 1 1.246-4.785c.374-1.337.934-2.541 1.682-3.6.748-1.083 1.774-1.956 3.077-2.62 1.276-.688 2.9-1.075 4.875-1.167l-2.798-6.441zM34.934.43c-2.495-.21-4.665.24-6.446 1.371-1.947 1.307-3.315 3.584-4.117 6.812-.61 1.9-1.09 3.947-1.435 6.128-.345 2.156-.518 4.302-.518 6.442 0 2.323.203 4.62.61 6.885.407 2.265 1.3 4.155 2.669 5.686 1.37 1.506 3.106 2.265 5.204 2.265 1.418 0 2.626-.436 3.624-1.307.997-.87 1.783-1.984 2.407-3.33.61-1.37.915-2.743.915-4.134 0-1.617-.305-3.068-.915-4.373-.61-1.331-1.436-2.378-2.495-3.154-1.046-.776-2.203-1.167-3.494-1.167-.915 0-1.74.148-2.465.427-.759.277-1.39.646-1.9 1.108.407-1.421.813-2.919 1.246-4.785.374-1.337.934-2.541 1.682-3.6.748-1.083 1.774-1.956 3.077-2.62 1.276-.688 2.9-1.075 4.875-1.167L34.934.43z" />
      </svg>
      <p className="text-gray-600 mb-4">{quote}</p>
      <div>
        <p className="font-semibold text-gray-900">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
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