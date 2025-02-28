import { NextResponse } from 'next/server';
import { queryKnowledgeBase } from '@/lib/services/blandAIService';
import { knowledgeBase as mockKnowledgeBase } from '@/lib/data/mockData';

// Mock function to simulate knowledge base query until Bland AI integration is complete
const mockQueryKnowledgeBase = async (query) => {
  const normalizedQuery = query.toLowerCase();
  
  // Find relevant articles
  const relevantArticles = mockKnowledgeBase.filter(article => {
    const titleMatch = article.title.toLowerCase().includes(normalizedQuery);
    const contentMatch = article.content.toLowerCase().includes(normalizedQuery);
    const categoryMatch = article.category.toLowerCase().includes(normalizedQuery);
    
    return titleMatch || contentMatch || categoryMatch;
  });
  
  return relevantArticles.slice(0, 3); // Return top 3 matches
};

// Generate a mock AI response for demo purposes
const generateMockResponse = (query, knowledgeBaseResults) => {
  query = query.toLowerCase();
  
  // Check if query contains certain keywords
  if (query.includes('exam') || query.includes('test')) {
    return 'Exam information can be found on the university portal under "Examination Schedule." For course-specific exam details, please check with your professor or course syllabus.';
  }
  
  if (query.includes('deadline') || query.includes('due date')) {
    return 'All assignment deadlines are set by your professors and should be listed in your course syllabus. For university-wide deadlines like registration or withdrawal, please check the academic calendar on the university website.';
  }
  
  if (query.includes('registration') || query.includes('enroll') || query.includes('sign up')) {
    return 'Course registration typically opens two weeks before the semester starts. You can register through the student portal. If you\'re having trouble registering for a specific course, please contact your academic advisor.';
  }
  
  if (query.includes('grade') || query.includes('mark')) {
    return 'Grades are typically released within two weeks after the end of the semester. You can view your grades in the student portal under "Academic Record." If you have questions about a specific grade, please contact your professor directly.';
  }
  
  if (query.includes('assignment') || query.includes('homework')) {
    return 'All assignments should be submitted through the learning portal by the deadline specified in your course syllabus. If you\'re having technical issues with submission, please contact IT support at support@university.edu.';
  }
  
  // Use knowledge base article if available
  if (knowledgeBaseResults.length > 0) {
    const article = knowledgeBaseResults[0];
    return `Based on our knowledge base: ${article.content.substring(0, 200)}... You can read more about this in our knowledge base article "${article.title}".`;
  }
  
  // Default response
  return "I'm not sure about that specific question. Would you like me to connect you with a professor who might be able to help? You can request a callback through the 'Request Callback' section.";
};

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate the request
    if (!body.message) {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      );
    }
    
    const query = body.message;
    const chatHistory = body.history || [];
    let studentId = body.studentId;
    let knowledgeBaseId = body.knowledgeBaseId || 'university-general'; // Default knowledge base
    
    // In production, we would get and validate the student from the session
    
    let knowledgeBaseResults = [];
    
    try {
      // In production, this would use the Bland AI knowledge base
      // For the demo, use the mock function
      knowledgeBaseResults = await mockQueryKnowledgeBase(query);
      
      // Uncomment this for actual Bland AI integration
      // knowledgeBaseResults = await queryKnowledgeBase(knowledgeBaseId, query);
    } catch (kbError) {
      console.error('Error querying knowledge base:', kbError);
      // Continue without knowledge base results
    }
    
    // Generate response
    // In production, this would use Bland AI or OpenAI for chat
    const responseMessage = generateMockResponse(query, knowledgeBaseResults);
    
    // Format the response
    const response = {
      id: Date.now().toString(),
      content: responseMessage,
      role: 'assistant',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json({
      message: response,
      relevantArticles: knowledgeBaseResults
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error.message },
      { status: 500 }
    );
  }
}