// app/components/knowledge-base/KnowledgeBaseManager.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function KnowledgeBaseManager() {
  const [knowledgeBases, setKnowledgeBases] = useState([]);
  const [primaryKnowledgeBase, setPrimaryKnowledgeBase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content: '',
    setPrimary: true
  });
  const [uploadData, setUploadData] = useState({
    file: null,
    name: '',
    description: '',
    setPrimary: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const router = useRouter();

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const fetchKnowledgeBases = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/knowledge-bases');
      setKnowledgeBases(response.data.knowledgeBases || []);
      setPrimaryKnowledgeBase(response.data.primaryKnowledgeBase || null);
    } catch (error) {
      console.error('Error fetching knowledge bases:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load knowledge bases. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear related error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadData(prev => ({
      ...prev,
      file
    }));
    
    // Clear related error
    if (uploadErrors.file) {
      setUploadErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleUploadChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear related error
    if (uploadErrors[name]) {
      setUploadErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateUploadForm = () => {
    const errors = {};
    
    if (!uploadData.file) {
      errors.file = 'File is required';
    }
    
    if (!uploadData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!uploadData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    setUploadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // Creating a new knowledge base
      const response = await axios.post('/api/knowledge-bases', {
        name: formData.name,
        description: formData.description,
        content: formData.content,
        setPrimary: formData.setPrimary
      });
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Knowledge base created successfully!'
      });
      
      // Reset form and close it
      setFormData({
        name: '',
        description: '',
        content: '',
        setPrimary: true
      });
      setShowCreateForm(false);
      
      // Refresh the list
      fetchKnowledgeBases();
    } catch (error) {
      console.error('Error creating knowledge base:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to create knowledge base'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!validateUploadForm()) return;
    
    setIsUploading(true);
    setMessage({ type: '', text: '' });
    
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('name', uploadData.name);
    formData.append('description', uploadData.description);
    formData.append('setPrimary', uploadData.setPrimary.toString());
    
    try {
      const response = await axios.post('/api/knowledge-bases/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Knowledge base uploaded successfully!'
      });
      
      // Reset form and close it
      setUploadData({
        file: null,
        name: '',
        description: '',
        setPrimary: true
      });
      setShowUploadForm(false);
      
      // Refresh the list
      fetchKnowledgeBases();
    } catch (error) {
      console.error('Error uploading knowledge base:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to upload knowledge base'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (knowledgeBaseId) => {
    if (!confirm('Are you sure you want to delete this knowledge base?')) return;
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await axios.delete(`/api/knowledge-bases/${knowledgeBaseId}`);
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Knowledge base deleted successfully!'
      });
      
      // Refresh the list
      fetchKnowledgeBases();
    } catch (error) {
      console.error('Error deleting knowledge base:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to delete knowledge base'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetAsPrimary = async (knowledgeBaseId) => {
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await axios.post(`/api/knowledge-bases/${knowledgeBaseId}/set-as-primary`);
      
      // Show success message
      setMessage({
        type: 'success',
        text: 'Primary knowledge base updated successfully!'
      });
      
      // Refresh the list
      fetchKnowledgeBases();
    } catch (error) {
      console.error('Error setting primary knowledge base:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update primary knowledge base'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (knowledgeBase) => {
    setSelectedKnowledgeBase(knowledgeBase);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Knowledge Base Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => {
              setShowCreateForm(true);
              setShowUploadForm(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New
          </button>
          <button
            onClick={() => {
              setShowUploadForm(true);
              setShowCreateForm(false);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Upload File
          </button>
        </div>
      </div>
      
      {message.text && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Create New Knowledge Base</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-300' : ''
                }`}
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formErrors.description ? 'border-red-300' : ''
                }`}
              />
              {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
            </div>
            
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <textarea
                id="content"
                name="content"
                rows={10}
                value={formData.content}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  formErrors.content ? 'border-red-300' : ''
                }`}
              ></textarea>
              {formErrors.content && <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="setPrimary"
                name="setPrimary"
                checked={formData.setPrimary}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="setPrimary" className="ml-2 block text-sm text-gray-900">
                Set as primary knowledge base for callbacks
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isSaving ? 'Creating...' : 'Create Knowledge Base'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {showUploadForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Upload Knowledge Base File</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700">File (.txt, .pdf, .doc, .docx)</label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx"
                className={`mt-1 block w-full ${
                  uploadErrors.file ? 'border-red-300' : ''
                }`}
              />
              {uploadErrors.file && <p className="mt-1 text-sm text-red-600">{uploadErrors.file}</p>}
            </div>
            
            <div>
              <label htmlFor="uploadName" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="uploadName"
                name="name"
                value={uploadData.name}
                onChange={handleUploadChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  uploadErrors.name ? 'border-red-300' : ''
                }`}
              />
              {uploadErrors.name && <p className="mt-1 text-sm text-red-600">{uploadErrors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="uploadDescription" className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                id="uploadDescription"
                name="description"
                value={uploadData.description}
                onChange={handleUploadChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                  uploadErrors.description ? 'border-red-300' : ''
                }`}
              />
              {uploadErrors.description && <p className="mt-1 text-sm text-red-600">{uploadErrors.description}</p>}
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="uploadSetPrimary"
                name="setPrimary"
                checked={uploadData.setPrimary}
                onChange={handleUploadChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="uploadSetPrimary" className="ml-2 block text-sm text-gray-900">
                Set as primary knowledge base for callbacks
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {knowledgeBases.length > 0 ? (
              knowledgeBases.map((kb) => (
                <li key={kb.vector_id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{kb.name}</h3>
                        {primaryKnowledgeBase && primaryKnowledgeBase.vector_id === kb.vector_id && (
                          <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{kb.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(kb)}
                        className="px-3 py-1.5 text-xs font-medium rounded border border-gray-300 hover:bg-gray-50"
                      >
                        View
                      </button>
                      {(!primaryKnowledgeBase || primaryKnowledgeBase.vector_id !== kb.vector_id) && (
                        <button
                          onClick={() => handleSetAsPrimary(kb.vector_id)}
                          className="px-3 py-1.5 text-xs font-medium rounded border border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          Set as Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(kb.vector_id)}
                        className="px-3 py-1.5 text-xs font-medium rounded border border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 sm:px-6 text-center">
                <p className="text-gray-500">No knowledge bases found. Create one to get started.</p>
              </li>
            )}
          </ul>
        </div>
      )}
      
      {selectedKnowledgeBase && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{selectedKnowledgeBase.name}</h3>
                <button
                  onClick={() => setSelectedKnowledgeBase(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="text-sm text-gray-500 mb-4">{selectedKnowledgeBase.description}</div>
              <div className="flex space-x-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ID: {selectedKnowledgeBase.vector_id}
                </span>
                {primaryKnowledgeBase && primaryKnowledgeBase.vector_id === selectedKnowledgeBase.vector_id && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Primary Knowledge Base
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Content Preview</h4>
                <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm overflow-auto max-h-60">
                  <p className="text-gray-600">Full content not available in preview. To see full content, download or edit the knowledge base.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
              {(!primaryKnowledgeBase || primaryKnowledgeBase.vector_id !== selectedKnowledgeBase.vector_id) && (
                <button
                  onClick={() => {
                    handleSetAsPrimary(selectedKnowledgeBase.vector_id);
                    setSelectedKnowledgeBase(null);
                  }}
                  className="px-4 py-2 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-50"
                >
                  Set as Primary
                </button>
              )}
              <button
                onClick={() => {
                  handleDelete(selectedKnowledgeBase.vector_id);
                  setSelectedKnowledgeBase(null);
                }}
                className="px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedKnowledgeBase(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}