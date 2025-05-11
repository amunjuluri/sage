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
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
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
    } else if (currentQuizQuestion === quizQuestions.length - 1) {
      setQuizSubmitted(true);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuizQuestion > 0) {
      setCurrentQuizQuestion(currentQuizQuestion - 1);
    }
  };
  
  const resetQuiz = () => {
    setSelectedOptions({});
    setCurrentQuizQuestion(0);
    setQuizSubmitted(false);
  };
  
  const getQuizResults = () => {
    let correct = 0;
    quizQuestions.forEach(question => {
      if (selectedOptions[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quizQuestions.length,
      percentage: Math.round((correct / quizQuestions.length) * 100)
    };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Assistant</h1>
        <p className="text-gray-600">Your personalized learning companion</p>
      </header>
      
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
           
          </div>
        </TabsContent>
        
        {/* Quizzes Tab Content */}
        <TabsContent value="quizzes" className="pt-2">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Practice Quizzes</h2>
            <p className="text-gray-600">Test your knowledge and track progress</p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            {!quizSubmitted ? (
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
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Quiz Results</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-8 mb-6">
                    <div className="text-4xl font-bold mb-2 text-blue-600">{getQuizResults().percentage}%</div>
                    <p className="text-gray-600">You got {getQuizResults().correct} out of {getQuizResults().total} questions correct</p>
                  </div>
                  
                  <Button onClick={resetQuiz} variant="default">Try Again</Button>
                </div>
              </div>
            )}
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
                  <p className="text-gray-700">{summary.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyAssistant;