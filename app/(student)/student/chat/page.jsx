'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ChatAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your university AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [relevantArticles, setRelevantArticles] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Get student info from session storage
    const storedStudent = sessionStorage.getItem('student');
    if (!storedStudent) {
      router.push('/student-login');
      return;
    }
    
    setStudent(JSON.parse(storedStudent));
  }, [router]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Update chat history for context
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    
    setInput('');
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // The backend would then call the Bland AI or OpenAI API
      // const response = await axios.post('/api/chat', {
      //   message: input,
      //   history: updatedHistory,
      //   studentId: student.id
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockResponse = {
        message: {
          id: Date.now() + 1,
          role: 'assistant',
          content: generateMockResponse(input, []),
          timestamp: new Date()
        },
        relevantArticles: searchKnowledgeBase(input)
      };
      
      // Set relevant articles
      setRelevantArticles(mockResponse.relevantArticles);
      
      // Add assistant message
      setMessages(prev => [...prev, mockResponse.message]);
      
      // Update chat history
      setChatHistory([...updatedHistory, mockResponse.message]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple search function for knowledge base (mock)
  const searchKnowledgeBase = (query) => {
    query = query.toLowerCase();
    
    // Mock knowledge base
    const knowledgeBase = [
      {
        id: "kb1",
        title: "Course Registration Process",
        content: "The course registration process begins two weeks before the semester starts. Students must log into the portal and select courses based on their program requirements...",
        category: "Administrative"
      },
      {
        id: "kb2",
        title: "Submitting Assignments on the Learning Portal",
        content: "All assignments must be submitted through the learning portal in PDF format. The file size should not exceed 10MB...",
        category: "Academic"
      },
      {
        id: "kb3",
        title: "Understanding Big O Notation",
        content: "Big O notation is used to describe the performance or complexity of an algorithm. It describes the worst-case scenario and can be used to describe the execution time required or the space used...",
        category: "Computer Science"
      }
    ];
    
    return knowledgeBase.filter(article => {
      return (
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
      );
    }).slice(0, 3); // Limit to top 3 results
  };

  // Mock AI response generator (would be replaced by Bland AI/OpenAI in production)
  const generateMockResponse = (query, articles) => {
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
    if (articles && articles.length > 0) {
      const article = articles[0];
      return `Based on our knowledge base: ${article.content.substring(0, 200)}... You can read more about this in our knowledge base article "${article.title}".`;
    }
    
    // Default response
    return "I'm not sure about that specific question. Would you like me to connect you with a professor who might be able to help? You can request a callback through the 'Request Callback' section.";
  };

  if (!student) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Chat Assistant</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow h-[70vh] flex flex-col">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.isError
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : message.isError ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Input form */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your question here..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
              
              <div className="mt-2 text-xs text-gray-500 flex items-center">
                <InfoIcon className="h-4 w-4 mr-1" />
                <span>Powered by Bland AI and OpenAI | Using university knowledge base</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar with relevant knowledge articles */}
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Related Resources</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {relevantArticles.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">These knowledge base articles might help:</p>
                  <ul className="space-y-3">
                    {relevantArticles.map(article => (
                      <li key={article.id} className="bg-blue-50 rounded-md p-3">
                        <h3 className="text-sm font-medium text-blue-800">{article.title}</h3>
                        <p className="text-xs text-blue-600 mt-1">Category: {article.category}</p>
                        <button className="text-xs font-medium text-blue-700 mt-2 hover:text-blue-900">
                          Read full article
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">Ask me questions about:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Course registration and enrollment</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Assignment deadlines and submissions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Exam schedules and requirements</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Campus facilities and resources</span>
                    </li>
                  </ul>
                </>
              )}
              
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-gray-700">Need personalized help?</p>
                <Link 
                  href="/student/request-callback"
                  className="mt-2 inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PhoneIcon className="h-4 w-4 mr-1" />
                  Request professor callback
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-md p-4">
            <div className="flex items-start">
              <LightBulbIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">AI-Powered Assistant</h3>
                <p className="text-xs text-blue-600 mt-1">
                  Our chat assistant uses Bland AI and OpenAI to provide accurate information from the university knowledge base. For complex issues, it can help you connect with a professor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icons
function CheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function InfoIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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