// app/api/callback-requests/[id]/schedule/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { initiateCallback } from '@/lib/services/blandAIService';

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only teachers can schedule calls
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get the callback request
    const callbackRequest = await prisma.callbackRequest.findUnique({
      where: {
        id,
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
        teacher: {
          include: {
            user: true,
          },
        },
      },
    });
    
    if (!callbackRequest) {
      return NextResponse.json(
        { error: 'Callback request not found' },
        { status: 404 }
      );
    }
    
    // Verify that the teacher is assigned to this request
    if (session.user.role === 'TEACHER' && session.user.teacherId !== callbackRequest.teacherId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Format data for Bland AI
    const studentWithPhone = { 
      ...callbackRequest.student,
      name: callbackRequest.student.user.name,
      phoneNumber: callbackRequest.phoneNumber || callbackRequest.student.user.phoneNumber
    };
    
    const teacherWithVoice = { 
      ...callbackRequest.teacher,
      name: callbackRequest.teacher.user.name
    };
    
    // Initiate the call using Bland AI
    const callResponse = await initiateCallback(callbackRequest, studentWithPhone, teacherWithVoice);
    
    // Update the callback request status
    const updatedRequest = await prisma.callbackRequest.update({
      where: {
        id,
      },
      data: {
        status: 'SCHEDULED',
        callId: callResponse.id,
        scheduledDate: new Date(),
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        teacher: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json({
      message: 'Call scheduled successfully',
      callId: callResponse.id,
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Error scheduling call:', error);
    return NextResponse.json(
      { error: 'Failed to schedule call' },
      { status: 500 }
    );
  }
}