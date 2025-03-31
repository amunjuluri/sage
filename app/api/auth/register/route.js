// app/api/auth/register/route.js

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/db';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, password, role, course, year, department, expertise, phoneNumber } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with role-specific data
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        phoneNumber,
        ...(role === 'student' && {
          student: {
            create: {
              course,
              year: parseInt(year),
            },
          },
        }),
        ...(role === 'teacher' && {
          teacher: {
            create: {
              department,
              expertise: Array.isArray(expertise) ? expertise : [expertise],
              voiceId: 'bland_male_1', // Default voice ID
            },
          },
        }),
      },
      include: {
        student: role === 'student',
        teacher: role === 'teacher',
      },
    });

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}