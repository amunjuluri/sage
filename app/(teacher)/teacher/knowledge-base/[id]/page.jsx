'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { knowledgeBase, teachers } from '@/lib/data/mockData';

export default function ArticleViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated' || !session?.user || session.user.role !== 'TEACHER') {
      router.push('/login');
      return;
    }
    
    // Find the article in mock data
    const found = knowledgeBase.find(article => article.id === id);
    setArticle(found);
    setIsLoading(false);
  }, [id, session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
        <p className="text-gray-600">The requested article does not exist.</p>
        <button
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          onClick={() => router.push('/teacher/knowledge-base')}
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
    <div className="max-w-4xl mx-auto mt-8">
      <div className="mb-6">
        <button
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50"
          onClick={() => router.push('/teacher/knowledge-base')}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back to Knowledge Base
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
          <div className="flex space-x-3">
            <button
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md bg-white hover:bg-gray-50"
              onClick={() => router.push(`/teacher/knowledge-base/${id}/edit`)}
            >
              <PencilIcon className="h-4 w-4 mr-1" /> Edit
            </button>
          </div>
        </div>
        
        <div className="px-6 py-5">
          <div className="mb-4 flex items-center space-x-4 text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {article.category}
            </span>
            <span>
              Created: {new Date(article.createdAt).toLocaleDateString()}
            </span>
            <span>
              Views: {article.views}
            </span>
          </div>
          
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

function PencilIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
} 