// app/api/bland-ai/calls/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Replace with your actual Bland AI API key
const BLAND_AI_API_KEY = process.env.BLAND_AI_API_KEY || 'your_bland_ai_api_key';

/**
 * API route handler to create a Bland AI call
 */
export async function POST(request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const callData = await request.json();
    
    // Ensure phone number is provided
    if (!callData.phone_number) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    // Ensure task is provided
    if (!callData.task) {
      return NextResponse.json(
        { error: 'Task is required' },
        { status: 400 }
      );
    }
    
    // Make API call to Bland AI
    const response = await fetch('https://api.bland.ai/v1/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BLAND_AI_API_KEY}`
      },
      body: JSON.stringify({
        phone_number: callData.phone_number,
        task: callData.task,
        first_sentence: callData.first_sentence,
        wait_for_greeting: callData.wait_for_greeting !== false,
        language: callData.language || "en-US",
        reduce_latency: callData.reduce_latency !== false,
        record: callData.record === true,
        max_duration: callData.max_duration || 20,
        
        // Additional optional parameters
        voicemail_message: callData.voicemail_message,
        interruption_threshold: callData.interruption_threshold,
        voice: callData.voice,
        model: callData.model || "base",
        temperature: callData.temperature || 0.7,
        
        // Metadata to identify the caller in our system
        metadata: {
          user_id: session.user.id,
          role: session.user.role,
          callback_request_id: callData.callbackRequestId
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Bland AI API error:', errorData);
      
      return NextResponse.json(
        { error: 'Failed to initiate call with Bland AI', details: errorData },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return the response from Bland AI
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating Bland AI call:', error);
    
    return NextResponse.json(
      { error: 'Failed to create call', details: error.message },
      { status: 500 }
    );
  }
}