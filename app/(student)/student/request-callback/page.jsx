// app/(student)/student/request-callback/page.jsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function RequestCallback() {
  const [assignedTeachers, setAssignedTeachers] = useState([]);
  const [callbackRequests, setCallbackRequests] = useState([]);
  const [formData, setFormData] = useState({
    teacherId: '',
    subject: '',
    message: '',
    requestedDate: formatDateForInput(new Date(Date.now() + 24 * 60 * 60 * 1000)), // Default to tomorrow
    immediateCall: true, // Set immediate call to true by default
    phoneNumber: '' // Added phone number field
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    
    // Fetch data
    fetchData(session.user.studentId);
    
    // Pre-fill phone number from student data if available
    if (session.user.phoneNumber) {
      setFormData(prev => ({ ...prev, phoneNumber: session.user.phoneNumber }));
    }
  }, [session]);

  const fetchData = async (studentId) => {
    setIsLoading(true);
    try {
      // Fetch assigned teachers
      const teachersResponse = await fetch(`/api/students/${studentId}/teachers`);
      const teachersData = await teachersResponse.json();
      
      if (teachersResponse.ok) {
        setAssignedTeachers(teachersData.teachers);
        
        // Set default teacher if available
        if (teachersData.teachers.length > 0) {
          setFormData(prev => ({ ...prev, teacherId: teachersData.teachers[0].id }));
        }
      }
      
      // Fetch callback requests
      const requestsResponse = await fetch(`/api/callback-requests?studentId=${studentId}`);
      const requestsData = await requestsResponse.json();
      
      if (requestsResponse.ok) {
        setCallbackRequests(requestsData.callbackRequests);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to load data. Please try again later.'
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
    
    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.teacherId) errors.teacherId = 'Please select a teacher';
    if (!formData.subject.trim()) errors.subject = 'Please enter a subject';
    if (!formData.message.trim()) errors.message = 'Please enter a message';
    
    // Validate phone number
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Please enter your phone number';
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number (10-15 digits)';
    }
    
    // Only validate requested date if not doing an immediate call
    if (!formData.immediateCall && !formData.requestedDate) {
      errors.requestedDate = 'Please select a date';
    }
    
    // Check if requested date is in the future (only if not immediate call)
    if (!formData.immediateCall && formData.requestedDate) {
      const now = new Date();
      const requestedDate = new Date(formData.requestedDate);
      if (requestedDate <= now) {
        errors.requestedDate = 'Please select a future date and time';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/callback-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacherId: formData.teacherId,
          subject: formData.subject,
          message: formData.message,
          requestedDate: formData.requestedDate,
          immediateCall: formData.immediateCall,
          phoneNumber: formData.phoneNumber
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create callback request');
      }
      
      // Add the new request to the list
      setCallbackRequests(prev => [data.request, ...prev]);
      
      // Show success message
      setSubmitStatus({
        type: 'success',
        message: data.message || 'Your callback request has been submitted. You will receive a call shortly!'
      });
      
      // Reset form but keep phone number and teacher
      setFormData({
        teacherId: formData.teacherId,
        subject: '',
        message: '',
        requestedDate: formatDateForInput(new Date(Date.now() + 24 * 60 * 60 * 1000)),
        immediateCall: true,
        phoneNumber: formData.phoneNumber
      });
    } catch (error) {
      console.error('Error submitting callback request:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'There was an error submitting your request. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Request a Callback</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">New Callback Request</h2>
              <p className="mt-1 text-sm text-gray-500">
                Get an immediate call from one of your professors for personalized assistance.
              </p>
            </div>
            
            {submitStatus.message && (
              <div className={`mx-6 mt-4 p-4 rounded-md ${
                submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">
                    Select Professor
                  </label>
                  <select
                    id="teacherId"
                    name="teacherId"
                    value={formData.teacherId}
                    onChange={handleChange}
                    className={`mt-1 block w-full py-2 px-3 border ${
                      formErrors.teacherId ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  >
                    {assignedTeachers.length > 0 ? (
                      assignedTeachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.user.name} - {teacher.department}
                        </option>
                      ))
                    ) : (
                      <option value="">No professors assigned</option>
                    )}
                  </select>
                  {formErrors.teacherId && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.teacherId}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`mt-1 block w-full py-2 px-3 border ${
                      formErrors.subject ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="e.g., Help with Assignment 3"
                  />
                  {formErrors.subject && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.subject}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className={`mt-1 block w-full py-2 px-3 border ${
                      formErrors.message ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Describe what you need help with..."
                  />
                  {formErrors.message && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.message}</p>
                  )}
                </div>
                
                {/* Phone Number Field */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`mt-1 block w-full py-2 px-3 border ${
                      formErrors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="e.g., 8639391665"
                  />
                  {formErrors.phoneNumber ? (
                    <p className="mt-2 text-sm text-red-600">{formErrors.phoneNumber}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your 10-digit phone number to receive the call (numbers only, no spaces or symbols)
                    </p>
                  )}
                </div>
                
                <div className="hidden">
                  {/* Hidden since we're always doing immediate calls */}
                  <input
                    type="datetime-local"
                    id="requestedDate"
                    name="requestedDate"
                    value={formData.requestedDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={assignedTeachers.length === 0 || isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Setting up call...
                    </>
                  ) : (
                    'Request Immediate Call'
                  )}
                </button>
              </div>
            </form>
            
            <div className="px-4 py-3 bg-gray-50 text-sm font-semibold sm:px-6">
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                <span>Once you submit, you'll receive a call from the teacher's AI assistant</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Your Callback Requests</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              {callbackRequests.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {callbackRequests.map((request) => {
                    const teacherName = request.teacher?.user?.name || 'Unknown Teacher';
                    
                    return (
                      <li key={`request-${request.id}`} className="py-4">
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-900">{request.subject}</p>
                            <span className={`
                              inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${getStatusColor(request.status)}
                            `}>
                              {formatStatus(request.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">With: {teacherName}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(request.requestedDate).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm py-4">You have no callback requests.</p>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800">How AI Callbacks Work</h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Submit your request with details about what you need help with</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>You'll immediately receive a call from our Bland AI system</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>The AI-powered call will use the professor's knowledge base to help answer your questions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>For complex topics, the professor will be notified to follow up with you personally</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">5.</span>
                <span>After the call, you can rate the assistance and provide feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getStatusColor(status) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'SCHEDULED':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function formatStatus(status) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

// Icons
function PhoneIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}