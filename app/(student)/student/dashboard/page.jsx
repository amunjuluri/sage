'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStudentCallbackRequests, knowledgeBase } from '../../../../lib/data/mockData';

export default function StudentDashboard() {
  const [callbackRequests, setCallbackRequests] = useState([]);
  const [recentKnowledgeArticles, setRecentKnowledgeArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Only fetch data when session is loaded and student is authenticated
    if (status === 'authenticated' && session.user && session.user.role === 'STUDENT') {
      fetchDashboardData(session.user.studentId);
    } else if (status === 'unauthenticated') {
      // If user is not authenticated, redirect to login
      router.push('/student-login');
    }
  }, [session, status, router]);

  const fetchDashboardData = async (studentId) => {
    setIsLoading(true);
    try {
      // Get callback requests for this student
      const requests = getStudentCallbackRequests(studentId);
      setCallbackRequests(requests);
      
      // Get recent knowledge base articles
      const sortedArticles = [...knowledgeBase].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setRecentKnowledgeArticles(sortedArticles.slice(0, 3));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, this will be caught in the useEffect
  if (status === 'unauthenticated') {
    return null; // Don't render anything while redirecting
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {session.user.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        <DashboardCard
          title="Request Callback"
          description="Schedule a call with a professor for personalized guidance and support."
          icon={<PhoneIcon />}
          linkText="Request a call"
          linkHref="/student/request-callback"
        />
        <DashboardCard
          title="Study Assistant"
          description="Generate flashcards, summaries, and quizzes to enhance your learning."
          icon={<BookIcon />}
          linkText="Get study help"
          linkHref="/student/study-assistant"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Callback requests section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Your Callback Requests</h2>
            <Link href="/student/request-callback" className="text-sm text-blue-600 hover:text-blue-500">
              View all
            </Link>
          </div>
          <div className="px-4 sm:px-6 py-4">
            {callbackRequests.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {callbackRequests.map((request) => (
                  <li key={request.id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.subject}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Requested: {new Date(request.requestedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${getStatusColor(request.status)}
                      `}>
                        {capitalizeFirstLetter(request.status)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm py-4">You have no callback requests.</p>
            )}
            
            <div className="mt-4">
              <Link 
                href="/student/request-callback" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                New Request
              </Link>
            </div>
          </div>
        </div>
        
        {/* Knowledge base section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Latest Knowledge Articles</h2>
            <Link href="/student/knowledge-base" className="text-sm text-blue-600 hover:text-blue-500">
              Browse all
            </Link>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <ul className="divide-y divide-gray-200">
              {recentKnowledgeArticles.map((article) => (
                <li key={article.id} className="py-4">
                  <Link href={`/student/knowledge-base/${article.id}`} className="block hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">{article.title}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Category: {article.category}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, description, icon, linkText, linkHref }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-50 rounded-md p-3 text-blue-600">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-lg font-medium text-gray-900 truncate">
              {title}
            </dt>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref} className="font-medium text-blue-600 hover:text-blue-500">
            {linkText} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusColor(status) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'scheduled':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function PhoneIcon() {
  return (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}