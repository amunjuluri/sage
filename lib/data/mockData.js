// This file contains mock data that will be replaced with database calls in the future

export const students = [
  {
    id: "s1",
    email: "student1@university.edu",
    password: "password123", // In a real app, this would be hashed
    name: "Alex Johnson",
    course: "Computer Science",
    year: 2,
    teachersAssigned: ["t1", "t2", "t3"],
    phoneNumber: "+918639391665"
  },
  {
    id: "s2",
    email: "student2@university.edu",
    password: "password123",
    name: "Jamie Smith",
    course: "Mathematics",
    year: 3,
    teachersAssigned: ["t2", "t4"],
    phoneNumber: "+918639391665"
  },
  {
    id: "s3",
    email: "student3@university.edu",
    password: "password123",
    name: "Taylor Wong",
    course: "Physics",
    year: 1,
    teachersAssigned: ["t1", "t4", "t5"],
    phoneNumber: "+918639391665"
  }
];

export const teachers = [
  {
    id: "t1",
    email: "professor1@university.edu",
    password: "teacher123",
    name: "Dr. Sarah Richards",
    department: "Computer Science",
    expertise: ["Programming", "Data Structures", "Algorithms"],
    knowledgeBaseId: "srm-info", // Teacher-specific knowledge base ID
    voiceId: "bland_female_1" // Bland AI voice ID
  },
  {
    id: "t2",
    email: "professor2@university.edu",
    password: "teacher123",
    name: "Prof. Michael Chen",
    department: "Mathematics",
    expertise: ["Calculus", "Linear Algebra", "Statistics"],
    knowledgeBaseId: "kb_math_calculus", // Teacher-specific knowledge base ID
    voiceId: "bland_male_1" // Bland AI voice ID
  },
  {
    id: "t3",
    email: "professor3@university.edu",
    password: "teacher123",
    name: "Dr. Emily Patel",
    department: "Computer Science",
    expertise: ["Artificial Intelligence", "Machine Learning"],
    knowledgeBaseId: "kb_cs_ai", // Teacher-specific knowledge base ID
    voiceId: "bland_female_2" // Bland AI voice ID
  },
  {
    id: "t4",
    email: "professor4@university.edu",
    password: "teacher123",
    name: "Prof. James Wilson",
    department: "Physics",
    expertise: ["Quantum Mechanics", "Electromagnetism"],
    knowledgeBaseId: "kb_physics_quantum", // Teacher-specific knowledge base ID
    voiceId: "bland_male_2" // Bland AI voice ID
  },
  {
    id: "t5",
    email: "professor5@university.edu",
    password: "teacher123",
    name: "Dr. Lisa Garcia",
    department: "Physics",
    expertise: ["Thermodynamics", "Statistical Mechanics"],
    knowledgeBaseId: "kb_physics_thermo", // Teacher-specific knowledge base ID
    voiceId: "bland_female_3" // Bland AI voice ID
  }
];

export const callbackRequests = [
  {
    id: "cr1",
    studentId: "s1",
    teacherId: "t1",
    subject: "Help with Assignment 3",
    message: "I'm struggling with the recursion section of assignment 3. Could you help me understand it better?",
    requestedDate: "2025-02-25T14:30:00",
    status: "pending" // pending, scheduled, completed, cancelled
  },
  {
    id: "cr2",
    studentId: "s2",
    teacherId: "t2",
    subject: "Question about Linear Algebra",
    message: "I have questions about the eigenvalue problems we covered last week.",
    requestedDate: "2025-02-26T10:00:00",
    status: "scheduled"
  }
];

export const knowledgeBase = [
  {
    id: "kb1",
    title: "Course Registration Process",
    content: "The course registration process begins two weeks before the semester starts. Students must log into the portal and select courses based on their program requirements...",
    category: "Administrative",
    teacherId: "t1",
    createdAt: "2025-01-15T09:00:00"
  },
  {
    id: "kb2",
    title: "Submitting Assignments on the Learning Portal",
    content: "All assignments must be submitted through the learning portal in PDF format. The file size should not exceed 10MB...",
    category: "Academic",
    teacherId: "t3",
    createdAt: "2025-01-20T14:20:00"
  },
  {
    id: "kb3",
    title: "Understanding Big O Notation",
    content: "Big O notation is used to describe the performance or complexity of an algorithm. It describes the worst-case scenario and can be used to describe the execution time required or the space used...",
    category: "Computer Science",
    teacherId: "t1",
    createdAt: "2025-01-25T11:45:00"
  }
];

