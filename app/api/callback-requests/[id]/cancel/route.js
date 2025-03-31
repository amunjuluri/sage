// app/api/callback-requests/[id]/cancel/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

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
    
    // Get the callback request
    const callbackRequest = await prisma.callbackRequest.findUnique({
      where: {
        id,
      },
    });
    
    if (!callbackRequest) {
      return NextResponse.json(
        { error: 'Callback request not found' },
        { status: 404 }
      );
    }
    
    // Verify permissions - student can cancel their own requests, teachers their assigned requests
    if (
      session.user.role === 'STUDENT' && 
      session.user.studentId !== callbackRequest.studentId
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    if (
      session.user.role === 'TEACHER' && 
      session.user.teacherId !== callbackRequest.teacherId
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update the callback request status
    const updatedRequest = await prisma.callbackRequest.update({
      where: {
        id,
      },
      data: {
        status: 'CANCELLED',
        cancelledReason: 'Cancelled by ' + (session.user.role === 'STUDENT' ? 'student' : 'teacher'),
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
      message: 'Callback request cancelled',
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Error cancelling callback request:', error);
    return NextResponse.json(
      { error: 'Failed to cancel callback request' },
      { status: 500 }
    );
  }
}