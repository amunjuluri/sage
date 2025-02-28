'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [pendingCallbacks, setPendingCallbacks] = useState([]);
  const [recentKnowledgeBase, setRecentKnowledgeBase] = useState([]);
  const [studentEngagement, setStudentEngagement] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get teacher info from session storage
    const storedTeacher = sessionStorage.getItem('teacher');
    if (!storedTeacher) {
      router.push('/teacher-login');
      return;
    }
    
    const teacherData = JSON.parse(storedTeacher);
    setTeacher(teacherData);
    
    // Fetch data
    fetchDashboardData(teacherData.id);
  }, [router]);

  const fetchDashboardData = async (teacherId) => {
    setIsLoading(true);
    try {
      // Mock API calls for demonstration purposes
      // In a real app, these would be actual API calls
      
      // Fetch pending callback requests
      const callbacksData = await fetchMockCallbacks(teacherId);
      setPendingCallbacks(callbacksData);
      
      // Fetch recent knowledge base articles
      const knowledgeBaseData = await fetchMockKnowledgeBase(teacherId);
      setRecentKnowledgeBase(knowledgeBaseData);
      
      // Fetch student engagement data
      const engagementData = await fetchMockStudentEngagement(teacherId);
      setStudentEngagement(engagementData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock API functions that would be replaced with real API calls in production
  const fetchMockCallbacks = async (teacherId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data
    return [
      {
        id: "cr1",
        studentId: "s1",
        studentName: "Alex Johnson",
        subject: "Help with Assignment 3",
        message: "I'm struggling with the recursion section of assignment 3. Could you help me understand it better?",
        requestedDate: "2025-02-25T14:30:00",
        status: "pending"
      },
      {
        id: "cr3",
        studentId: "s3",
        studentName: "Taylor Wong",
        subject: "Question about Quantum Mechanics",
        message: "I'm having trouble understanding the Schrödinger equation. Could you explain it in simpler terms?",
        requestedDate: "2025-02-27T11:15:00",
        status: "pending"
      }
    ];
  };

  const fetchMockKnowledgeBase = async (teacherId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // Mock data
    return [
      {
        id: "kb1",
        title: "Understanding Recursion in Programming",
        category: "Computer Science",
        views: 156,
        createdAt: "2025-02-15T10:30:00"
      },
      {
        id: "kb3",
        title: "Common Mistakes in Data Structures Implementation",
        category: "Computer Science",
        views: 89,
        createdAt: "2025-02-20T15:45:00"
      }
    ];
  };

  const fetchMockStudentEngagement = async (teacherId) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Mock data
    return [
      {
        id: "s1",
        name: "Alex Johnson",
        course: "Computer Science",
        year: 2,
        lastActive: "2025-02-27T09:15:00",
        callbacksRequested: 3,
        questionsAsked: 12
      },
      {
        id: "s3",
        name: "Taylor Wong",
        course: "Physics",
        year: 1,
        lastActive: "2025-02-28T10:30:00",
        callbacksRequested: 2,
        questionsAsked: 8
      },
      {
        id: "s2",
        name: "Jamie Smith",
        course: "Mathematics",
        year: 3,
        lastActive: "2025-02-26T14:45:00",
        callbacksRequested: 1,
        questionsAsked: 5
      }
    ];
  };

  const handleScheduleCall = (callbackId) => {
    // In a real app, this would call an API
    console.log(`Scheduling call for callback ID: ${callbackId}`);
    
    // Update UI to show scheduled
    setPendingCallbacks(prev => 
      prev.map(callback => 
        callback.id === callbackId 
          ? { ...callback, status: 'scheduled' } 
          : callback
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {teacher?.name}</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Pending Callbacks"
          value={pendingCallbacks.length}
          icon={<PhoneIcon />}
          change={"+2 from yesterday"}
          trend="up"
          linkText="View all callbacks"
          linkHref="/teacher/callback-requests"
          bgColor="bg-indigo-600"
        />
        <StatCard
          title="Knowledge Base Articles"
          value={recentKnowledgeBase.length}
          icon={<DocumentIcon />}
          change={"245 total views"}
          trend="neutral"
          linkText="Manage knowledge base"
          linkHref="/teacher/knowledge-base"
          bgColor="bg-green-600"
        />
        <StatCard
          title="Active Students"
          value={studentEngagement.length}
          icon={<UserGroupIcon />}
          change={"+1 since last week"}
          trend="up"
          linkText="View student insights"
          linkHref="/teacher/insights"
          bgColor="bg-purple-600"
        />
      </div>
      
      {/* Pending Callbacks Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Pending Callback Requests</h2>
          <Link 
            href="/teacher/callback-requests"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        
        <div className="px-4 py-3 sm:px-6">
          {pendingCallbacks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingCallbacks.map((callback) => (
                    <tr key={callback.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{callback.studentName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{callback.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(callback.requestedDate).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          callback.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : callback.status === 'scheduled'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {callback.status.charAt(0).toUpperCase() + callback.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {callback.status === 'pending' ? (
                          <button 
                            onClick={() => handleScheduleCall(callback.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Schedule
                          </button>
                        ) : (
                          <span className="text-gray-400">Scheduled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">No pending callback requests.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Knowledge Base & Student Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Knowledge Base Articles */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Recent Knowledge Base Articles</h2>
            <Link 
              href="/teacher/knowledge-base"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Manage
            </Link>
          </div>
          
          <div className="px-4 py-3 sm:px-6">
            {recentKnowledgeBase.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentKnowledgeBase.map((article) => (
                  <li key={article.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{article.title}</h3>
                        <p className="text-sm text-gray-500">
                          {article.category} • {article.views} views
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-500">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-500">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No knowledge base articles yet.</p>
                <Link 
                  href="/teacher/knowledge-base/new" 
                  className="mt-2 inline-block text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Create your first article
                </Link>
              </div>
            )}
            
            <div className="mt-4">
              <Link
                href="/teacher/knowledge-base/new"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add New Article
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Student Activity */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Student Engagement</h2>
          </div>
          
          <div className="px-4 py-3 sm:px-6">
            {studentEngagement.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {studentEngagement.map((student) => (
                  <li key={student.id} className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-medium">{student.name}</h3>
                        <p className="text-sm text-gray-500">
                          {student.course}, Year {student.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{student.callbacksRequested} callbacks</p>
                        <p className="text-sm text-gray-500">{student.questionsAsked} questions</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No student activity yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-8 bg-indigo-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-indigo-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title="Schedule Office Hours"
            description="Set up your availability for student callbacks"
            icon={<CalendarIcon className="h-6 w-6" />}
            href="/teacher/schedule"
          />
          <QuickActionCard
            title="Add to Knowledge Base"
            description="Create content to help answer common questions"
            icon={<DocumentPlusIcon className="h-6 w-6" />}
            href="/teacher/knowledge-base/new"
          />
          <QuickActionCard
            title="View Analytics"
            description="See how students are engaging with your content"
            icon={<ChartBarIcon className="h-6 w-6" />}
            href="/teacher/insights"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, change, trend, linkText, linkHref, bgColor }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 text-white ${bgColor}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                trend === 'up' 
                  ? 'text-green-600' 
                  : trend === 'down' 
                  ? 'text-red-600'
                  : 'text-gray-500'
              }`}>
                {trend === 'up' && (
                  <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                )}
                {trend === 'down' && (
                  <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                )}
                <span className="sr-only">
                  {trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'} by
                </span>
                {change}
              </div>
            </dd>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref} className="font-medium text-indigo-600 hover:text-indigo-500">
            {linkText} <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, icon, href }) {
  return (
    <Link 
      href={href}
      className="bg-white rounded-lg shadow-sm border border-indigo-100 p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 text-indigo-500">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}

// Icons
function PhoneIcon() {
  return (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function UserGroupIcon() {
  return (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function ArrowUpIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

function ArrowDownIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  );
}

function PencilIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function TrashIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DocumentPlusIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function ChartBarIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}