// app/api/knowledge-bases/upload/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db';
import { uploadKnowledgeBase } from '@/lib/services/blandAIService';

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

// POST /api/knowledge-bases/upload - Upload a file as a knowledge base
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Only teachers can upload knowledge bases
    if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    // This implementation depends on how file uploads are handled in your application
    // You might need a different approach based on your setup
    
    // For Next.js 13+, you'd typically use formidable or similar to handle multipart form data
    const formData = await request.formData();
    const file = formData.get('file');
    const name = formData.get('name');
    const description = formData.get('description');
    const setPrimary = formData.get('setPrimary') === 'true';
    
    if (!file || !name || !description) {
      return NextResponse.json(
        { error: 'Missing required fields: file, name, and description are required' },
        { status: 400 }
      );
    }
    
    try {
      const result = await uploadKnowledgeBase(file, name, description);
      
      // Update teacher with this knowledge base ID if requested
      if (setPrimary && result.vector_id) {
        await prisma.teacher.update({
          where: {
            id: session.user.teacherId
          },
          data: {
            knowledgeBaseId: result.vector_id
          }
        });
      }
      
      return NextResponse.json({
        message: 'Knowledge base uploaded successfully',
        knowledgeBase: result
      });
    } catch (apiError) {
      console.error('Error uploading knowledge base to Bland AI:', apiError);
      return NextResponse.json(
        { error: 'Failed to upload knowledge base' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/knowledge-bases/upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload knowledge base' },
      { status: 500 }
    );
  }
}