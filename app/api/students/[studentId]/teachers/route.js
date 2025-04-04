// app/api/students/[studentId]/teachers/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { studentId } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only allow the student to access their own assigned teachers
    if (session.user.role === 'STUDENT' && session.user.studentId !== studentId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get all teachers assigned to this student
    const assignments = await prisma.studentTeacher.findMany({
      where: {
        studentId,
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
    
    // Format the response
    const teachers = assignments.map(assignment => assignment.teacher);
    
    return NextResponse.json({ teachers });
  } catch (error) {
    console.error('Error fetching assigned teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned teachers' },
      { status: 500 }
    );
  }
}

// Also allow adding a teacher to a student
export async function POST(request, { params }) {
  try {
    const { studentId } = params;
    const session = await getServerSession(authOptions);
    
    // Only admin or teachers can assign teachers to students
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'TEACHER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    const { teacherId } = data;
    
    if (!teacherId) {
      return NextResponse.json(
        { error: 'Teacher ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the assignment already exists
    const existingAssignment = await prisma.studentTeacher.findFirst({
      where: {
        studentId,
        teacherId,
      },
    });
    
    if (existingAssignment) {
      return NextResponse.json(
        { error: 'Teacher is already assigned to this student' },
        { status: 400 }
      );
    }
    
    // Create the assignment
    const assignment = await prisma.studentTeacher.create({
      data: {
        student: {
          connect: {
            id: studentId,
          },
        },
        teacher: {
          connect: {
            id: teacherId,
          },
        },
      },
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        student: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    
    return NextResponse.json({
      message: `${assignment.teacher.user.name} has been assigned to ${assignment.student.user.name}`,
      assignment,
    }, { status: 201 });
  } catch (error) {
    console.error('Error assigning teacher to student:', error);
    return NextResponse.json(
      { error: 'Failed to assign teacher to student' },
      { status: 500 }
    );
  }
}