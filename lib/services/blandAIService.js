// lib/services/blandAIService.js

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
 * Format a phone number to ensure it has the country code prefix
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phoneNumber) {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // Check if it already has a country code (assuming US/Canada +1)
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length > 10 && !phoneNumber.startsWith('+')) {
    return `+${digitsOnly}`;
  } else if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  }
  
  // Default to +1 if we can't determine the format
  return `+1${digitsOnly}`;
}

/**
 * Generate a simple script for the AI to use during the call
 * @param {object} teacher - Teacher information
 * @param {object} request - The callback request
 * @returns {string} - The script for the AI call
 */
function generateCallScript(teacher, request) {
  return `
Hello, I'm an AI assistant calling on behalf of ${teacher.name}.

You requested assistance with: "${request.subject}".

You mentioned: "${request.message}"

I have access to ${teacher.name}'s knowledge base and will use that information to help answer your questions.

How can I help you with this today?
  `.trim();
}

/**
 * Initiate a callback via Bland AI
 * @param {object} request - The callback request
 * @param {object} student - Student information
 * @param {object} teacher - Teacher information
 * @returns {object} - Response from Bland AI
 */
export async function initiateCallback(request, student, teacher) {
  // Check if we're in development environment
  if (process.env.NODE_ENV === 'development') {
    // Simulate a successful response for development
    return {
      id: `mock_call_${Date.now()}`,
      status: 'queued',
      created_at: new Date().toISOString(),
      message: 'Call queued successfully (MOCK)',
    };
  }

  try {
    console.log('Initiating callback for request:', request.id);
    
    // Ensure we have a valid phone number with country code
    const formattedPhoneNumber = formatPhoneNumber(student.phoneNumber);
    
    // Generate the call script
    const script = generateCallScript(teacher, request);
    
    // Prepare payload for Bland AI with knowledge base integration
    const payload = {
      phone_number: formattedPhoneNumber,
      voice_id: teacher.voiceId || 'bland_female_1', 
      task: script,
      reduce_latency: true,
      wait_for_greeting: true,
      first_sentence: `Hello ${student.name}, this is an AI assistant calling on behalf of ${teacher.name} regarding your request about ${request.subject}.`,
      // Add knowledge base integration
      knowledge_base: {
        id: teacher.knowledgeBaseId,
        query: request.subject + " " + request.message,
        similarity_threshold: 0.7, // Adjust threshold as needed
        top_k: 5 // Number of documents to retrieve
      }
    };
    
    // For debugging, log the payload (but hide sensitive info)
    console.log('Bland AI payload (partial):', {
      ...payload,
      phone_number: '********' + payload.phone_number.slice(-4),
      knowledge_base: { 
        ...payload.knowledge_base,
        id: `kb_${payload.knowledge_base.id.slice(-5)}` // Show only part of the ID for privacy
      }
    });
    
    // Make the API call to Bland AI
    const response = await blandAIClient.post('/v1/calls', payload);
    return response.data;
  } catch (error) {
    console.error('Error initiating callback with Bland AI:', error);
    
    // Log detailed error information if available
    if (error.response && error.response.data) {
      console.error('Bland AI error details:', error.response.data);
    }
    
    throw error;
  }
}

/**
 * Get all knowledge bases for a teacher
 * @param {string} teacherId - The ID of the teacher
 * @returns {Array} - List of knowledge bases
 */
export async function getKnowledgeBases(teacherId) {
  try {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          id: `kb_${teacherId}_1`,
          name: "Primary Knowledge Base",
          description: "Main knowledge base for course content",
          document_count: 15
        },
        {
          id: `kb_${teacherId}_2`,
          name: "Advanced Topics",
          description: "Knowledge base for advanced topics and research",
          document_count: 8
        }
      ];
    }

    const response = await blandAIClient.get('/v1/knowledge-bases', {
      params: { teacher_id: teacherId }
    });
    return response.data.knowledge_bases;
  } catch (error) {
    console.error('Error fetching knowledge bases:', error);
    throw error;
  }
}

/**
 * Get documents in a knowledge base
 * @param {string} knowledgeBaseId - The ID of the knowledge base
 * @returns {Array} - List of documents
 */
export async function getKnowledgeBaseDocuments(knowledgeBaseId) {
  try {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          id: "doc1",
          name: "Course Syllabus",
          created_at: new Date().toISOString(),
          size: 245600,
          type: "text/markdown"
        },
        {
          id: "doc2",
          name: "Assignment Guidelines",
          created_at: new Date().toISOString(),
          size: 153400,
          type: "text/markdown"
        }
      ];
    }

    const response = await blandAIClient.get(`/v1/knowledge-bases/${knowledgeBaseId}/documents`);
    return response.data.documents;
  } catch (error) {
    console.error('Error fetching knowledge base documents:', error);
    throw error;
  }
}

/**
 * Query a knowledge base for relevant information
 * @param {string} knowledgeBaseId - The ID of the knowledge base
 * @param {string} query - The search query
 * @returns {Object} - Search results
 */
export async function queryKnowledgeBase(knowledgeBaseId, query) {
  try {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return {
        query: query,
        results: [
          {
            id: "res1",
            document_id: "doc1",
            title: "Course Syllabus",
            excerpt: `This is a relevant excerpt matching the query "${query}"...`,
            score: 0.92
          },
          {
            id: "res2",
            document_id: "doc2",
            title: "Assignment Guidelines",
            excerpt: `Another relevant excerpt for "${query}"...`,
            score: 0.85
          }
        ]
      };
    }

    const response = await blandAIClient.post(`/v1/knowledge-bases/${knowledgeBaseId}/query`, {
      query: query,
      similarity_threshold: 0.7,
      top_k: 5
    });
    return response.data;
  } catch (error) {
    console.error('Error querying knowledge base:', error);
    throw error;
  }
}