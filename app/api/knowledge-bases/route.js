// app/api/knowledge-bases/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { 
  createKnowledgeBase, 
  listKnowledgeBases, 
  uploadKnowledgeBase 
} from '@/lib/services/blandAIService';

// GET /api/knowledge-bases - List all knowledge bases for the teacher
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only teachers can access knowledge bases
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get teacher data
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: session.user.teacherId
      }
    });
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Check if we should include text content
    const { searchParams } = new URL(request.url);
    const includeText = searchParams.get('include_text') === 'true';
    
    // Get all knowledge bases from Bland AI
    try {
      const knowledgeBasesResponse = await listKnowledgeBases(includeText);
      
      // If teacher already has a knowledge base assigned, find it
      let primaryKnowledgeBase = null;
      if (teacher.knowledgeBaseId && knowledgeBasesResponse.vectors) {
        primaryKnowledgeBase = knowledgeBasesResponse.vectors.find(
          kb => kb.vector_id === teacher.knowledgeBaseId
        );
      }
      
      return NextResponse.json({
        knowledgeBases: knowledgeBasesResponse.vectors || [],
        primaryKnowledgeBase
      });
    } catch (apiError) {
      console.error('Error fetching knowledge bases from Bland AI:', apiError);
      return NextResponse.json(
        { error: 'Failed to fetch knowledge bases' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/knowledge-bases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge bases' },
      { status: 500 }
    );
  }
}

// POST /api/knowledge-bases - Create a new knowledge base
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only teachers can create knowledge bases
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Get the teacher
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: session.user.teacherId
      }
    });
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Get data from request
    const data = await request.json();
    const { name, description, content, setPrimary } = data;
    
    // Validate required fields
    if (!name || !description || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, and content are required' },
        { status: 400 }
      );
    }
    
    // Create knowledge base in Bland AI
    try {
      const result = await createKnowledgeBase(name, description, content);
      
      // Update teacher with the new knowledge base ID if requested
      if (setPrimary && result.vector_id) {
        await prisma.teacher.update({
          where: {
            id: teacher.id
          },
          data: {
            knowledgeBaseId: result.vector_id
          }
        });
      }
      
      return NextResponse.json({
        message: 'Knowledge base created successfully',
        knowledgeBase: result
      });
    } catch (apiError) {
      console.error('Error creating knowledge base with Bland AI:', apiError);
      return NextResponse.json(
        { error: 'Failed to create knowledge base' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/knowledge-bases:', error);
    return NextResponse.json(
      { error: 'Failed to create knowledge base' },
      { status: 500 }
    );
  }
}