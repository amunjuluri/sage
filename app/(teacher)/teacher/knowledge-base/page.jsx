// app/(teacher)/teacher/knowledge-base/page.jsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KnowledgeBaseManager from '@/app/components/knowledge-base/KnowledgeBaseManager';

export default function TeacherKnowledgeBasePage() {
  const [teacher, setTeacher] = useState(null);
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
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base Management</h1>
        <p className="mt-2 text-gray-600">
          Create and manage your knowledge base to provide students with better assistance.
          This knowledge base will be used when students request callbacks from you.
        </p>
      </div>
      
      {/* Main Content */}
      <KnowledgeBaseManager />
      
      {/* Information Section */}
      <div className="mt-8 bg-indigo-50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-indigo-800">About Knowledge Bases</h3>
            <p className="mt-1 text-sm text-indigo-600">
              Your knowledge base is used by the AI assistant during student callback requests. It helps the AI provide accurate, personalized responses based on your expertise and preferences.
            </p>
            <p className="mt-2 text-sm text-indigo-600">
              <strong>Tips for creating an effective knowledge base:</strong>
            </p>
            <ul className="mt-1 text-sm text-indigo-600 list-disc list-inside space-y-1">
              <li>Include frequently asked questions and their answers</li>
              <li>Add information about your course materials, assignments, and expectations</li>
              <li>Add details about your teaching style and preferred communication methods</li>
              <li>Include links to resources you commonly recommend to students</li>
              <li>Keep content organized with clear sections and headings</li>
            </ul>
            <p className="mt-2 text-sm text-indigo-600">
              You can create multiple knowledge bases, but only the "Primary" one will be used for callbacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Information icon component
function InformationCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}