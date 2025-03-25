"use client"
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, Award, BookCopy, ArrowRight, Brain, Library, BarChart, Zap, ChevronLeft, ChevronRight, CheckCircle2, X, PlusCircle, Lightbulb } from 'lucide-react';

const StudyAssistant = () => {
  const [activeFlashcard, setActiveFlashcard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  
  // Sample data - would come from your database in a real app
  const courses = [
    { id: 1, name: "Computer Science", progress: 68, color: "bg-blue-500" },
    { id: 2, name: "Mathematics", progress: 42, color: "bg-emerald-500" },
    { id: 3, name: "Physics", progress: 85, color: "bg-purple-500" }
  ];
  
  const flashcards = [
    { id: 1, question: "What is Big O Notation?", answer: "Big O notation is used to describe the performance or complexity of an algorithm, specifically the worst-case scenario." },
    { id: 2, question: "What is the definition of a function in mathematics?", answer: "A function is a relation between a set of inputs and a set of outputs, where each input is related to exactly one output." },
    { id: 3, question: "What is Newton's First Law of Motion?", answer: "An object at rest stays at rest, and an object in motion stays in motion with the same speed and direction unless acted upon by an external force." }
  ];
  
  const quizQuestions = [
    { 
      id: 1, 
      question: "Which of the following has O(1) time complexity?", 
      options: [
        "Binary search in a sorted array", 
        "Array element access by index", 
        "Finding an element in an unsorted array", 
        "Merge sort algorithm"
      ],
      correctAnswer: 1
    },
    { 
      id: 2, 
      question: "What is the derivative of f(x) = x²?", 
      options: [
        "f'(x) = x", 
        "f'(x) = 2x", 
        "f'(x) = 2", 
        "f'(x) = x³"
      ],
      correctAnswer: 1
    }
  ];
  
  const summaries = [
    {
      id: 1,
      title: "Data Structures - Week 3",
      description: "Binary Trees and Tree Traversal",
      content: "Binary trees are hierarchical data structures where each node has at most two children. The three main types of tree traversal are: in-order, pre-order, and post-order. Each offers different ways to visit all nodes in the tree. Binary search trees allow for efficient searching, insertion, and deletion operations with an average time complexity of O(log n)."
    },
    {
      id: 2,
      title: "Calculus - Integrals",
      description: "Definite and Indefinite Integrals",
      content: "Integration is the process of finding the area under a curve. Indefinite integrals represent a family of functions whose derivatives equal the integrand. Definite integrals provide the exact area between the curve and the x-axis within specified bounds. Key techniques include substitution, integration by parts, and partial fractions."
    }
  ];
  
  const handleNextFlashcard = () => {
    setActiveFlashcard((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };
  
  const handlePrevFlashcard = () => {
    setActiveFlashcard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };
  
  const [selectedOptions, setSelectedOptions] = useState({});
  
  const handleOptionSelect = (questionId, optionIndex) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionIndex
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuizQuestion > 0) {
      setCurrentQuizQuestion(currentQuizQuestion - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Assistant</h1>
        <p className="text-gray-600">Your personalized learning companion</p>
      </header>
      
      {/* Recent Activity and Stats Section */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Study Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold">42.5</h3>
                <p className="ml-1 text-gray-500">hours</p>
              </div>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <span>↑ 8% from last week</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Flashcards Mastered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold">147</h3>
                <p className="ml-1 text-gray-500">cards</p>
              </div>
              <div className="flex items-center mt-1 text-green-600 text-sm">
                <span>↑ 12 cards this week</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Quiz Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline">
                <h3 className="text-2xl font-bold">78.3%</h3>
              </div>
              <div className="flex items-center mt-1 text-amber-600 text-sm">
                <span>↓ 2.1% from last attempt</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map(course => (
            <Card key={course.id} className="overflow-hidden border-t-4" style={{ borderTopColor: course.color.replace('bg-', '').includes('blue') ? '#3b82f6' : course.color.includes('emerald') ? '#10b981' : '#a855f7' }}>
              <CardHeader className="pb-3">
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>
                  <div className="flex justify-between items-center">
                    <span>Overall progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-1">
                <Progress value={course.progress} className="h-2" />
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  Continue Learning <ArrowRight size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Main Study Tools Tabs Section */}
      <Tabs defaultValue="flashcards" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Brain size={16} /> Flashcards
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <Zap size={16} /> Quizzes
          </TabsTrigger>
          <TabsTrigger value="summaries" className="flex items-center gap-2">
            <BookCopy size={16} /> Summaries
          </TabsTrigger>
        </TabsList>
        
        {/* Flashcards Tab Content */}
        <TabsContent value="flashcards" className="pt-2">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Study Flashcards</h2>
            <p className="text-gray-600">Master key concepts through active recall</p>
          </div>
          
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 h-64 flex flex-col">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <Badge variant="outline" className="px-3 py-1">
                  Card {activeFlashcard + 1} of {flashcards.length}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Lightbulb size={16} className="mr-1" /> Hint
                  </Button>
                </div>
              </div>
              
              <div className="flex-grow p-6 flex flex-col justify-center">
                {showAnswer ? (
                  <p className="text-gray-800">{flashcards[activeFlashcard].answer}</p>
                ) : (
                  <p className="text-gray-800 font-medium">{flashcards[activeFlashcard].question}</p>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 border-t flex justify-between">
                <Button onClick={handlePrevFlashcard} variant="outline" size="sm">
                  <ChevronLeft size={16} className="mr-1" /> Previous
                </Button>
                
                <Button 
                  onClick={() => setShowAnswer(!showAnswer)} 
                  variant={showAnswer ? "outline" : "default"} 
                  size="sm"
                >
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </Button>
                
                <Button onClick={handleNextFlashcard} variant="outline" size="sm">
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <Button variant="secondary" size="sm">
                <PlusCircle size={16} className="mr-2" /> Create New Card
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Mark as Difficult
                </Button>
                <Button variant="default" size="sm">
                  Mark as Mastered
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mastered</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Learning</span>
                      <span className="text-sm font-medium">24%</span>
                    </div>
                    <Progress value={24} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Difficult</span>
                      <span className="text-sm font-medium">8%</span>
                    </div>
                    <Progress value={8} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Study Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Next Review</p>
                        <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <BookOpen size={18} className="text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Cards Due</p>
                        <p className="text-sm text-gray-600">24 cards to review</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Award size={18} className="text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Current Streak</p>
                        <p className="text-sm text-gray-600">7 days</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Quizzes Tab Content */}
        <TabsContent value="quizzes" className="pt-2">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Practice Quizzes</h2>
            <p className="text-gray-600">Test your knowledge and track progress</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <Badge variant="outline" className="px-3 py-1">
                  Question {currentQuizQuestion + 1} of {quizQuestions.length}
                </Badge>
                <Progress value={(currentQuizQuestion + 1) / quizQuestions.length * 100} className="h-2 w-32" />
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">{quizQuestions[currentQuizQuestion].question}</h3>
                
                <div className="space-y-3">
                  {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                    <div 
                      key={index}
                      onClick={() => handleOptionSelect(quizQuestions[currentQuizQuestion].id, index)}
                      className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedOptions[quizQuestions[currentQuizQuestion].id] === index 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                          selectedOptions[quizQuestions[currentQuizQuestion].id] === index 
                            ? 'bg-blue-500 text-white' 
                            : 'border border-gray-300'
                        }`}>
                          {selectedOptions[quizQuestions[currentQuizQuestion].id] === index && (
                            <CheckCircle2 size={14} />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t flex justify-between">
                <Button 
                  onClick={handlePrevQuestion} 
                  variant="outline" 
                  size="sm"
                  disabled={currentQuizQuestion === 0}
                >
                  <ChevronLeft size={16} className="mr-1" /> Previous
                </Button>
                
                <Button onClick={handleNextQuestion} variant={currentQuizQuestion === quizQuestions.length - 1 ? "default" : "outline"} size="sm">
                  {currentQuizQuestion === quizQuestions.length - 1 ? "Submit Quiz" : "Next Question"}
                  {currentQuizQuestion !== quizQuestions.length - 1 && <ChevronRight size={16} className="ml-1" />}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="text-sm font-medium">Data Structures Quiz</p>
                        <p className="text-xs text-gray-500">Completed 2 days ago</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">92%</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="text-sm font-medium">Calculus Midterm Prep</p>
                        <p className="text-xs text-gray-500">Completed 5 days ago</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">74%</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">Physics Concepts</p>
                        <p className="text-xs text-gray-500">Completed 1 week ago</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">88%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recommended Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-lg border border-gray-200 p-3">
                      <p className="text-sm font-medium mb-1">Algorithms & Complexity</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>15 questions</span>
                        <span>~20 min</span>
                      </div>
                      <Button size="sm" variant="link" className="px-0 py-1 h-auto">Start Quiz →</Button>
                    </div>
                    
                    <div className="rounded-lg border border-gray-200 p-3">
                      <p className="text-sm font-medium mb-1">Integration Techniques</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>12 questions</span>
                        <span>~15 min</span>
                      </div>
                      <Button size="sm" variant="link" className="px-0 py-1 h-auto">Start Quiz →</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Summaries Tab Content */}
        <TabsContent value="summaries" className="pt-2">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Study Summaries</h2>
            <p className="text-gray-600">Concise overviews of key topics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {summaries.map((summary) => (
              <Card key={summary.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{summary.title}</CardTitle>
                  <CardDescription>{summary.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 line-clamp-4">{summary.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="ghost" size="sm">
                    <Library size={16} className="mr-2" /> Save to Library
                  </Button>
                  <Button variant="default" size="sm">
                    <BookOpen size={16} className="mr-2" /> Read Full Summary
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 h-full">
              <PlusCircle size={32} className="text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium mb-1">Create New Summary</p>
              <p className="text-gray-500 text-sm text-center mb-4">Upload your notes or generate AI summaries</p>
              <Button variant="outline">Get Started</Button>
            </Card>
          </div>
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Study Insights</CardTitle>
                <CardDescription>Based on your summaries and notes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart size={20} className="text-blue-500" />
                      <h3 className="font-medium text-gray-800">Concept Connections</h3>
                    </div>
                    <p className="text-sm text-gray-600">Data structures concepts connect strongly with algorithm efficiency topics.</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain size={20} className="text-purple-500" />
                      <h3 className="font-medium text-gray-800">Knowledge Gaps</h3>
                    </div>
                    <p className="text-sm text-gray-600">Consider reviewing advanced calculus integration techniques.</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={20} className="text-amber-500" />
                      <h3 className="font-medium text-gray-800">Study Efficiency</h3>
                    </div>
                    <p className="text-sm text-gray-600">Your retention is 28% higher when studying summaries before flashcards.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyAssistant;