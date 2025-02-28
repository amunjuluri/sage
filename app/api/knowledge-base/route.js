import { NextResponse } from 'next/server';
import { 
  createKnowledgeBase, 
  uploadDocumentToKnowledgeBase, 
  getKnowledgeBases, 
  getKnowledgeBaseDocuments, 
  queryKnowledgeBase 
} from '@/lib/services/blandAIService';

// Get knowledge bases or specific knowledge base documents
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const knowledgeBaseId = searchParams.get('id');
    
    if (knowledgeBaseId) {
      // Get documents for a specific knowledge base
      const documents = await getKnowledgeBaseDocuments(knowledgeBaseId);
      return NextResponse.json({ documents });
    } else {
      // Get all knowledge bases
      const knowledgeBases = await getKnowledgeBases();
      return NextResponse.json({ knowledgeBases });
    }
  } catch (error) {
    console.error('Error fetching knowledge base data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch knowledge base data', details: error.message },
      { status: 500 }
    );
  }
}

// Create a new knowledge base
export async function POST(request) {
  try {
    // For multipart/form-data (file uploads)
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const knowledgeBaseId = formData.get('knowledgeBaseId');
      const file = formData.get('file');
      const documentName = formData.get('name') || file.name;
      
      if (!knowledgeBaseId || !file) {
        return NextResponse.json(
          { error: 'Missing required fields: knowledgeBaseId or file' },
          { status: 400 }
        );
      }
      
      // Upload document to knowledge base
      const result = await uploadDocumentToKnowledgeBase(knowledgeBaseId, file, documentName);
      
      return NextResponse.json({
        success: true,
        document: result
      });
    } 
    // For JSON requests (creating knowledge base or querying)
    else {
      const body = await request.json();
      
      // Check if this is a query request
      if (body.query && body.knowledgeBaseId) {
        // Query the knowledge base
        const results = await queryKnowledgeBase(body.knowledgeBaseId, body.query);
        
        return NextResponse.json({
          success: true,
          results
        });
      } 
      // Otherwise, create a new knowledge base
      else if (body.name) {
        // Validate required fields
        if (!body.name) {
          return NextResponse.json(
            { error: 'Missing required field: name' },
            { status: 400 }
          );
        }
        
        // Create knowledge base
        const result = await createKnowledgeBase(body.name, body.description || '');
        
        return NextResponse.json({
          success: true,
          knowledgeBase: result
        });
      } else {
        return NextResponse.json(
          { error: 'Invalid request format' },
          { status: 400 }
        );
      }
    }
  } catch (error) {
    console.error('Error handling knowledge base request:', error);
    return NextResponse.json(
      { error: 'Failed to process knowledge base request', details: error.message },
      { status: 500 }
    );
  }
}

// Update an existing document or knowledge base (not implemented in Bland AI API example)
export async function PUT(request) {
  try {
    const body = await request.json();
    
    // This would be implemented based on the Bland AI API capabilities
    // For now, return a placeholder response
    
    return NextResponse.json(
      { message: 'Knowledge base update endpoint not implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error updating knowledge base:', error);
    return NextResponse.json(
      { error: 'Failed to update knowledge base', details: error.message },
      { status: 500 }
    );
  }
}

// Delete a knowledge base or document (not implemented in Bland AI API example)
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const knowledgeBaseId = searchParams.get('id');
    const documentId = searchParams.get('documentId');
    
    // This would be implemented based on the Bland AI API capabilities
    // For now, return a placeholder response
    
    return NextResponse.json(
      { message: 'Knowledge base deletion endpoint not implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Error deleting knowledge base content:', error);
    return NextResponse.json(
      { error: 'Failed to delete knowledge base content', details: error.message },
      { status: 500 }
    );
  }
}