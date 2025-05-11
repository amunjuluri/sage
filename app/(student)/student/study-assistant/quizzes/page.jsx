'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StudyAssistant() {
  const [student, setStudent] = useState(null);
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    // Get student info from session storage
    const storedStudent = sessionStorage.getItem('student');
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
    
    // Initialize empty recent items
    // In a real app, these would come from a database
    setRecentItems([]);
  }, []);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Study Assistant</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StudyCard
          title="Flashcards"
          description="Interactive flashcards to help you memorize key concepts and definitions."
          icon={<DocumentTextIcon />}
          linkText="View Flashcards"
          linkHref="/student/study-assistant/flashcards"
          bgColor="bg-purple-600"
        />
        <StudyCard
          title="Summaries"
          description="Study summaries of your course materials, textbooks, or lecture notes."
          icon={<DocumentIcon />}
          linkText="View Summaries"
          linkHref="/student/study-assistant/summaries"
          bgColor="bg-indigo-600"
        />
        <StudyCard
          title="Quizzes"
          description="Practice quizzes to test your knowledge and reinforce your learning."
          icon={<ClipboardCheckIcon />}
          linkText="View Quizzes"
          linkHref="/student/study-assistant/quizzes"
          bgColor="bg-blue-600"
        />
      </div>
      
      {recentItems.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Study Materials</h2>
          </div>
          <div className="px-4 sm:px-6 py-4">
            <ul className="divide-y divide-gray-200">
              {recentItems.map((item) => (
                <li key={item.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Created {new Date(item.createdAt).toLocaleDateString()}
                          {item.type === 'flashcards' && ` • ${item.count} cards`}
                          {item.type === 'summary' && ` • ${item.wordCount} words`}
                          {item.type === 'quiz' && ` • ${item.questionCount} questions`}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Link 
                        href={`/student/study-assistant/${item.type}/${item.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-900 mb-2">Study Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2">Effective Flashcard Use</h3>
            <p className="text-sm text-gray-600">
              Create flashcards with concise information. Review regularly with spaced repetition, testing yourself in both directions for better retention.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2">Active Recall Practice</h3>
            <p className="text-sm text-gray-600">
              Instead of re-reading, test yourself with quizzes. This engages your brain more effectively and strengthens neural pathways for better memory.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2">Summarizing Effectively</h3>
            <p className="text-sm text-gray-600">
              When reviewing summaries, try to expand on key points mentally. This helps connect concepts and deepen understanding beyond surface-level recall.
            </p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-medium text-gray-900 mb-2">Study Schedule</h3>
            <p className="text-sm text-gray-600">
              Establish a consistent study schedule with short, focused sessions. Include breaks and vary subjects to maintain engagement and prevent burnout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudyCard({ title, description, icon, linkText, linkHref, bgColor }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 text-white ${bgColor}`}>
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
function getTypeColor(type) {
  switch (type) {
    case 'flashcards':
      return 'bg-purple-600 text-white';
    case 'summary':
      return 'bg-indigo-600 text-white';
    case 'quiz':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
}

function getTypeIcon(type) {
  switch (type) {
    case 'flashcards':
      return <DocumentTextIcon className="h-5 w-5" />;
    case 'summary':
      return <DocumentIcon className="h-5 w-5" />;
    case 'quiz':
      return <ClipboardCheckIcon className="h-5 w-5" />;
    default:
      return null;
  }
}

// Icons
function DocumentTextIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function ClipboardCheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );
}