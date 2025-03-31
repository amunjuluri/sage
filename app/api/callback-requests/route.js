// app/api/callback-requests/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { initiateCallback } from '@/lib/services/blandAIService';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const teacherId = searchParams.get('teacherId');
    
    let callbackRequests = [];
    
    if (studentId) {
      // Verify the student is the logged-in user or the user is a teacher
      if (session.user.role !== 'ADMIN' && 
          session.user.role !== 'TEACHER' && 
          session.user.studentId !== studentId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
      
      callbackRequests = await prisma.callbackRequest.findMany({
        where: {
          studentId,
        },
        include: {
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else if (teacherId) {
      // Verify the teacher is the logged-in user
      if (session.user.role !== 'ADMIN' && 
          session.user.role !== 'TEACHER' || 
          (session.user.role === 'TEACHER' && session.user.teacherId !== teacherId)) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
      
      callbackRequests = await prisma.callbackRequest.findMany({
        where: {
          teacherId,
        },
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phoneNumber: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Admin can see all requests
      if (session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        );
      }
      
      callbackRequests = await prisma.callbackRequest.findMany({
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          },
          teacher: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
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

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['teacherId', 'subject', 'message', 'requestedDate'];
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
    
    // Get student data
    const student = await prisma.student.findUnique({
      where: {
        id: session.user.studentId,
      },
      include: {
        user: true,
      }
    });
    
    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }
    
    // Get teacher data
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: body.teacherId,
      },
      include: {
        user: true,
      }
    });
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Create the callback request
    let callbackRequest = await prisma.callbackRequest.create({
      data: {
        subject: body.subject,
        message: body.message,
        requestedDate: new Date(body.requestedDate),
        phoneNumber: body.phoneNumber || student.user.phoneNumber,
        status: 'PENDING',
        student: {
          connect: {
            id: student.id,
          }
        },
        teacher: {
          connect: {
            id: teacher.id,
          }
        },
      },
    });
    
    let response = {
      success: true,
      request: callbackRequest,
      message: 'Callback request created successfully'
    };
    
    // If immediate call is requested, initiate the call through Bland AI
    if (body.immediateCall) {
      try {
        // Format data for Bland AI
        const studentWithPhone = { 
          ...student,
          name: student.user.name,
          phoneNumber: body.phoneNumber || student.user.phoneNumber
        };
        
        const teacherWithVoice = { 
          ...teacher,
          name: teacher.user.name
        };
        
        // Initiate the call using Bland AI
        const callResponse = await initiateCallback(callbackRequest, studentWithPhone, teacherWithVoice);
        
        // Update the callback request status
        callbackRequest = await prisma.callbackRequest.update({
          where: {
            id: callbackRequest.id,
          },
          data: {
            status: 'SCHEDULED',
            callId: callResponse.id,
          }
        });
        
        response.callId = callResponse.id;
        response.message = 'Call scheduled successfully';
        response.request = callbackRequest;
      } catch (callError) {
        console.error('Error initiating immediate call:', callError);
        response.callWarning = 'Request created but we could not initiate the call. Please try again later.';
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