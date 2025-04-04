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
    
    // Prepare a payload for Bland AI
    const payload = {
      phone_number: formattedPhoneNumber,
      voice_id: teacher.voiceId || 'bland_female_1', 
      task: script,
      reduce_latency: true,
      wait_for_greeting: true,
      first_sentence: `Hello ${student.name}, this is an AI assistant calling on behalf of ${teacher.name} regarding your request about ${request.subject}.`
    };
    
    // Add the knowledge base as a tool if available
    if (teacher.knowledgeBaseId) {
      payload.tools = [teacher.knowledgeBaseId];
      console.log(`Using knowledge base: ${teacher.knowledgeBaseId} for callback`);
    }
    
    // For debugging, log the payload (but hide sensitive info)
    console.log('Bland AI payload (partial):', {
      ...payload,
      phone_number: '********' + payload.phone_number.slice(-4)
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

// Export the functions from the knowledge base service
export { 
  createKnowledgeBase,
  uploadKnowledgeBase,
  updateKnowledgeBase,
  listKnowledgeBases,
  getKnowledgeBase,
  deleteKnowledgeBase 
} from './blandAIKnowledgeBaseService';