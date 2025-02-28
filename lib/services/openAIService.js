import axios from 'axios';

// This would be stored in environment variables in a real application
const OPENAI_API_KEY = 'your_openai_api_key';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

// Create axios instance with base URL and headers
const openAIClient = axios.create({
  baseURL: OPENAI_BASE_URL,
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

/**
 * Generate a summary of a topic or content using OpenAI
 * @param {Object} options - Summary generation options
 * @param {string} options.topic - Topic to summarize
 * @param {string} options.content - Content to summarize (optional)
 * @param {string} options.length - Desired length (short, medium, long)
 * @param {string} options.style - Summary style (comprehensive, conceptual, simplified, detailed)
 * @param {boolean} options.includeBulletPoints - Whether to include bullet points
 * @returns {Promise<Object>} - Generated summary
 */
export const generateSummary = async (options) => {
  try {
    const { topic, content, length, style, includeBulletPoints } = options;
    
    // Define length parameters
    const lengthParams = {
      short: 'approximately 150-250 words',
      medium: 'approximately 300-500 words',
      long: 'approximately 600-800 words'
    };
    
    // Define style parameters
    const styleParams = {
      comprehensive: 'covering all important aspects of the topic',
      conceptual: 'focusing on key concepts and ideas',
      simplified: 'using simple language and explanations',
      detailed: 'including examples and detailed explanations'
    };
    
    // Construct the prompt
    let prompt = `Generate a ${lengthParams[length] || 'medium-length'} summary about "${topic}" ${styleParams[style] || 'covering all important aspects of the topic'}.`;
    
    // If content is provided, include it
    if (content) {
      prompt += ` Base the summary on the following content:\n\n${content}\n\n`;
    }
    
    // Add formatting instructions
    prompt += ` Structure the summary with clear headings and subheadings. Format the response as HTML with <h2>, <h3>, <p>, and <ul>/<li> tags.`;
    
    // Request bullet points if needed
    if (includeBulletPoints) {
      prompt += ` Also include a list of 5-7 key takeaways as bullet points at the end.`;
    }
    
    const response = await openAIClient.post('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an educational assistant that creates well-structured, informative summaries for students. Use academic language but keep it accessible. Include relevant concepts, principles, and examples.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    // Extract content from response
    const summaryContent = response.data.choices[0].message.content;
    
    // Count words in the summary (rough estimate)
    const wordCount = summaryContent.split(/\s+/).length;
    
    // Extract bullet points if included
    let bulletPoints = [];
    if (includeBulletPoints) {
      // Simple extraction of bullet points using regex
      // A more robust solution would use HTML parsing
      const bulletPointMatch = summaryContent.match(/<li>(.*?)<\/li>/g);
      if (bulletPointMatch) {
        bulletPoints = bulletPointMatch
          .map(item => item.replace(/<li>(.*?)<\/li>/, '$1'))
          .filter(item => item.length > 10)
          .slice(0, 7);
      }
    }
    
    return {
      title: `${topic} - Summary`,
      content: summaryContent,
      wordCount,
      bulletPoints
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};

/**
 * Generate flashcards for a topic or content using OpenAI
 * @param {Object} options - Flashcard generation options
 * @param {string} options.topic - Topic for flashcards
 * @param {string} options.content - Content to generate flashcards from (optional)
 * @param {number} options.numCards - Number of flashcards to generate
 * @returns {Promise<Array>} - Array of flashcard objects
 */
export const generateFlashcards = async (options) => {
  try {
    const { topic, content, numCards } = options;
    
    // Construct the prompt
    let prompt = `Generate ${numCards} flashcards about "${topic}". Each flashcard should have a clear question on one side and a concise, informative answer on the other.`;
    
    // If content is provided, include it
    if (content) {
      prompt += ` Generate these flashcards based on the following content:\n\n${content}\n\n`;
    }
    
    // Add formatting instructions
    prompt += ` Format the output as a JSON array of objects, where each object has a "question" field and an "answer" field. Ensure the questions test understanding rather than just recall. For more complex topics, include a mix of definitional, conceptual, and application questions.`;
    
    const response = await openAIClient.post('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an educational assistant that creates effective flashcards for students. Create clear questions and concise but comprehensive answers. Focus on the most important concepts and information.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });
    
    // Extract and parse the JSON response
    const responseContent = response.data.choices[0].message.content;
    const flashcardsData = JSON.parse(responseContent);
    
    // Format the response
    return flashcardsData.flashcards.map((card, index) => ({
      id: index + 1,
      question: card.question,
      answer: card.answer
    }));
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw error;
  }
};

/**
 * Generate a quiz for a topic or content using OpenAI
 * @param {Object} options - Quiz generation options
 * @param {string} options.topic - Topic for the quiz
 * @param {string} options.content - Content to generate quiz from (optional)
 * @param {string} options.questionType - Type of questions (multipleChoice, trueFalse, shortAnswer, mixed)
 * @param {number} options.questionCount - Number of questions
 * @param {string} options.difficulty - Difficulty level (easy, medium, hard)
 * @returns {Promise<Object>} - Quiz object with questions
 */
export const generateQuiz = async (options) => {
  try {
    const { topic, content, questionType, questionCount, difficulty } = options;
    
    // Determine types of questions to include
    let questionTypes = [];
    if (questionType === 'mixed') {
      questionTypes = ['multipleChoice', 'trueFalse', 'shortAnswer'];
    } else {
      questionTypes = [questionType];
    }
    
    // Construct the prompt
    let prompt = `Generate a ${difficulty} difficulty quiz about "${topic}" with ${questionCount} questions.`;
    
    // If content is provided, include it
    if (content) {
      prompt += ` Base the quiz on the following content:\n\n${content}\n\n`;
    }
    
    // Specify question types
    prompt += ` Include the following types of questions: ${questionTypes.join(', ')}.`;
    
    // Add difficulty-specific instructions
    if (difficulty === 'easy') {
      prompt += ' Focus on basic concepts and definitions. Questions should be straightforward.';
    } else if (difficulty === 'medium') {
      prompt += ' Include a mix of basic and more complex concepts. Some questions should require deeper understanding.';
    } else if (difficulty === 'hard') {
      prompt += ' Focus on complex concepts, application of knowledge, and critical thinking. Questions should be challenging.';
    }
    
    // Add formatting instructions
    prompt += ` Format the output as a JSON object with a 'questions' array. Each question object should have:
    - 'id': unique number
    - 'type': one of '${questionTypes.join("', '")}'
    - 'question': the text of the question
    - For multipleChoice questions, include an 'options' array with 4 options and a 'correctAnswer' field with the index of the correct option (0-3)
    - For trueFalse questions, include a 'correctAnswer' field with true or false
    - For shortAnswer questions, include a 'correctAnswer' field with the expected answer`;
    
    const response = await openAIClient.post('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an educational assistant that creates effective quizzes for students. Create clear, concise questions that test understanding of the material. Provide accurate answers and, for multiple choice questions, plausible but incorrect options.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });
    
    // Extract and parse the JSON response
    const responseContent = response.data.choices[0].message.content;
    const quizData = JSON.parse(responseContent);
    
    // Calculate a time limit based on difficulty and question count
    const timeLimit = calculateTimeLimit(difficulty, questionCount, questionTypes);
    
    // Format the response
    return {
      id: `quiz_${Date.now()}`,
      title: `Quiz on ${topic}`,
      timeLimit,
      questions: quizData.questions,
      created: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

/**
 * Calculate a recommended time limit for a quiz
 * @param {string} difficulty - Difficulty level
 * @param {number} questionCount - Number of questions
 * @param {Array} questionTypes - Types of questions included
 * @returns {number} - Time limit in minutes
 */
const calculateTimeLimit = (difficulty, questionCount, questionTypes) => {
  // Base time per question type (in minutes)
  const baseTimePerQuestion = {
    multipleChoice: 1,
    trueFalse: 0.5,
    shortAnswer: 2
  };
  
  // Difficulty multipliers
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.25,
    hard: 1.5
  };
  
  // If it's mixed, calculate an average
  if (questionTypes.length > 1) {
    // Calculate average time per question
    const avgTimePerQuestion = questionTypes.reduce(
      (sum, type) => sum + baseTimePerQuestion[type],
      0
    ) / questionTypes.length;
    
    // Apply difficulty multiplier and calculate total time
    return Math.ceil(avgTimePerQuestion * questionCount * difficultyMultiplier[difficulty]);
  } else {
    // Single question type
    return Math.ceil(baseTimePerQuestion[questionTypes[0]] * questionCount * difficultyMultiplier[difficulty]);
  }
};

/**
 * Generate a study plan for a topic using OpenAI
 * @param {Object} options - Study plan options
 * @param {string} options.topic - Topic for the study plan
 * @param {string} options.goal - Student's learning goal
 * @param {string} options.timeframe - Timeframe for studying (e.g., "1 week", "1 month")
 * @param {string} options.level - Student's current knowledge level (beginner, intermediate, advanced)
 * @returns {Promise<Object>} - Study plan
 */
export const generateStudyPlan = async (options) => {
  try {
    const { topic, goal, timeframe, level } = options;
    
    // Construct the prompt
    const prompt = `Create a comprehensive study plan for learning about "${topic}". The student's goal is: "${goal}". They have ${timeframe} to study and their current knowledge level is ${level}. Include recommended resources, key concepts to focus on, and a day-by-day or week-by-week schedule.`;
    
    const response = await openAIClient.post('/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an educational advisor that creates personalized study plans. Consider different learning styles, include diverse resources, and create realistic schedules. Focus on efficient and effective learning strategies.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    // Extract content from response
    const planContent = response.data.choices[0].message.content;
    
    return {
      title: `Study Plan: ${topic}`,
      content: planContent,
      topic,
      goal,
      timeframe,
      level,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
};