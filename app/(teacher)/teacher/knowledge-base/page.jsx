'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  getKnowledgeBases, 
  getKnowledgeBaseDocuments, 
  queryKnowledgeBase 
} from '@/lib/services/blandAIService';
import { knowledgeBases } from '@/lib/data/mockData';
      

export default function TeacherKnowledgeBase() {
  const [teacher, setTeacher] = useState(null);
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' or 'search'
  const [currentKnowledgeBase, setCurrentKnowledgeBase] = useState(null);
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
    
    // Fetch knowledge bases
    fetchKnowledgeBases(teacherData.id);
  }, [router]);

  const fetchKnowledgeBases = async (teacherId) => {
    setIsLoading(true);
    try {
      // In a real app, this would call the API to get knowledge bases from Bland AI
      // const response = await getTeacherKnowledgeBases(teacherId);
      
      // Import the mock data
  
      // For now, use mock data - filter to only show this teacher's knowledge base
      const teacherKnowledgeBases = knowledgeBases.filter(kb => kb.ownerId === teacherId);
      
      // If teacher has no knowledge bases yet, create a default one
      if (teacherKnowledgeBases.length === 0) {
        // This would normally call createTeacherKnowledgeBase
        teacherKnowledgeBases.push({
          id: `kb_${teacherId}_default`,
          name: `${teacher.name}'s Knowledge Base`,
          description: `Default knowledge base for ${teacher.name}`,
          ownerId: teacherId,
          documentCount: 0,
          createdAt: new Date().toISOString()
        });
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setKnowledgeBases(teacherKnowledgeBases);
      
      // Set the current knowledge base to teacher's primary one
      const primaryKnowledgeBase = teacherKnowledgeBases.find(kb => kb.id === teacher.knowledgeBaseId) || 
                                 teacherKnowledgeBases[0];
      
      setCurrentKnowledgeBase(primaryKnowledgeBase);
      
      // Get articles for the primary knowledge base
      await fetchKnowledgeBaseArticles(primaryKnowledgeBase.id);
    } catch (error) {
      console.error('Error fetching knowledge bases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const [articles, setArticles] = useState([]);

  const fetchKnowledgeBaseArticles = async (knowledgeBaseId) => {
    setIsLoading(true);
    try {
      // In a real app, this would call the API to get documents from Bland AI
      // const response = await getKnowledgeBaseDocuments(knowledgeBaseId);
      
      // For now, use mock data
      const mockArticles = [
        {
          id: "doc1",
          name: "Course Registration Process",
          createdAt: "2025-01-10T10:30:00Z",
          size: 145320,
          type: "text/markdown",
          category: "Administrative",
          views: 256
        },
        {
          id: "doc2",
          name: "Understanding Recursive Functions",
          createdAt: "2025-01-15T14:30:00Z",
          size: 98452,
          type: "text/markdown",
          category: "Computer Science",
          views: 183
        },
        {
          id: "doc3",
          name: "Data Structures Overview",
          createdAt: "2025-01-20T09:15:00Z",
          size: 120845,
          type: "text/markdown",
          category: "Computer Science",
          views: 142
        },
        {
          id: "doc4",
          name: "Finals Week Guidelines",
          createdAt: "2025-01-25T16:45:00Z",
          size: 76321,
          type: "text/markdown",
          category: "Administrative",
          views: 321
        },
        {
          id: "doc5",
          name: "API Integration Guide",
          createdAt: "2025-02-01T11:20:00Z",
          size: 154782,
          type: "text/markdown",
          category: "Computer Science",
          views: 98
        }
      ];
      
      // Find the knowledge base
      const kb = knowledgeBases.find(kb => kb.id === knowledgeBaseId) || {
        id: knowledgeBaseId,
        name: "University Knowledge Base"
      };
      
      // Update current knowledge base
      setCurrentKnowledgeBase(kb);
      
      // Filter articles based on knowledge base
      let filteredArticles = [...mockArticles];
      
      if (knowledgeBaseId === "cs101") {
        filteredArticles = mockArticles.filter(article => 
          article.category === "Computer Science" && 
          !article.name.includes("Algorithms")
        );
      } else if (knowledgeBaseId === "algorithms") {
        filteredArticles = mockArticles.filter(article => 
          article.category === "Computer Science" && 
          (article.name.includes("Algorithms") || article.name.includes("Data Structure"))
        );
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setArticles(filteredArticles);
    } catch (error) {
      console.error('Error fetching knowledge base articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKnowledgeBaseChange = (knowledgeBaseId) => {
    fetchKnowledgeBaseArticles(knowledgeBaseId);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setActiveTab('search');
    
    try {
      // In a real app, this would call the API to search the knowledge base using Bland AI
      // const response = await queryKnowledgeBase(currentKnowledgeBase.id, searchQuery);
      
      // For now, use mock data
      const mockResults = {
        query: searchQuery,
        results: articles
          .filter(article => 
            article.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(article => ({
            id: article.id,
            title: article.name,
            excerpt: `This is a snippet from the article "${article.name}" that matches your search query for "${searchQuery}". In a real implementation, this would contain actual content from the document.`,
            documentId: article.id,
            score: 0.85 + Math.random() * 0.1
          }))
          .sort((a, b) => b.score - a.score)
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Error searching knowledge base:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteArticle = (articleId) => {
    // In a real app, this would call the API to delete the article
    console.log(`Deleting article with ID: ${articleId}`);
    
    // For now, just update the UI
    setArticles(prev => prev.filter(article => article.id !== articleId));
  };

  if (isLoading && !articles.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Base Management</h1>
        <div className="mt-4 md:mt-0">
          <Link 
            href="/teacher/knowledge-base/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Article
          </Link>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <label htmlFor="knowledge-base" className="text-sm font-medium text-gray-700">
                Knowledge Base:
              </label>
              <select
                id="knowledge-base"
                className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={currentKnowledgeBase.id}
                onChange={(e) => handleKnowledgeBaseChange(e.target.value)}
              >
                {knowledgeBases.map(kb => (
                  <option key={kb.id} value={kb.id}>{kb.name}</option>
                ))}
              </select>
            </div>
            
            <form onSubmit={handleSearch} className="mt-4 sm:mt-0 flex">
              <input
                type="text"
                placeholder="Search knowledge base..."
                className="block rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700"
                disabled={isSearching}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
          
          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  className={`${
                    activeTab === 'articles'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('articles')}
                >
                  Articles
                </button>
                <button
                  className={`${
                    activeTab === 'search'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('search')}
                  disabled={!searchResults}
                >
                  Search Results
                </button>
              </nav>
            </div>
            
            <div className="mt-6">
              {activeTab === 'articles' ? (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    {currentKnowledgeBase.name} Articles ({articles.length})
                  </h2>
                  
                  {articles.length > 0 ? (
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Views</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {articles.map((article) => (
                            <tr key={article.id}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                {article.name}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {article.category}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {article.views}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(article.createdAt).toLocaleDateString()}
                              </td>
                              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end space-x-2">
                                  <Link
                                    href={`/teacher/knowledge-base/${article.id}`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    View
                                  </Link>
                                  <Link
                                    href={`/teacher/knowledge-base/${article.id}/edit`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteArticle(article.id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new article.</p>
                      <div className="mt-6">
                        <Link
                          href="/teacher/knowledge-base/new"
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <PlusIcon className="h-5 w-5 mr-2" />
                          New Article
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Search Results {searchResults ? `(${searchResults.results.length})` : ''}
                  </h2>
                  
                  {isSearching ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : searchResults && searchResults.results.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {searchResults.results.map((result) => (
                        <li key={result.id} className="py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-indigo-600">{result.title}</h3>
                              <span className="text-xs text-gray-500">Score: {result.score.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-gray-600">{result.excerpt}</p>
                            <div className="mt-2">
                              <Link
                                href={`/teacher/knowledge-base/${result.documentId}`}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                View article
                              </Link>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : searchResults ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No results found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Search for articles in the knowledge base</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
         {/* Bland AI Integration Info */}
         <div className="mt-6 bg-indigo-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-indigo-800">Knowledge Base Integration with Bland AI</h3>
            <p className="mt-1 text-sm text-indigo-600">
              This knowledge base is powered by Bland AI vector database technology. Articles you add here will be vectorized and used to provide accurate responses to student queries through both the chat interface and voice calls.
            </p>
            <p className="mt-2 text-sm text-indigo-600">
              <strong>Teacher-specific knowledge base:</strong> When students request callbacks with you, the Bland AI system will use this specific knowledge base to provide tailored responses based on your expertise and the content you've added here.
            </p>
            <div className="mt-3">
              <a 
                href="https://www.bland.ai/knowledge-base" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                Learn more about Bland AI knowledge base integration
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function DocumentIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

function InformationCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}