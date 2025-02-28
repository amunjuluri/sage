'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { uploadDocumentToKnowledgeBase } from '@/lib/services/blandAIService';

export default function NewKnowledgeBaseArticle() {
  const [teacher, setTeacher] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    knowledgeBaseId: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [formErrors, setFormErrors] = useState({});
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
    fetchKnowledgeBases();
  }, [router]);

  const fetchKnowledgeBases = async () => {
    // In a real app, this would call the API to get knowledge bases from Bland AI
    
    // For now, use mock data
    const mockKnowledgeBases = [
      {
        id: "main",
        name: "University Knowledge Base",
        description: "General information about the university"
      },
      {
        id: "cs101",
        name: "Computer Science 101",
        description: "Introductory computer science topics"
      },
      {
        id: "algorithms",
        name: "Algorithms and Data Structures",
        description: "Advanced algorithms and data structures"
      }
    ];
    
    setKnowledgeBases(mockKnowledgeBases);
    
    // Set default knowledge base
    setFormData(prev => ({
      ...prev,
      knowledgeBaseId: mockKnowledgeBases[0].id
    }));
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()]
    }));
    
    setTagInput('');
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    
    if (!formData.knowledgeBaseId) {
      errors.knowledgeBaseId = 'Knowledge base is required';
    }
    
    if (!formData.content.trim() || formData.content.length < 50) {
      errors.content = 'Content is required and should be at least 50 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      // In a real app, this would upload the document to Bland AI
      // const documentFile = new File(
      //   [formData.content], 
      //   `${formData.title.replace(/\s+/g, '_')}.md`,
      //   { type: 'text/markdown' }
      // );
      // 
      // const result = await uploadDocumentToKnowledgeBase(
      //   formData.knowledgeBaseId,
      //   documentFile,
      //   formData.title
      // );
      
      // For demo purposes, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      router.push('/teacher/knowledge-base');
    } catch (error) {
      console.error('Error creating knowledge base article:', error);
      
      // Display error message
      setFormErrors(prev => ({
        ...prev,
        submit: 'Failed to save article. Please try again.'
      }));
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    'Administrative',
    'Academic',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Engineering',
    'Humanities',
    'Social Sciences',
    'Business',
    'Other'
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="md:flex md:items-center md:justify-between md:space-x-5 mb-6">
        <div className="flex items-start space-x-5">
          <div className="pt-1.5">
            <h1 className="text-2xl font-bold text-gray-900">New Knowledge Base Article</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create content that will be used to answer student questions
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-y-0 sm:space-x-3 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={() => router.push('/teacher/knowledge-base')}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Article'
            )}
          </button>
        </div>
      </div>
      
      {formErrors.submit && (
        <div className="mb-4 p-4 bg-red-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{formErrors.submit}</h3>
            </div>
          </div>
        </div>
      )}
      
      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 gap-x-4">
              <div className="sm:col-span-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.title ? 'border-red-300' : ''
                    }`}
                    placeholder="e.g., Course Registration Process"
                  />
                  {formErrors.title && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.category ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {formErrors.category && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="knowledgeBaseId" className="block text-sm font-medium text-gray-700">
                  Knowledge Base
                </label>
                <div className="mt-1">
                  <select
                    id="knowledgeBaseId"
                    name="knowledgeBaseId"
                    value={formData.knowledgeBaseId}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.knowledgeBaseId ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="">Select a knowledge base</option>
                    {knowledgeBases.map(kb => (
                      <option key={kb.id} value={kb.id}>{kb.name}</option>
                    ))}
                  </select>
                  {formErrors.knowledgeBaseId && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.knowledgeBaseId}</p>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags (Optional)
                </label>
                <div className="mt-1">
                  <div className="flex">
                    <input
                      type="text"
                      name="tags"
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-l-md"
                      placeholder="Add tags to help with searching"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      Add
                    </button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tag}
                          <button
                            type="button"
                            className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:text-indigo-600 focus:outline-none"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <span className="sr-only">Remove tag {tag}</span>
                            <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content
                </label>
                <div className="mt-1">
                  <textarea
                    id="content"
                    name="content"
                    rows={15}
                    value={formData.content}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      formErrors.content ? 'border-red-300' : ''
                    }`}
                    placeholder="Enter the article content here. You can use Markdown formatting."
                  />
                  {formErrors.content && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.content}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    Use Markdown for formatting. Content should be detailed enough to answer student questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      
      {/* Bland AI Integration Info */}
      <div className="mt-6 bg-indigo-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <LightBulbIcon className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-indigo-800">Writing Tips for Bland AI Knowledge Base</h3>
            <ul className="mt-2 text-sm text-indigo-600 space-y-1">
              <li>• Be clear and direct. Structure content with headings and short paragraphs.</li>
              <li>• Include specific details that students commonly ask about.</li>
              <li>• Use natural, conversational language that works well for both text and voice responses.</li>
              <li>• Cover related topics that students might ask in follow-up questions.</li>
              <li>• Articles will be automatically vectorized to power AI responses in chat and voice calls.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function ExclamationIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function LightBulbIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}