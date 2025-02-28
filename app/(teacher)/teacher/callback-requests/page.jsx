'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initiateCallback } from '@/lib/services/blandAIService';

export default function CallbackRequests() {
  const [teacher, setTeacher] = useState(null);
  const [callbackRequests, setCallbackRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentModal, setCurrentModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callResult, setCallResult] = useState(null);
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
    
    // Fetch callback requests
    fetchCallbackRequests(teacherData.id);
  }, [router]);

  useEffect(() => {
    if (callbackRequests.length > 0) {
      filterRequests();
    }
  }, [statusFilter, callbackRequests]);

  const fetchCallbackRequests = async (teacherId) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await axios.get(`/api/callback-requests?teacherId=${teacherId}`);
      // const data = response.data.callbackRequests;
      
      // For now, use mock data
      const mockData = [
        {
          id: "cr1",
          studentId: "s1",
          studentName: "Alex Johnson",
          studentCourse: "Computer Science",
          studentYear: 2,
          studentPhone: "+15551234567", // Mock phone number
          subject: "Help with Assignment 3",
          message: "I'm struggling with the recursion section of assignment 3. Could you help me understand it better?",
          requestedDate: "2025-02-25T14:30:00",
          status: "pending"
        },
        {
          id: "cr2",
          studentId: "s2",
          studentName: "Jamie Smith",
          studentCourse: "Mathematics",
          studentYear: 3,
          studentPhone: "+15559876543", // Mock phone number
          subject: "Question about Linear Algebra",
          message: "I have questions about the eigenvalue problems we covered last week.",
          requestedDate: "2025-02-26T10:00:00",
          status: "scheduled",
          scheduledDate: "2025-02-26T15:00:00",
          callId: "call_1234567890"
        },
        {
          id: "cr3",
          studentId: "s3",
          studentName: "Taylor Wong",
          studentCourse: "Physics",
          studentYear: 1,
          studentPhone: "+15555678901", // Mock phone number
          subject: "Question about Quantum Mechanics",
          message: "I'm having trouble understanding the Schrödinger equation. Could you explain it in simpler terms?",
          requestedDate: "2025-02-27T11:15:00",
          status: "pending"
        },
        {
          id: "cr4",
          studentId: "s1",
          studentName: "Alex Johnson",
          studentCourse: "Computer Science",
          studentYear: 2,
          studentPhone: "+15551234567", // Mock phone number
          subject: "Algorithm Complexity",
          message: "Could you help me understand Big O notation better? I'm confused about the difference between O(n log n) and O(n²).",
          requestedDate: "2025-02-20T09:30:00",
          status: "completed",
          completedDate: "2025-02-21T10:15:00",
          callDuration: 23 // minutes
        },
        {
          id: "cr5",
          studentId: "s2",
          studentName: "Jamie Smith",
          studentCourse: "Mathematics",
          studentYear: 3,
          studentPhone: "+15559876543", // Mock phone number
          subject: "Calculus Assignment",
          message: "I'm having difficulty with the integration problems on page 87.",
          requestedDate: "2025-02-18T13:45:00",
          status: "cancelled",
          cancelledReason: "Student requested cancellation"
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCallbackRequests(mockData);
      setFilteredRequests(mockData);
    } catch (error) {
      console.error('Error fetching callback requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    if (statusFilter === 'all') {
      setFilteredRequests(callbackRequests);
    } else {
      setFilteredRequests(callbackRequests.filter(request => request.status === statusFilter));
    }
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleScheduleCall = (request) => {
    setCurrentModal({
      type: 'schedule',
      request
    });
  };

  const handleCancelRequest = (request) => {
    setCurrentModal({
      type: 'cancel',
      request
    });
  };

  const handleCompleteCall = (request) => {
    setCurrentModal({
      type: 'complete',
      request
    });
  };

  const handleViewDetails = (request) => {
    setCurrentModal({
      type: 'details',
      request
    });
  };

  const closeModal = () => {
    setCurrentModal(null);
    setCallResult(null);
  };

  const confirmScheduleCall = async () => {
    if (!currentModal || currentModal.type !== 'schedule') return;
    
    const request = currentModal.request;
    setIsProcessing(true);
    
    try {
      // In a real app, call the API to schedule the call with Bland AI
      // const response = await axios.put(`/api/callback-requests`, {
      //   requestId: request.id,
      //   action: 'schedule'
      // });
      
      // For demo purposes, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockResponse = {
        success: true,
        message: 'Call scheduled successfully',
        callId: `call_${Date.now()}`,
        request: {
          ...request,
          status: 'scheduled',
          scheduledDate: new Date().toISOString(),
          callId: `call_${Date.now()}`
        }
      };
      
      // In a real app, this would be initialized with teacher's API key
      // const result = await initiateCallback(request, request.student, teacher);
      
      // Update the request in the local state
      setCallbackRequests(prev => prev.map(req => 
        req.id === request.id ? mockResponse.request : req
      ));
      
      setCallResult({
        success: true,
        message: 'Call scheduled successfully!',
        details: 'The student will receive a call at the scheduled time using the Bland AI calling system.'
      });
    } catch (error) {
      console.error('Error scheduling call:', error);
      setCallResult({
        success: false,
        message: 'Failed to schedule call',
        details: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmCancelRequest = async () => {
    if (!currentModal || currentModal.type !== 'cancel') return;
    
    const request = currentModal.request;
    setIsProcessing(true);
    
    try {
      // In a real app, call the API to cancel the request
      // const response = await axios.put(`/api/callback-requests`, {
      //   requestId: request.id,
      //   action: 'cancel'
      // });
      
      // For demo purposes, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the request in the local state
      setCallbackRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'cancelled', cancelledReason: 'Cancelled by teacher' } : req
      ));
      
      setCallResult({
        success: true,
        message: 'Request cancelled successfully',
        details: 'The student will be notified of the cancellation.'
      });
    } catch (error) {
      console.error('Error cancelling request:', error);
      setCallResult({
        success: false,
        message: 'Failed to cancel request',
        details: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmCompleteCall = async () => {
    if (!currentModal || currentModal.type !== 'complete') return;
    
    const request = currentModal.request;
    setIsProcessing(true);
    
    try {
      // In a real app, call the API to mark the call as completed
      // const response = await axios.put(`/api/callback-requests`, {
      //   requestId: request.id,
      //   action: 'complete'
      // });
      
      // For demo purposes, simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the request in the local state
      setCallbackRequests(prev => prev.map(req => 
        req.id === request.id ? { ...req, status: 'completed', completedDate: new Date().toISOString() } : req
      ));
      
      setCallResult({
        success: true,
        message: 'Call marked as completed',
        details: 'The student will be able to provide feedback on the call.'
      });
    } catch (error) {
      console.error('Error completing call:', error);
      setCallResult({
        success: false,
        message: 'Failed to mark call as completed',
        details: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Callback Requests</h1>
        <div className="mt-3 md:mt-0 flex items-center">
          <label htmlFor="statusFilter" className="mr-2 text-sm font-medium text-gray-700">
            Status:
          </label>
          <select
            id="statusFilter"
            className="block w-full md:w-auto rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Main content */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <li key={request.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-2 md:mb-0">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          {request.studentName.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{request.subject}</h3>
                        <p className="text-sm text-gray-500">
                          From: {request.studentName} • {request.studentCourse}, Year {request.studentYear}
                        </p>
                        <p className="text-sm text-gray-500">
                          Requested: {new Date(request.requestedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full self-start md:self-auto ${
                      request.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : request.status === 'scheduled'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    
                    {/* Action buttons based on status */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        Details
                      </button>
                      
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleScheduleCall(request)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                          >
                            Schedule
                          </button>
                          <button
                            onClick={() => handleCancelRequest(request)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      
                      {request.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleCompleteCall(request)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleCancelRequest(request)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-10 text-center">
              <p className="text-gray-500">No callback requests found.</p>
            </li>
          )}
        </ul>
      </div>
      
      {/* Bland AI integration note */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Bland AI Integration</h3>
            <p className="mt-1 text-sm text-blue-600">
              This system uses Bland AI to automatically place calls to students at the scheduled time. The AI will use your knowledge base to help answer common questions, and will connect you with the student for more complex discussions.
            </p>
          </div>
        </div>
      </div>
      
      {/* Modals */}
      {currentModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeModal}></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog" 
              aria-modal="true" 
              aria-labelledby="modal-headline"
            >
              {currentModal.type === 'schedule' && !callResult && (
                <div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                        <CalendarIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                          Schedule Callback Call
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            You are about to schedule a call with {currentModal.request.studentName} regarding "{currentModal.request.subject}". 
                            The call will be placed automatically using Bland AI.
                          </p>
                          <div className="mt-4 bg-gray-50 p-3 rounded-md">
                            <h4 className="text-sm font-medium text-gray-900">Student Message:</h4>
                            <p className="text-sm text-gray-600 mt-1">{currentModal.request.message}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={confirmScheduleCall}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Schedule Call'
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {currentModal.type === 'cancel' && !callResult && (
                <div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                          Cancel Callback Request
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to cancel the callback request from {currentModal.request.studentName}? 
                            The student will be notified that their request has been cancelled.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={confirmCancelRequest}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Cancelling...' : 'Cancel Request'}
                    </button>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                      disabled={isProcessing}
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}
              
              {currentModal.type === 'complete' && !callResult && (
                <div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                        <CheckIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                          Mark Call as Completed
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Has the call with {currentModal.request.studentName} been completed? 
                            This will mark the callback request as complete and allow the student to provide feedback.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button 
                      type="button" 
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={confirmCompleteCall}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Mark as Completed'}
                    </button>
                    <button 
                      type="button" 
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={closeModal}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
              {currentModal.type === 'details' && (
                <div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                            Callback Request Details
                          </h3>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            currentModal.request.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : currentModal.request.status === 'scheduled'
                              ? 'bg-green-100 text-green-800'
                              : currentModal.request.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {currentModal.request.status.charAt(0).toUpperCase() + currentModal.request.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Subject</h4>
                              <p className="text-sm text-gray-600">{currentModal.request.subject}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Student</h4>
                              <p className="text-sm text-gray-600">{currentModal.request.studentName} - {currentModal.request.studentCourse}, Year {currentModal.request.studentYear}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Message</h4>
                              <p className="text-sm text-gray-600">{currentModal.request.message}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">Requested Date</h4>
                              <p className="text-sm text-gray-600">{new Date(currentModal.request.requestedDate).toLocaleString()}</p>
                            </div>
                            
                            {currentModal.request.status === 'scheduled' && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Scheduled Date</h4>
                                <p className="text-sm text-gray-600">{new Date(currentModal.request.scheduledDate).toLocaleString()}</p>
                              </div>
                            )}
                            
                            {currentModal.request.status === 'completed' && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Completed Date</h4>
                                <p className="text-sm text-gray-600">{new Date(currentModal.request.completedDate).toLocaleString()}</p>
                                {currentModal.request.callDuration && (
                                  <p className="text-sm text-gray-600 mt-1">Call Duration: {currentModal.request.callDuration} minutes</p>
                                )}
                              </div>
                            )}
                            
                            {currentModal.request.status === 'cancelled' && currentModal.request.cancelledReason && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Cancellation Reason</h4>
                                <p className="text-sm text-gray-600">{currentModal.request.cancelledReason}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
                    <button 
                      type="button" 
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              
              {/* Result screens */}
              {callResult && (
                <div>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                        callResult.success ? 'bg-green-100' : 'bg-red-100'
                      } sm:mx-0 sm:h-10 sm:w-10`}>
                        {callResult.success ? (
                          <CheckIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <ExclamationIcon className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                          {callResult.message}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {callResult.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button 
                      type="button" 
                      className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                        callResult.success ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'
                      } text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm`}
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function InformationCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function ExclamationIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}