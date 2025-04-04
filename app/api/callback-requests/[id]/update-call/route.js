// app/api/callback-requests/[id]/update-call/route.js

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
    
    // Get the request body with call ID
    const data = await request.json();
    const { callId } = data;
    
    if (!callId) {
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
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
    
    // Only allow updates to callback requests by the associated student or teacher
    if (
      (session.user.role === 'STUDENT' && session.user.studentId !== callbackRequest.studentId) &&
      (session.user.role === 'TEACHER' && session.user.teacherId !== callbackRequest.teacherId) &&
      (session.user.role !== 'ADMIN')
    ) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Update the callback request with the call ID
    const updatedRequest = await prisma.callbackRequest.update({
      where: {
        id,
      },
      data: {
        callId,
        // Also ensure status is set to SCHEDULED
        status: 'SCHEDULED',
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
      message: 'Call ID updated successfully',
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Error updating call ID:', error);
    
    return NextResponse.json(
      { error: 'Failed to update call ID' },
      { status: 500 }
    );
  }
}