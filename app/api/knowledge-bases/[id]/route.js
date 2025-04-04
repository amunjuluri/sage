// app/api/knowledge-bases/[id]/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { 
  getKnowledgeBase,
  updateKnowledgeBase,
  deleteKnowledgeBase 
} from '@/lib/services/blandAIService';

// GET /api/knowledge-bases/[id] - Get a specific knowledge base
export async function GET(request, { params }) {
  try {
    const { id } = params;
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
    
    // Check if we should include text content
    const { searchParams } = new URL(request.url);
    const includeText = searchParams.get('include_text') === 'true';
    
    // Get knowledge base from Bland AI
    try {
      const knowledgeBase = await getKnowledgeBase(id, includeText);
      
      return NextResponse.json({
        knowledgeBase
      });
    } catch (apiError) {
      console.error('Error fetching knowledge base from Bland AI:', apiError);
      return NextResponse.json(
        { error: 'Failed to fetch knowledge base' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error in GET /api/knowledge-bases/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base' },
      { status: 500 }
    );
  }
}

// PATCH /api/knowledge-bases/[id] - Update a knowledge base
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only teachers can update knowledge bases
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
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
    
    // Update knowledge base in Bland AI
    try {
      const result = await updateKnowledgeBase(id, name, description, content);
      
      // Update teacher with this knowledge base ID if requested
      if (setPrimary) {
        await prisma.teacher.update({
          where: {
            id: session.user.teacherId
          },
          data: {
            knowledgeBaseId: id
          }
        });
      }
      
      return NextResponse.json({
        message: 'Knowledge base updated successfully',
        knowledgeBase: result
      });
    } catch (apiError) {
      console.error('Error updating knowledge base with Bland AI:', apiError);
      return NextResponse.json(
        { error: 'Failed to update knowledge base' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error in PATCH /api/knowledge-bases/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update knowledge base' },
      { status: 500 }
    );
  }
}

// DELETE /api/knowledge-bases/[id] - Delete a knowledge base
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only teachers can delete knowledge bases
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // Check if this is the teacher's primary knowledge base
    const teacher = await prisma.teacher.findUnique({
      where: {
        id: session.user.teacherId
      }
    });
    
    // If it's the primary knowledge base, remove it from the teacher
    if (teacher && teacher.knowledgeBaseId === id) {
      await prisma.teacher.update({
        where: {
          id: teacher.id
        },
        data: {
          knowledgeBaseId: null
        }
      });
    }
    
    // Delete knowledge base from Bland AI
    try {
      const result = await deleteKnowledgeBase(id);
      
      return NextResponse.json({
        message: 'Knowledge base deleted successfully',
        result
      });
    } catch (apiError) {
      console.error('Error deleting knowledge base with Bland AI:', apiError);
      return NextResponse.json(
        { error: 'Failed to delete knowledge base' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`Error in DELETE /api/knowledge-bases/${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete knowledge base' },
      { status: 500 }
    );
  }
}