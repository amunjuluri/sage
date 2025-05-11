'use client';

import { useState, useEffect } from 'react';
import { knowledgeBase, knowledgeBases, teachers } from '@/lib/data/mockData';

export default function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [availableKnowledgeBases, setAvailableKnowledgeBases] = useState([]);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState('All');

  useEffect(() => {
    // Get all articles
    setArticles(knowledgeBase);
    
    // Extract unique categories
    const uniqueCategories = ['All', ...new Set(knowledgeBase.map(article => article.category))];
    setCategories(uniqueCategories);
    
    // Get all available knowledge bases
    // In a real app, you would fetch knowledge bases that the student has access to
    setAvailableKnowledgeBases([
      { id: 'All', name: 'All Knowledge Bases' },
      ...knowledgeBases
    ]);
    
    // Initial filtering
    setFilteredArticles(knowledgeBase);
  }, []);

  useEffect(() => {
    // Filter articles based on search query, category and knowledge base
    let filtered = articles;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    if (selectedKnowledgeBase !== 'All') {
      // In a real app, you would filter by knowledge base ID
      // For now, let's simulate filtering by teacher
      const kb = knowledgeBases.find(kb => kb.id === selectedKnowledgeBase);
      if (kb) {
        filtered = filtered.filter(article => article.teacherId === kb.ownerId);
      }
    }
    
    setFilteredArticles(filtered);
  }, [searchQuery, selectedCategory, selectedKnowledgeBase, articles]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleKnowledgeBaseChange = (e) => {
    setSelectedKnowledgeBase(e.target.value);
  };

  // Get teacher name for display
  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unknown Teacher';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Knowledge Base</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="sr-only">Search articles</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3"
                  placeholder="Search knowledge base..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div>
              <label htmlFor="knowledge-base" className="block text-sm font-medium text-gray-700">Knowledge Base</label>
              <select
                id="knowledge-base"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedKnowledgeBase}
                onChange={handleKnowledgeBaseChange}
              >
                {availableKnowledgeBases.map(kb => (
                  <option key={kb.id} value={kb.id}>
                    {kb.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'Article' : 'Articles'} Found
          </h2>
        </div>
        
        <div className="px-4 sm:px-6 py-4">
          {filteredArticles.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <li key={article.id} className="py-4">
                  <article className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{article.title}</h3>
                      <div className="flex space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {getTeacherName(article.teacherId)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-500 line-clamp-2">
                      {article.content.substring(0, 200)}...
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        Added {new Date(article.createdAt).toLocaleDateString()}
                      </span>
                      <a 
                        href={`/student/knowledge-base/${article.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Read more
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center">
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Knowledge Base Info */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">About Knowledge Bases</h3>
            <p className="mt-1 text-sm text-blue-600">
              Our knowledge base contains articles written by your professors to help you with common questions and topics. 
              You can filter articles by category or professor's knowledge base to find the information you need.
            </p>
            <p className="mt-2 text-sm text-blue-600">
              <strong>Can't find what you're looking for?</strong> Request a callback from a professor 
              for personalized assistance with complex topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function SearchIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function DocumentIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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