import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Student Assistance & Guidance Engine</h1>
          <div className="space-x-4">
            <Link href="/student-login" className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50">
              Student Login
            </Link>
            <Link href="/teacher-login" className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
              Teacher Login
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Get the university support you deserve
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              AI-powered assistance, faculty knowledge, and personalized help—all in one platform.
            </p>
            <div className="mt-8 space-y-6">
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
            <div className="mt-10">
              <Link href="/student-login" className="px-8 py-3 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700 inline-block">
                Get Started
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://via.placeholder.com/600x400?text=Student+Support+Illustration" 
              alt="Student support illustration" 
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Student Assistance & Guidance Engine. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Feature component
function Feature({ icon, title, description }) {
  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
          {icon}
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-500">{description}</p>
      </div>
    </div>
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