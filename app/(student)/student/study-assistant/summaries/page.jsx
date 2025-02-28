'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function SummaryGenerator() {
  const [student, setStudent] = useState(null);
  const [inputText, setInputText] = useState('');
  const [topic, setTopic] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryStyle, setSummaryStyle] = useState('comprehensive');
  const [includeBulletPoints, setIncludeBulletPoints] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Get student info from session storage
    const storedStudent = sessionStorage.getItem('student');
    if (!storedStudent) {
      router.push('/student-login');
      return;
    }
    
    setStudent(JSON.parse(storedStudent));
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!topic.trim() && !inputText.trim()) {
      setError('Please enter either a topic or paste content to summarize');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // The backend would then call the OpenAI API
      // const response = await axios.post('/api/study-assistance', {
      //   type: 'summary',
      //   topic,
      //   content: inputText,
      //   length: summaryLength,
      //   style: summaryStyle,
      //   includeBulletPoints
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, use mock data
      const summary = generateMockSummary();
      
      setGeneratedSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockSummary = () => {
    // This would be replaced with an actual API call in a real app
    
    if (topic.toLowerCase().includes('data structure')) {
      return {
        title: 'Data Structures - Summary',
        content: `
          <h2>Key Concepts in Data Structures</h2>
          <p>Data structures are specialized formats for organizing, processing, retrieving, and storing data. The implementation of efficient data structures is crucial for designing efficient algorithms.</p>
          
          <h3>Classification of Data Structures</h3>
          <p>Data structures can be classified into two main categories:</p>
          <ul>
            <li><strong>Linear Data Structures:</strong> Elements are arranged sequentially or linearly, where each element is attached to its previous and next adjacent elements. Examples include arrays, linked lists, stacks, and queues.</li>
            <li><strong>Non-Linear Data Structures:</strong> Elements are not arranged sequentially or linearly. Examples include trees and graphs.</li>
          </ul>
          
          <h3>Common Data Structures</h3>
          <p>Here are some of the most important data structures:</p>
          <ul>
            <li><strong>Arrays:</strong> A collection of elements stored at contiguous memory locations. The elements can be accessed randomly using indices.</li>
            <li><strong>Linked Lists:</strong> A sequence of nodes where each node contains data and a pointer to the next node. Unlike arrays, linked lists do not store elements in contiguous memory locations.</li>
            <li><strong>Stacks:</strong> A Last In First Out (LIFO) data structure where the element that is added last will be the first one to be removed.</li>
            <li><strong>Queues:</strong> A First In First Out (FIFO) data structure where the element that is added first will be the first one to be removed.</li>
            <li><strong>Trees:</strong> A hierarchical data structure consisting of nodes, with a root node and subtrees of children with a parent node.</li>
            <li><strong>Graphs:</strong> A non-linear data structure consisting of nodes (vertices) and edges that connect these nodes.</li>
            <li><strong>Hash Tables:</strong> A data structure that maps keys to values using a hash function to compute an index into an array of buckets or slots.</li>
          </ul>
          
          <h3>Time and Space Complexity</h3>
          <p>The efficiency of data structures is measured by the time and space complexity of their operations:</p>
          <ul>
            <li><strong>Time Complexity:</strong> A measure of the amount of time an algorithm takes to complete as a function of the length of the input.</li>
            <li><strong>Space Complexity:</strong> A measure of the amount of memory an algorithm requires to store data and instructions.</li>
          </ul>
          
          <h3>Choosing the Right Data Structure</h3>
          <p>The choice of data structure depends on the following factors:</p>
          <ul>
            <li>The type of operations to be performed (insertion, deletion, searching)</li>
            <li>The frequency of operations</li>
            <li>The constraints on memory and time</li>
          </ul>
          
          <h3>Advanced Data Structures</h3>
          <p>More complex data structures include:</p>
          <ul>
            <li><strong>AVL Trees:</strong> Self-balancing binary search trees</li>
            <li><strong>B-Trees:</strong> Self-balancing tree data structures</li>
            <li><strong>Heaps:</strong> Specialized tree-based structures</li>
            <li><strong>Tries:</strong> Digital search trees used for storing strings</li>
          </ul>
        `,
        wordCount: 420,
        bulletPoints: [
          'Data structures organize data for efficient access and modification',
          'Linear structures include arrays, linked lists, stacks, and queues',
          'Non-linear structures include trees and graphs',
          'Efficiency is measured by time and space complexity',
          'Choosing the right data structure depends on the operations needed'
        ]
      };
    }
    
    if (topic.toLowerCase().includes('algorithm')) {
      return {
        title: 'Algorithms - Summary',
        content: `
          <h2>Introduction to Algorithms</h2>
          <p>An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. It takes input, processes it through a sequence of well-defined steps, and produces an output.</p>
          
          <h3>Characteristics of Algorithms</h3>
          <p>A good algorithm should have the following characteristics:</p>
          <ul>
            <li><strong>Finiteness:</strong> An algorithm must terminate after a finite number of steps.</li>
            <li><strong>Definiteness:</strong> Each step must be precisely defined.</li>
            <li><strong>Input:</strong> An algorithm can have zero or more inputs.</li>
            <li><strong>Output:</strong> An algorithm should produce at least one output.</li>
            <li><strong>Effectiveness:</strong> Each step must be simple enough to be carried out.</li>
          </ul>
          
          <h3>Algorithm Design Paradigms</h3>
          <p>Several design paradigms guide the creation of algorithms:</p>
          <ul>
            <li><strong>Divide and Conquer:</strong> Breaking a problem into smaller subproblems, solving them recursively, and combining their solutions.</li>
            <li><strong>Dynamic Programming:</strong> Breaking down a problem into simpler subproblems and storing the results to avoid redundant calculations.</li>
            <li><strong>Greedy Algorithms:</strong> Making locally optimal choices at each stage with the hope of finding a global optimum.</li>
            <li><strong>Backtracking:</strong> Incrementally building a solution and abandoning it ("backtracking") when it becomes clear that the current path cannot lead to a valid solution.</li>
          </ul>
          
          <h3>Common Algorithms</h3>
          <p>Some of the most widely used algorithms include:</p>
          <ul>
            <li><strong>Sorting Algorithms:</strong> Arranging elements in a specific order (e.g., QuickSort, MergeSort, HeapSort).</li>
            <li><strong>Searching Algorithms:</strong> Finding an element in a data structure (e.g., Binary Search, Linear Search).</li>
            <li><strong>Graph Algorithms:</strong> Processing graphs (e.g., Dijkstra's algorithm, BFS, DFS).</li>
            <li><strong>String Matching Algorithms:</strong> Finding patterns in strings (e.g., KMP algorithm, Rabin-Karp algorithm).</li>
          </ul>
          
          <h3>Algorithm Analysis</h3>
          <p>The efficiency of algorithms is analyzed using:</p>
          <ul>
            <li><strong>Time Complexity:</strong> How the running time of an algorithm increases with the size of the input.</li>
            <li><strong>Space Complexity:</strong> How the memory usage of an algorithm increases with the size of the input.</li>
            <li><strong>Big O Notation:</strong> A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity.</li>
          </ul>
          
          <h3>Optimization Techniques</h3>
          <p>Algorithms can be optimized through various techniques:</p>
          <ul>
            <li>Choosing more efficient data structures</li>
            <li>Avoiding redundant computations</li>
            <li>Using memoization or caching</li>
            <li>Applying mathematical optimizations</li>
          </ul>
        `,
        wordCount: 390,
        bulletPoints: [
          'Algorithms are step-by-step procedures for solving problems',
          'Good algorithms are finite, definite, and effective',
          'Common design paradigms include divide and conquer, dynamic programming, and greedy approaches',
          'Algorithm efficiency is measured by time and space complexity',
          'Big O notation expresses how resource requirements scale with input size'
        ]
      };
    }
    
    // Default summary for any topic
    return {
      title: `${topic} - Summary`,
      content: `
        <h2>Introduction to ${topic}</h2>
        <p>${topic} is an important field of study that encompasses various concepts, methodologies, and applications. Understanding the fundamental principles of ${topic} is essential for building expertise in this area.</p>
        
        <h3>Key Concepts</h3>
        <p>The study of ${topic} involves several key concepts:</p>
        <ul>
          <li><strong>Theoretical Foundations:</strong> The basic principles and theories that form the groundwork for ${topic}.</li>
          <li><strong>Methodologies:</strong> The systematic approaches used to study and apply knowledge in ${topic}.</li>
          <li><strong>Applications:</strong> The practical implementations and real-world uses of ${topic}.</li>
        </ul>
        
        <h3>Historical Development</h3>
        <p>${topic} has evolved significantly over time, with various contributions from scholars and practitioners. The historical development provides context for understanding current practices and future directions.</p>
        
        <h3>Current Trends</h3>
        <p>Recent developments in ${topic} include:</p>
        <ul>
          <li>Integration with digital technologies</li>
          <li>Interdisciplinary approaches combining insights from multiple fields</li>
          <li>Innovative research methods and analytical frameworks</li>
        </ul>
        
        <h3>Practical Applications</h3>
        <p>${topic} finds applications in various domains, including:</p>
        <ul>
          <li>Educational settings</li>
          <li>Professional environments</li>
          <li>Research and development</li>
          <li>Policy making and implementation</li>
        </ul>
        
        <h3>Challenges and Opportunities</h3>
        <p>The field of ${topic} faces several challenges and opportunities:</p>
        <ul>
          <li><strong>Challenges:</strong> Keeping pace with rapid changes, addressing knowledge gaps, and overcoming practical limitations.</li>
          <li><strong>Opportunities:</strong> Leveraging technological advancements, fostering collaboration across disciplines, and developing innovative solutions.</li>
        </ul>
      `,
      wordCount: 250,
      bulletPoints: [
        `${topic} encompasses theoretical foundations and practical applications`,
        'Key concepts include methodologies, principles, and analytical frameworks',
        'Historical context provides understanding of current practices',
        'Integration with technology represents a significant trend',
        'Interdisciplinary approaches offer new perspectives and solutions'
      ]
    };
  };

  const startOver = () => {
    setInputText('');
    setTopic('');
    setSummaryLength('medium');
    setSummaryStyle('comprehensive');
    setIncludeBulletPoints(true);
    setGeneratedSummary(null);
    setError('');
  };

  if (!student) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Summary Generator</h1>
      
      {!generatedSummary ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Generate Summary with OpenAI</h2>
            <p className="mt-1 text-sm text-gray-500">
              Create AI-powered summaries of your study materials using OpenAI technology.
            </p>
          </div>
          
          {error && (
            <div className="mx-6 mt-4 p-4 rounded-md bg-red-50 text-red-800">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                  Topic or Subject
                </label>
                <input
                  type="text"
                  id="topic"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Data Structures, Machine Learning, World History"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Specify a topic for the summary, or paste content below.
                </p>
              </div>
              
              <div>
                <label htmlFor="inputText" className="block text-sm font-medium text-gray-700">
                  Text to Summarize (Optional)
                </label>
                <textarea
                  id="inputText"
                  rows={10}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Paste your notes, textbook excerpt, or any content you want to summarize..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="summaryLength" className="block text-sm font-medium text-gray-700">
                    Summary Length
                  </label>
                  <select
                    id="summaryLength"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={summaryLength}
                    onChange={(e) => setSummaryLength(e.target.value)}
                  >
                    <option value="short">Short (1-2 paragraphs)</option>
                    <option value="medium">Medium (3-4 paragraphs)</option>
                    <option value="long">Long (5+ paragraphs)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="summaryStyle" className="block text-sm font-medium text-gray-700">
                    Summary Style
                  </label>
                  <select
                    id="summaryStyle"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={summaryStyle}
                    onChange={(e) => setSummaryStyle(e.target.value)}
                  >
                    <option value="comprehensive">Comprehensive</option>
                    <option value="conceptual">Conceptual (Focus on key ideas)</option>
                    <option value="simplified">Simplified (Easy to understand)</option>
                    <option value="detailed">Detailed (Include examples)</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="includeBulletPoints"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={includeBulletPoints}
                  onChange={(e) => setIncludeBulletPoints(e.target.checked)}
                />
                <label htmlFor="includeBulletPoints" className="ml-2 block text-sm text-gray-700">
                  Include key takeaways as bullet points
                </label>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isGenerating || (!topic.trim() && !inputText.trim())}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Summary...
                    </>
                  ) : (
                    'Generate Summary'
                  )}
                </button>
              </div>
              
              <div className="pt-2 text-xs text-gray-500 flex items-center">
                <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Powered by OpenAI GPT technology</span>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {generatedSummary.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {generatedSummary.wordCount} words
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={startOver}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  New Summary
                </button>
                <button 
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Summary
                </button>
              </div>
            </div>
            
            <div className="px-4 py-6 sm:px-6">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: generatedSummary.content }}></div>
              
              {includeBulletPoints && generatedSummary.bulletPoints && (
                <div className="mt-8 bg-blue-50 rounded-lg p-4">
                  <h3 className="text-md font-medium text-blue-900 mb-3">Key Takeaways</h3>
                  <ul className="space-y-1">
                    {generatedSummary.bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <BulletPointIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-blue-800">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Study Tips</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Active Recall</h3>
                    <p className="text-sm text-gray-500">
                      After reading this summary, try to recall the main points without looking. This strengthens memory retention.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Connect Concepts</h3>
                    <p className="text-sm text-gray-500">
                      Try to connect these ideas with concepts you already know. Creating connections improves understanding and recall.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Generate Examples</h3>
                    <p className="text-sm text-gray-500">
                      Create your own examples for each key concept. This deepens understanding and aids application of knowledge.
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>This summary was generated using OpenAI GPT technology</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Icons
function BulletPointIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function LightBulbIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );
}