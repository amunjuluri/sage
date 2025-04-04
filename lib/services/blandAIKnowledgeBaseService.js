// lib/services/blandAIKnowledgeBaseService.js

import axios from 'axios';

// Create Axios client with Bland AI base URL and authentication
const blandAIClient = axios.create({
  baseURL: 'https://api.bland.ai',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BLAND_AI_API_KEY || 'your_bland_ai_api_key_here'}`
  }
});

/**
 * Create a new knowledge base
 * @param {string} name - Name of the knowledge base
 * @param {string} description - Description of the knowledge base
 * @param {string} text - Text content for the knowledge base
 * @returns {Promise<Object>} - Response with the vector_id
 */
export async function createKnowledgeBase(name, description, text) {
  try {
    const response = await blandAIClient.post('/v1/knowledgebases', {
      name,
      description,
      text
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating knowledge base:', error);
    throw error;
  }
}

/**
 * Upload a file as a knowledge base
 * @param {File} file - The file to upload
 * @param {string} name - Name of the knowledge base
 * @param {string} description - Description of the knowledge base
 * @returns {Promise<Object>} - Response with the vector_id
 */
export async function uploadKnowledgeBase(file, name, description) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    
    const response = await blandAIClient.post('/v1/knowledgebases/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading knowledge base:', error);
    throw error;
  }
}

/**
 * Update an existing knowledge base
 * @param {string} vectorId - The knowledge base vector_id
 * @param {string} name - Updated name
 * @param {string} description - Updated description
 * @param {string} text - Updated text content
 * @returns {Promise<Object>} - Response with the vector_id
 */
export async function updateKnowledgeBase(vectorId, name, description, text) {
  try {
    const response = await blandAIClient.patch(`/v1/knowledgebases/${vectorId}`, {
      name,
      description,
      text
    });
    
    return response.data;
  } catch (error) {
    console.error('Error updating knowledge base:', error);
    throw error;
  }
}

/**
 * List all knowledge bases
 * @param {boolean} includeText - Whether to include the full text content
 * @returns {Promise<Object>} - Response with the list of knowledge bases
 */
export async function listKnowledgeBases(includeText = false) {
  try {
    const response = await blandAIClient.get('/v1/knowledgebases', {
      params: { include_text: includeText }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error listing knowledge bases:', error);
    throw error;
  }
}

/**
 * Get details of a specific knowledge base
 * @param {string} vectorId - The knowledge base vector_id
 * @param {boolean} includeText - Whether to include the full text content
 * @returns {Promise<Object>} - Response with the knowledge base details
 */
export async function getKnowledgeBase(vectorId, includeText = false) {
  try {
    const response = await blandAIClient.get(`/v1/knowledgebases/${vectorId}`, {
      params: { include_text: includeText }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting knowledge base:', error);
    throw error;
  }
}

/**
 * Delete a knowledge base
 * @param {string} vectorId - The knowledge base vector_id
 * @returns {Promise<Object>} - Response indicating success
 */
export async function deleteKnowledgeBase(vectorId) {
  try {
    const response = await blandAIClient.delete(`/v1/knowledgebases/${vectorId}`);
    
    return response.data;
  } catch (error) {
    console.error('Error deleting knowledge base:', error);
    throw error;
  }
}