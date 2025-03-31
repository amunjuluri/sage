// app/(teacher)/teacher/callback-requests/page.jsx

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function CallbackRequests() {
  const [callbackRequests, setCallbackRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentModal, setCurrentModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callResult, setCallResult] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;
    
    // Fetch callback requests
    fetchCallbackRequests(session.user.teacherId);
  }, [session]);

  useEffect(() => {
    if (callbackRequests.length > 0) {
      filterRequests();
    }
  }, [statusFilter, callbackRequests]);

  const fetchCallbackRequests = async (teacherId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/callback-requests?teacherId=${teacherId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch callback requests');
      }
      
      const data = await response.json();
      setCallbackRequests(data.callbackRequests);
      setFilteredRequests(data.callbackRequests);
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
      setFilteredRequests(callbackRequests.filter(request => 
        request.status.toLowerCase() === statusFilter
      ));
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
      const response = await fetch(`/api/callback-requests/${request.id}/schedule`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to schedule call');
      }
      
      const data = await response.json();
      
      // Update the request in the local state
      setCallbackRequests(prev => prev.map(req => 
        req.id === request.id ? data.request : req
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
      const response = await fetch(`/api/callback-requests/${request.id}/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel request');
      }
      
      const data = await response.json();
      
      // Update the request in the local state
      setCallbackRequests(prev => prev.map(req => 
        req.id === request.id ? data.request : req
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
      const response = await fetch(`/api/callback-requests/${request.id}/complete`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark call as completed');
      }
      
      const data = await response.json();
      
      // Update the request in the local state
      setCallbackRequests(prev => prev.map(req => 
        req.id === request.id ? data.request : req
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
                          {request.student.user.name.charAt(0)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{request.subject}</h3>
                        <p className="text-sm text-gray-500">
                          From: {request.student.user.name} • {request.student.course}, Year {request.student.year}
                        </p>
                        <p className="text-sm text-gray-500">
                          Requested: {new Date(request.requestedDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full self-start md:self-auto ${
                      getStatusColor(request.status)
                    }`}>
                      {formatStatus(request.status)}
                    </span>
                    
                    {/* Action buttons based on status */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      >
                        Details
                      </button>
                      
                      {request.status === 'PENDING' && (
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
                      
                      {request.status === 'SCHEDULED' && (
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
      
      {/* Modal implementation */}
      {/* Include the same modal implementation from the original component */}
    </div>
  );
}

// Helper functions
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
function InformationCircleIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}