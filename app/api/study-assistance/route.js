import { NextResponse } from 'next/server';
import { 
  generateSummary, 
  generateFlashcards, 
  generateQuiz, 
  generateStudyPlan 
} from '@/lib/services/openAIService';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate the request type
    if (!body.type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }
    
    let result;
    
    // Handle different study assistance types
    switch (body.type) {
      case 'summary':
        // Validate required fields for summary
        if (!body.topic && !body.content) {
          return NextResponse.json(
            { error: 'Missing required fields: topic or content' },
            { status: 400 }
          );
        }
        
        // Generate summary
        result = await generateSummary({
          topic: body.topic,
          content: body.content,
          length: body.length || 'medium',
          style: body.style || 'comprehensive',
          includeBulletPoints: body.includeBulletPoints !== false
        });
        
        return NextResponse.json({
          success: true,
          summary: result
        });
        
      case 'flashcards':
        // Validate required fields for flashcards
        if (!body.topic) {
          return NextResponse.json(
            { error: 'Missing required field: topic' },
            { status: 400 }
          );
        }
        
        // Generate flashcards
        result = await generateFlashcards({
          topic: body.topic,
          content: body.content,
          numCards: body.numCards || 10
        });
        
        return NextResponse.json({
          success: true,
          flashcards: result
        });
        
      case 'quiz':
        // Validate required fields for quiz
        if (!body.topic) {
          return NextResponse.json(
            { error: 'Missing required field: topic' },
            { status: 400 }
          );
        }
        
        // Generate quiz
        result = await generateQuiz({
          topic: body.topic,
          content: body.content,
          questionType: body.questionType || 'mixed',
          questionCount: body.questionCount || 5,
          difficulty: body.difficulty || 'medium'
        });
        
        return NextResponse.json({
          success: true,
          quiz: result
        });
        
      case 'studyPlan':
        // Validate required fields for study plan
        if (!body.topic || !body.goal) {
          return NextResponse.json(
            { error: 'Missing required fields: topic or goal' },
            { status: 400 }
          );
        }
        
        // Generate study plan
        result = await generateStudyPlan({
          topic: body.topic,
          goal: body.goal,
          timeframe: body.timeframe || '1 week',
          level: body.level || 'intermediate'
        });
        
        return NextResponse.json({
          success: true,
          studyPlan: result
        });
        
      default:
        return NextResponse.json(
          { error: 'Invalid study assistance type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating study assistance:', error);
    return NextResponse.json(
      { error: 'Failed to generate study assistance content', details: error.message },
      { status: 500 }
    );
  }
}