// Knowledge base mapping to teacher expertise
export const knowledgeBases = [
  {
    id: "kb_cs_programming",
    name: "Programming and Data Structures",
    description: "Knowledge base for programming concepts, data structures, and algorithms",
    ownerId: "t1",
    documentCount: 12
  },
  {
    id: "kb_math_calculus",
    name: "Calculus and Linear Algebra",
    description: "Knowledge base for mathematical concepts, calculus, and linear algebra",
    ownerId: "t2",
    documentCount: 8
  },
  {
    id: "kb_cs_ai",
    name: "Artificial Intelligence and Machine Learning",
    description: "Knowledge base for AI concepts, machine learning algorithms, and neural networks",
    ownerId: "t3",
    documentCount: 9
  },
  {
    id: "kb_physics_quantum",
    name: "Quantum Mechanics and Electromagnetism",
    description: "Knowledge base for quantum physics and electromagnetic principles",
    ownerId: "t4",
    documentCount: 10
  },
  {
    id: "kb_physics_thermo",
    name: "Thermodynamics and Statistical Mechanics",
    description: "Knowledge base for thermodynamic principles and statistical mechanics",
    ownerId: "t5",
    documentCount: 7
  }
];

// Track the highest request ID to ensure uniqueness
let nextRequestId = 3; // Start at 3 since cr1 and cr2 already exist

// Mock function to authenticate users
export const authenticateUser = (email, password, userType) => {
  const usersList = userType === 'student' ? students : teachers;
  const user = usersList.find(user => user.email === email && user.password === password);
  
  if (user) {
    // Filter out sensitive information like password
    const { password, ...userInfo } = user;
    return { success: true, user: userInfo };
  }
  
  return { success: false, message: "Invalid email or password" };
};

// Mock function to get teachers assigned to a student
export const getAssignedTeachers = (studentId) => {
  const student = students.find(s => s.id === studentId);
  if (!student) return [];
  
  const assignedTeachers = student.teachersAssigned.map(teacherId => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      const { password, ...teacherInfo } = teacher;
      return teacherInfo;
    }
    return null;
  }).filter(Boolean);
  
  return assignedTeachers;
};

// Mock function to create a callback request - FIXED
export const createCallbackRequest = (request) => {
  // Generate a unique ID using our counter
  const newRequest = {
    id: `cr${nextRequestId++}`,
    status: "pending",
    createdAt: new Date().toISOString(),
    ...request
  };
  
  callbackRequests.push(newRequest);
  return { success: true, request: newRequest };
};

// Helper function to check for and fix duplicate IDs
export const checkAndFixDuplicateIds = () => {
  const idMap = new Map();
  let hasFixedAny = false;
  
  // Check for duplicates and fix them
  callbackRequests.forEach(request => {
    if (idMap.has(request.id)) {
      // This is a duplicate, assign a new ID
      request.id = `cr${nextRequestId++}`;
      hasFixedAny = true;
    } else {
      // Mark this ID as seen
      idMap.set(request.id, true);
      
      // Update nextRequestId if needed to ensure it's always higher than any existing ID
      const idNumber = parseInt(request.id.replace('cr', ''));
      if (!isNaN(idNumber) && idNumber >= nextRequestId) {
        nextRequestId = idNumber + 1;
      }
    }
  });
  
  return hasFixedAny;
};

// Run the fix function on module initialization
checkAndFixDuplicateIds();

// Mock function to get callback requests for a student
export const getStudentCallbackRequests = (studentId) => {
  return callbackRequests.filter(req => req.studentId === studentId);
};

// Mock function to get callback requests for a teacher
export const getTeacherCallbackRequests = (teacherId) => {
  return callbackRequests.filter(req => req.teacherId === teacherId);
};

// Mock function to get teacher's knowledge base
export const getTeacherKnowledgeBase = (teacherId) => {
  const teacher = teachers.find(t => t.id === teacherId);
  if (!teacher) return null;
  
  return knowledgeBases.find(kb => kb.id === teacher.knowledgeBaseId);
};

// Mock function to get knowledge base documents
export const getKnowledgeBaseDocuments = (knowledgeBaseId) => {
  // In a real app, this would query the database or Bland AI API
  // For mock purposes, we'll return some dummy documents
  return knowledgeBase.filter(doc => {
    const owner = teachers.find(t => t.id === doc.teacherId);
    return owner && owner.knowledgeBaseId === knowledgeBaseId;
  });
};