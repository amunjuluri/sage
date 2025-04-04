// lib/data/mockData.js

// Mock database of students
export const students = [
  {
    id: "s1",
    userId: "u1",
    email: "student1@university.edu",
    name: "Alex Johnson",
    course: "Computer Science",
    year: 2,
    phoneNumber: "+11234567893"
  },
  {
    id: "s2",
    userId: "u2",
    email: "student2@university.edu",
    name: "Sam Smith",
    course: "Mathematics",
    year: 3,
    phoneNumber: "+11234567894"
  },
  {
    id: "s3",
    userId: "u3",
    email: "student3@university.edu",
    name: "Taylor Wong",
    course: "Physics",
    year: 1,
    phoneNumber: "+11234567895"
  }
];

// Mock database of teachers
export const teachers = [
  {
    id: "t1",
    userId: "u4",
    email: "professor1@university.edu",
    name: "Dr. Richards",
    department: "Computer Science",
    expertise: ["Programming", "Data Structures", "Algorithms"],
    voiceId: "bland_male_1",
    knowledgeBaseId: "kb_cs_programming"
  },
  {
    id: "t2",
    userId: "u5",
    email: "professor2@university.edu",
    name: "Prof. Chen",
    department: "Mathematics",
    expertise: ["Calculus", "Linear Algebra", "Statistics"],
    voiceId: "bland_female_1",
    knowledgeBaseId: "kb_math_calculus"
  },
  {
    id: "t3",
    userId: "u6",
    email: "professor3@university.edu",
    name: "Dr. Patel",
    department: "Computer Science",
    expertise: ["Artificial Intelligence", "Machine Learning"],
    voiceId: "bland_male_2",
    knowledgeBaseId: "kb_cs_ai"
  }
];

// Student-teacher assignments (many-to-many relationship)
export const studentTeacherAssignments = [
  { studentId: "s1", teacherId: "t1" },
  { studentId: "s1", teacherId: "t2" },
  { studentId: "s1", teacherId: "t3" },
  { studentId: "s2", teacherId: "t1" },
  { studentId: "s2", teacherId: "t2" },
  { studentId: "s3", teacherId: "t1" },
  { studentId: "s3", teacherId: "t3" }
];

// Mock callback requests
export const callbackRequests = [
  {
    id: "cr1",
    studentId: "s1",
    teacherId: "t1",
    subject: "Help with Assignment 3",
    message: "I'm struggling with the recursion section of assignment 3. Could you help me understand it better?",
    requestedDate: "2025-02-25T14:30:00",
    status: "pending",
    phoneNumber: "+11234567893"
  },
  {
    id: "cr2",
    studentId: "s2",
    teacherId: "t2",
    subject: "Question about Linear Algebra",
    message: "I have questions about the eigenvalue problems we covered last week.",
    requestedDate: "2025-02-26T10:00:00",
    status: "scheduled",
    scheduledDate: "2025-02-26T10:00:00",
    phoneNumber: "+11234567894",
    callId: "mock_call_123456"
  },
  {
    id: "cr3",
    studentId: "s3",
    teacherId: "t3",
    subject: "Question about Quantum Mechanics",
    message: "I'm having trouble understanding the Schrödinger equation. Could you explain it in simpler terms?",
    requestedDate: "2025-02-20T11:15:00",
    status: "completed",
    scheduledDate: "2025-02-20T11:15:00",
    completedDate: "2025-02-21T09:30:00",
    phoneNumber: "+11234567895"
  }
];

// Knowledge base articles
export const knowledgeBase = [
  {
    id: "kb1",
    title: "Course Registration Process",
    content: "The course registration process begins two weeks before the semester starts. Students must log into the portal and select courses based on their program requirements...",
    category: "Administrative",
    teacherId: "t1",
    tags: ["registration", "courses", "portal"],
    createdAt: "2025-01-15T09:00:00"
  },
  {
    id: "kb2",
    title: "Understanding Big O Notation",
    content: "Big O notation is used to describe the performance or complexity of an algorithm. It describes the worst-case scenario and can be used to describe the execution time required or the space used...",
    category: "Computer Science",
    teacherId: "t1",
    tags: ["algorithms", "complexity", "performance"],
    createdAt: "2025-01-25T11:45:00"
  },
  {
    id: "kb3",
    title: "Introduction to Linear Algebra",
    content: "Linear algebra is the branch of mathematics concerning linear equations, linear functions, and their representations through matrices and vector spaces...",
    category: "Mathematics",
    teacherId: "t2",
    tags: ["vectors", "matrices", "linear systems"],
    createdAt: "2025-02-05T14:20:00"
  }
];

// Helper functions to work with the mock data
// ----------------------------------------

// Get a student by ID
export const getStudent = (studentId) => {
  return students.find(student => student.id === studentId);
};

// Get a teacher by ID
export const getTeacher = (teacherId) => {
  return teachers.find(teacher => teacher.id === teacherId);
};

// Get teachers assigned to a student
export const getAssignedTeachers = (studentId) => {
  const assignments = studentTeacherAssignments.filter(
    assignment => assignment.studentId === studentId
  );
  
  return assignments.map(assignment => {
    const teacher = teachers.find(t => t.id === assignment.teacherId);
    return teacher;
  }).filter(Boolean); // Remove any undefined values
};

// Get callback requests for a student
export const getStudentCallbackRequests = (studentId) => {
  return callbackRequests.filter(request => request.studentId === studentId);
};

// Get callback requests for a teacher
export const getTeacherCallbackRequests = (teacherId) => {
  return callbackRequests.filter(request => request.teacherId === teacherId);
};

// Create a new callback request
export const createCallbackRequest = (requestData) => {
  // Generate a unique ID
  const id = `cr${Date.now()}`;
  
  // Create the new request
  const newRequest = {
    id,
    status: "pending",
    ...requestData
  };
  
  // Add to the mock database
  callbackRequests.push(newRequest);
  
  return { success: true, request: newRequest };
};

// Authentication helper
export const authenticateUser = (email, password, role) => {
  // For mock purposes, accept any password
  let user;
  
  if (role === 'student') {
    user = students.find(s => s.email.toLowerCase() === email.toLowerCase());
  } else if (role === 'teacher') {
    user = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
  }
  
  if (user) {
    return { success: true, user };
  }
  
  return { success: false, message: "Invalid email or password" };
};