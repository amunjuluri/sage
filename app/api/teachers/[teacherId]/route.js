// app/api/teachers/[teacherId]/knowledge-base/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const teacherId = params.teacherId;
    
    // Fetch the teacher data
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        knowledgeBases: {
          where: { isPrimary: true },
          take: 1,
        },
      },
    });
    
    if (!teacher) {
      return NextResponse.json(
        { error: 'Teacher not found' },
        { status: 404 }
      );
    }
    
    // Get primary knowledge base
    let knowledgeBase = null;
    
    if (teacher.knowledgeBases && teacher.knowledgeBases.length > 0) {
      knowledgeBase = teacher.knowledgeBases[0];
    } else {
      // If no primary knowledge base found, fetch any knowledge base owned by the teacher
      const anyKnowledgeBase = await prisma.knowledgeBase.findFirst({
        where: { teacherId: teacherId }
      });
      
      if (anyKnowledgeBase) {
        knowledgeBase = anyKnowledgeBase;
      } else {
        // If no knowledge base exists, create a default one
        knowledgeBase = await prisma.knowledgeBase.create({
          data: {
            name: `${teacher.user.name}'s Knowledge Base`,
            description: `Default knowledge base for ${teacher.user.name}`,
            teacherId: teacherId,
            isPrimary: true,
            blandAiKnowledgeBaseId: `kb_${teacherId}_default_${Date.now()}`, // This would be the actual Bland AI KB ID in production
          }
        });
      }
    }
    
    // For development environments, use mock data
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        id: knowledgeBase?.blandAiKnowledgeBaseId || `kb_${teacherId}_default`,
        name: knowledgeBase?.name || `${teacher.user.name}'s Knowledge Base`,
        description: knowledgeBase?.description || `Default knowledge base for ${teacher.user.name}`,
        documentCount: knowledgeBase?.documentCount || 0
      });
    }
    
    return NextResponse.json({
      id: knowledgeBase.blandAiKnowledgeBaseId,
      name: knowledgeBase.name,
      description: knowledgeBase.description,
      documentCount: knowledgeBase.documentCount || 0
    });
    
  } catch (error) {
    console.error('Error fetching teacher knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teacher knowledge base' },
      { status: 500 }
    );
  }
}