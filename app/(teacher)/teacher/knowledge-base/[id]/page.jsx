'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { knowledgeBases } from '@/lib/data/mockData';

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
    // Simulate fetching article from mock data
    // In a real app, fetch from API
    let found = null;
    for (const kb of knowledgeBases) {
      if (kb.documents) {
        found = kb.documents.find(doc => doc.id === id);
        if (found) break;
      }
    }
    // Fallback: try to find in a flat mockArticles array if available
    if (!found && typeof window !== 'undefined') {
      // Optionally, you can import or define mockArticles here
    }
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
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-2">{article.name || article.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        Category: {article.category} | Created: {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}
      </div>
      <div className="prose prose-indigo">
        {/* In a real app, render markdown. For now, just show content or excerpt. */}
        <p>{article.content || article.excerpt || 'No content available.'}</p>
      </div>
      <button
        className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        onClick={() => router.push('/teacher/knowledge-base')}
      >
        Back to Knowledge Base
      </button>
    </div>
  );
} 