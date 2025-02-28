// app/api/callback-requests/route.js

import { NextResponse } from 'next/server';
import { initiateCallback } from '../../../lib/services/blandAIService';
import { 
  createCallbackRequest, 
  getStudentCallbackRequests, 
  getTeacherCallbackRequests 
} from '../../../lib/data/mockData';
import { teachers, students } from '../../../lib/data/mockData';

// Named export for GET method
export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    
    let callbackRequests = [];
    
    if (studentId) {
      // Get callback requests for a specific student
      callbackRequests = getStudentCallbackRequests(studentId);
    } else if (teacherId) {
      // Get callback requests for a specific teacher
      callbackRequests = getTeacherCallbackRequests(teacherId);
    } else {
      // Get all callback requests (for admin purposes)
      return NextResponse.json(
        { error: 'Missing required parameters: studentId or teacherId' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ callbackRequests });
  } catch (error) {
    console.error('Error fetching callback requests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch callback requests' },
      { status: 500 }
    );
  }
}

// Named export for POST method
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['studentId', 'teacherId', 'subject', 'message', 'requestedDate'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate phone number if it's an immediate call
    if (body.immediateCall && !body.phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required for immediate calls' },
        { status: 400 }
      );
    }
    
    // In a real application, we would validate these IDs against a database
    const student = students.find(s => s.id === body.studentId);
    const teacher = teachers.find(t => t.id === body.teacherId);
    
    if (!student || !teacher) {
      return NextResponse.json(
        { error: 'Invalid student or teacher ID' },
        { status: 400 }
      );
    }
    
    // Create the callback request
    const result = createCallbackRequest({
      studentId: body.studentId,
      teacherId: body.teacherId,
      subject: body.subject,
      message: body.message,
      requestedDate: body.requestedDate,
      phoneNumber: body.phoneNumber, // Save phone number with the request
      immediateCall: body.immediateCall || false
    });
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to create callback request' },
        { status: 500 }
      );
    }
    
    let response = {
      success: true,
      request: result.request,
      message: 'Callback request created successfully'
    };
    
    // If immediate call is requested, initiate the call through Bland AI
    if (body.immediateCall) {
      try {
        // Add phone numbers for the call (would come from database in real app)
        const studentWithPhone = { 
          ...student,
          phoneNumber: body.phoneNumber // Use the phone number from the form
        };
        
        const teacherWithVoice = { ...teacher };
        
        // Initiate the call using Bland AI
        const callResponse = await initiateCallback(result.request, studentWithPhone, teacherWithVoice);
        
        // Update the callback request status
        result.request.status = 'scheduled';
        result.request.callId = callResponse.id;
        
        response.callId = callResponse.id;
        response.message = 'Call scheduled successfully';
      } catch (callError) {
        console.error('Error initiating immediate call:', callError);
        // Instead of failing the whole request, just note that the call couldn't be initiated
        response.callWarning = 'Request created but we could not initiate the call. Please try again later.';
        // Still mark the request as successful since it was created
        response.message = 'Callback request created, but the call could not be initiated';
      }
    }
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error creating callback request:', error);
    return NextResponse.json(
      { error: 'Failed to create callback request' },
      { status: 500 }
    );
  }
}

// Named export for PUT method
export async function PUT(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.requestId || !body.action) {
      return NextResponse.json(
        { error: 'Missing required fields: requestId or action' },
        { status: 400 }
      );
    }
    
    // Mock data for demonstration
    // In a real app, we would fetch these from a database
    const callbackRequests = getStudentCallbackRequests(body.studentId);
    const callbackRequest = callbackRequests.find(req => req.id === body.requestId);
    
    if (!callbackRequest) {
      return NextResponse.json(
        { error: 'Callback request not found' },
        { status: 404 }
      );
    }
    
    const student = students.find(s => s.id === callbackRequest.studentId);
    const teacher = teachers.find(t => t.id === callbackRequest.teacherId);
    
    if (!student || !teacher) {
      return NextResponse.json(
        { error: 'Student or teacher not found' },
        { status: 404 }
      );
    }
    
    // Add phone number from the request or student record
    const studentWithPhone = { 
      ...student, 
      phoneNumber: callbackRequest.phoneNumber || student.phoneNumber || body.phoneNumber
    };
    teacher.voiceId = teacher.voiceId || 'bland'; // Default Bland AI voice
    
    let response;
    
    // Handle different actions
    switch (body.action) {
      case 'schedule':
        // Schedule the call with Bland AI
        response = await initiateCallback(callbackRequest, studentWithPhone, teacher);
        
        // Update the callback request status (in a real app, save to database)
        callbackRequest.status = 'scheduled';
        callbackRequest.callId = response.id;
        
        return NextResponse.json({
          success: true,
          message: 'Call scheduled successfully',
          callId: response.id,
          request: callbackRequest
        });
        
      case 'cancel':
        // In a real app, we would cancel the call with Bland AI if it was scheduled
        // For this demo, just update the status
        callbackRequest.status = 'cancelled';
        
        return NextResponse.json({
          success: true,
          message: 'Callback request cancelled',
          request: callbackRequest
        });
        
      case 'complete':
        // Mark the callback as completed
        callbackRequest.status = 'completed';
        
        return NextResponse.json({
          success: true,
          message: 'Callback request marked as completed',
          request: callbackRequest
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error updating callback request:', error);
    return NextResponse.json(
      { error: 'Failed to update callback request' },
      { status: 500 }
    );
  }
}