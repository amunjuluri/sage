'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { knowledgeBase, teachers } from '@/lib/data/mockData';

export default function StudentArticleViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [article, setArticle] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || !session?.user || session.user.role !== 'STUDENT') {
      router.push('/login');
      return;
    }
    
    // Find the article in mock data
    const found = knowledgeBase.find(article => article.id === id);
    setArticle(found);
    
    if (found) {
      // Find the teacher for this article
      const articleTeacher = teachers.find(t => t.id === found.teacherId);
      setTeacher(articleTeacher);
      
      // Find related articles (same category or same tags)
      const related = knowledgeBase
        .filter(a => a.id !== id && 
                   (a.category === found.category || 
                    a.tags.some(tag => found.tags.includes(tag))))
        .slice(0, 3); // Get top 3 related articles
      
      setRelatedArticles(related);
      
      // In a real app, increment view count via API
      // For now, just simulate a delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } else {
      setIsLoading(false);
    }
  }, [id, session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
        <p className="text-gray-600">The requested article does not exist or you don't have permission to view it.</p>
        <button
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push('/student/knowledge-base')}
        >
          Back to Knowledge Base
        </button>
      </div>
    );
  }

  // Format content for display - in a real app, might use markdown renderer
  const formattedContent = article.content.split('\n\n').map((paragraph, index) => (
    <p key={index} className="mb-4">{paragraph}</p>
  ));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <button
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50"
          onClick={() => router.push('/student/knowledge-base')}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Knowledge Base
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2">
              {article.category}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <div className="px-6 py-5 flex flex-col md:flex-row">
          <div className="md:w-3/4 md:pr-8">
            <div className="prose max-w-none">
              {formattedContent}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Was this article helpful?</h3>
              <div className="flex space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                  <ThumbUpIcon className="h-4 w-4 mr-1" /> Yes, it helped
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                  <ThumbDownIcon className="h-4 w-4 mr-1" /> No, need more info
                </button>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/4 mt-8 md:mt-0 border-t md:border-t-0 md:border-l border-gray-200 md:pl-8">
            {teacher && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">About the Author</h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <UserIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                    <p className="text-sm text-gray-500">{teacher.department}</p>
                    <p className="text-xs text-gray-500 mt-1">Expertise: {teacher.expertise.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
            
            {relatedArticles.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Related Articles</h3>
                <ul className="space-y-3">
                  {relatedArticles.map(related => (
                    <li key={related.id} className="bg-gray-50 rounded-md p-3">
                      <a 
                        href={`/student/knowledge-base/${related.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {related.title}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">{related.category}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-6 bg-blue-50 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-1">Have questions?</h3>
              <p className="text-sm text-blue-600">
                If you need more clarification on this topic, consider requesting a callback from your professor.
              </p>
              <button
                onClick={() => router.push('/student/request-callback')}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Request Callback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple icon components
function ArrowLeftIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}

function ThumbUpIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </svg>
  );
}

function ThumbDownIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
} 