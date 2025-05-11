'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  const [showKnowledgeBaseModal, setShowKnowledgeBaseModal] = useState(false);
  const [isNewKnowledgeBase, setIsNewKnowledgeBase] = useState(true);
  const [knowledgeBaseForm, setKnowledgeBaseForm] = useState({
    id: '',
    name: '',
    description: ''
  });
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // If session is loaded and user is not a teacher, redirect
    if (status === 'authenticated') {
      if (session.user.role !== 'TEACHER') {
        router.push('/login');
        return;
      }
      
      // Fetch knowledge bases once session is authenticated
      fetchKnowledgeBases(session.user.id);
    } else if (status === 'unauthenticated') {
      // If not authenticated, redirect to login
      router.push('/login');
    }
  }, [session, status, router]);
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
          name: `${session.user.name}'s Knowledge Base`,
          description: `Default knowledge base for ${session.user.name}`,
          ownerId: teacherId,
          documentCount: 0,
          createdAt: new Date().toISOString()
        });
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setKnowledgeBases(teacherKnowledgeBases);
      
      // Set the current knowledge base to teacher's primary one
      const primaryKnowledgeBase = teacherKnowledgeBases.find(kb => kb.id === session.user.knowledgeBaseId) || 
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

  const openNewKnowledgeBaseModal = () => {
    setKnowledgeBaseForm({
      id: '',
      name: '',
      description: ''
    });
    setIsNewKnowledgeBase(true);
    setShowKnowledgeBaseModal(true);
  };

  const openEditKnowledgeBaseModal = (kb) => {
    setKnowledgeBaseForm({
      id: kb.id,
      name: kb.name,
      description: kb.description
    });
    setIsNewKnowledgeBase(false);
    setShowKnowledgeBaseModal(true);
  };

  const handleKnowledgeBaseFormChange = (e) => {
    const { name, value } = e.target;
    setKnowledgeBaseForm(prev => ({ ...prev, [name]: value }));
  };

  const handleKnowledgeBaseSubmit = async (e) => {
    e.preventDefault();
    
    if (!knowledgeBaseForm.name.trim()) {
      // Validation failed
      return;
    }
    
    try {
      if (isNewKnowledgeBase) {
        // Create new knowledge base
        // In a real app, this would call the API
        const newKB = {
          id: `kb_${knowledgeBaseForm.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          name: knowledgeBaseForm.name,
          description: knowledgeBaseForm.description,
          ownerId: session.user.id,
          documentCount: 0,
          createdAt: new Date().toISOString()
        };
        
        // Update state
        setKnowledgeBases(prev => [...prev, newKB]);
        setCurrentKnowledgeBase(newKB);
      } else {
        // Update existing knowledge base
        // In a real app, this would call the API
        const updatedKB = {
          ...knowledgeBases.find(kb => kb.id === knowledgeBaseForm.id),
          name: knowledgeBaseForm.name,
          description: knowledgeBaseForm.description
        };
        
        // Update state
        setKnowledgeBases(prev => 
          prev.map(kb => kb.id === updatedKB.id ? updatedKB : kb)
        );
        
        if (currentKnowledgeBase.id === updatedKB.id) {
          setCurrentKnowledgeBase(updatedKB);
        }
      }
      
      // Close modal
      setShowKnowledgeBaseModal(false);
    } catch (error) {
      console.error('Error saving knowledge base:', error);
    }
  };

  const handleDeleteKnowledgeBase = (kbId) => {
    // In a real app, this would call the API
    
    // Only allow deletion if teacher has more than one knowledge base
    if (knowledgeBases.length <= 1) {
      alert('You need at least one knowledge base.');
      return;
    }
    
    // Update state
    const newKBList = knowledgeBases.filter(kb => kb.id !== kbId);
    setKnowledgeBases(newKBList);
    
    // If the current KB was deleted, select the first one
    if (currentKnowledgeBase.id === kbId) {
      setCurrentKnowledgeBase(newKBList[0]);
      fetchKnowledgeBaseArticles(newKBList[0].id);
    }
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
        <div className="mt-4 md:mt-0 flex space-x-3">
          {/* New button for creating a knowledge base */}
          <button
            onClick={openNewKnowledgeBaseModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            New Knowledge Base
          </button>
          {/* New Article button */}
          <Link
            href="/teacher/knowledge-base/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Article
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
                value={currentKnowledgeBase?.id || ''}
                onChange={(e) => handleKnowledgeBaseChange(e.target.value)}
              >
                {knowledgeBases.map(kb => (
                  <option key={kb.id} value={kb.id}>{kb.name}</option>
                ))}
              </select>
              
              {/* Edit knowledge base button */}
              <button
                onClick={() => openEditKnowledgeBaseModal(currentKnowledgeBase)}
                className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                title="Edit knowledge base"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              
              {/* Delete knowledge base button */}
              {knowledgeBases.length > 1 && (
                <button
                  onClick={() => handleDeleteKnowledgeBase(currentKnowledgeBase.id)}
                  className="inline-flex items-center p-1.5 border border-gray-300 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Delete knowledge base"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
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
          
          {/* Knowledge base description */}
          {currentKnowledgeBase?.description && (
            <div className="mt-2 text-sm text-gray-500">
              {currentKnowledgeBase.description}
            </div>
          )}
          
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
                                <a 
                                  href={`/teacher/knowledge-base/${article.id}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  {article.name}
                                </a>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{article.category}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{article.views}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                {new Date(article.createdAt).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                <div className="flex justify-end space-x-2">
                                  <a
                                    href={`/teacher/knowledge-base/${article.id}`}
                                    className="text-indigo-600 hover:text-indigo-900"
                                  >
                                    View
                                  </a>
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

      {/* Knowledge Base Modal */}
      {showKnowledgeBaseModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-medium mb-4">
              {isNewKnowledgeBase ? 'Create New Knowledge Base' : 'Edit Knowledge Base'}
            </h2>
            
            <form onSubmit={handleKnowledgeBaseSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={knowledgeBaseForm.name}
                    onChange={handleKnowledgeBaseFormChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={knowledgeBaseForm.description}
                    onChange={handleKnowledgeBaseFormChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowKnowledgeBaseModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {isNewKnowledgeBase ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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

function InformationCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}