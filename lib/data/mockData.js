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
    content: "The course registration process begins two weeks before the semester starts. Students must log into the portal and select courses based on their program requirements. Important deadlines to remember:\n\n- Pre-registration: 2 weeks before semester start\n- Drop/Add period: First 2 weeks of semester\n- Withdrawal deadline: Week 8 of semester\n\nTo register, visit the student portal at portal.university.edu and follow the steps outlined in your program guide. If you encounter any issues, contact the registrar's office at registrar@university.edu.",
    category: "Administrative",
    teacherId: "t1",
    tags: ["registration", "courses", "portal"],
    createdAt: "2025-01-15T09:00:00",
    views: 256
  },
  {
    id: "kb2",
    title: "Understanding Big O Notation",
    content: "Big O notation is used to describe the performance or complexity of an algorithm. It describes the worst-case scenario and can be used to describe the execution time required or the space used by an algorithm.\n\nCommon complexities include:\n\n- O(1): Constant time\n- O(log n): Logarithmic time\n- O(n): Linear time\n- O(n log n): Log-linear time\n- O(n²): Quadratic time\n- O(2^n): Exponential time\n\nWhen analyzing algorithms, we focus on how the runtime or space requirements grow as the input size increases. For example, a linear search through an array takes O(n) time because it may need to check every element in the worst case.",
    category: "Computer Science",
    teacherId: "t1",
    tags: ["algorithms", "complexity", "performance"],
    createdAt: "2025-01-25T11:45:00",
    views: 183
  },
  {
    id: "kb3",
    title: "Introduction to Linear Algebra",
    content: "Linear algebra is the branch of mathematics concerning linear equations, linear functions, and their representations through matrices and vector spaces.\n\nKey concepts include:\n\n- Vectors and vector operations\n- Matrices and matrix operations\n- Linear transformations\n- Eigenvalues and eigenvectors\n- Vector spaces and subspaces\n\nApplications of linear algebra are widespread in science and engineering, including computer graphics, machine learning, quantum mechanics, and optimization problems.",
    category: "Mathematics",
    teacherId: "t2",
    tags: ["vectors", "matrices", "linear systems"],
    createdAt: "2025-02-05T14:20:00",
    views: 142
  },
  {
    id: "kb4",
    title: "Neural Networks Basics",
    content: "Neural networks are computing systems inspired by the biological neural networks that constitute animal brains. The neural network itself is not an algorithm, but rather a framework for many different machine learning algorithms to work together.\n\nKey components of neural networks include:\n\n- Neurons: Basic computational units\n- Layers: Input, hidden, and output layers\n- Weights and biases: Parameters that are adjusted during training\n- Activation functions: Functions that determine the output of a neuron\n- Loss functions: Measure how well the network performs\n\nNeural networks are at the core of deep learning, a subfield of machine learning that has achieved remarkable results in areas such as computer vision, natural language processing, and game playing.",
    category: "Computer Science",
    teacherId: "t3",
    tags: ["ai", "machine learning", "neural networks"],
    createdAt: "2025-02-10T10:30:00",
    views: 321
  },
  {
    id: "kb5",
    title: "Object-Oriented Programming Principles",
    content: "Object-oriented programming (OOP) is a programming paradigm based on the concept of \"objects\", which can contain data and code: data in the form of fields (often known as attributes or properties), and code, in the form of procedures (often known as methods).\n\nThe four main principles of OOP are:\n\n1. Encapsulation: Bundling data and methods that operate on that data\n2. Inheritance: Ability of a class to inherit properties and methods from another class\n3. Polymorphism: Ability to present the same interface for different underlying forms\n4. Abstraction: Hiding complex implementation details and showing only the necessary features\n\nThese principles help in creating modular, reusable, and maintainable code.",
    category: "Computer Science",
    teacherId: "t1",
    tags: ["programming", "oop", "classes"],
    createdAt: "2025-02-15T16:45:00",
    views: 98
  },
  {
    id: "kb6",
    title: "Calculus: Limits and Continuity",
    content: "Limits and continuity are fundamental concepts in calculus. A limit describes the behavior of a function as its input approaches a certain value.\n\nKey concepts include:\n\n- Definition of a limit\n- One-sided limits\n- Continuity at a point\n- Continuous functions\n- Properties of limits\n- Evaluating limits\n\nA function is continuous at a point if the limit exists at that point, equals the function value, and the function is defined at that point. Understanding continuity is essential for applying many calculus theorems.",
    category: "Mathematics",
    teacherId: "t2",
    tags: ["calculus", "limits", "functions"],
    createdAt: "2025-02-20T13:15:00",
    views: 76
  },
  {
    id: "kb7",
    title: "Machine Learning Model Evaluation",
    content: "Evaluating machine learning models is crucial to ensure they generalize well to unseen data. Different metrics are appropriate for different types of problems.\n\nFor classification problems:\n- Accuracy: Proportion of correct predictions\n- Precision: Proportion of positive identifications that were actually correct\n- Recall: Proportion of actual positives that were identified correctly\n- F1 Score: Harmonic mean of precision and recall\n- ROC Curve and AUC: Graphical plot showing the diagnostic ability\n\nFor regression problems:\n- Mean Absolute Error (MAE)\n- Mean Squared Error (MSE)\n- Root Mean Squared Error (RMSE)\n- R-squared (coefficient of determination)\n\nThe choice of evaluation metric should align with the business or research objectives of the project.",
    category: "Computer Science",
    teacherId: "t3",
    tags: ["machine learning", "evaluation", "metrics"],
    createdAt: "2025-02-25T11:40:00",
    views: 112
  },
  {
    id: "kb8",
    title: "Study Techniques for STEM Subjects",
    content: "STEM (Science, Technology, Engineering, and Mathematics) subjects often require specific study approaches.\n\nEffective study techniques include:\n\n1. Active Learning: Engage with the material through practice problems, not just reading\n2. Spaced Repetition: Study material over increasing intervals rather than cramming\n3. Concept Mapping: Create visual representations of how concepts relate to each other\n4. Peer Teaching: Explaining concepts to others reinforces your understanding\n5. Practice Testing: Regular self-quizzing on material\n6. Applied Learning: Connect theoretical concepts to real-world applications\n\nRemember that understanding fundamental principles is more important than memorizing procedures in STEM fields.",
    category: "General",
    teacherId: "t1",
    tags: ["study skills", "learning", "STEM"],
    createdAt: "2025-03-01T09:25:00",
    views: 203
  },
  {
    id: "kb9",
    title: "Understanding Research Papers",
    content: "Academic research papers follow a specific structure that, once understood, makes them easier to comprehend and analyze.\n\nTypical sections include:\n\n1. Abstract: Summary of the paper's content\n2. Introduction: Context, motivation, and research questions\n3. Literature Review: Prior work in the field\n4. Methodology: How the research was conducted\n5. Results: What was found\n6. Discussion: Interpretation of results and implications\n7. Conclusion: Summary and future work\n\nWhen reading research papers, consider:\n- Reading the abstract and conclusion first for an overview\n- Identifying the key research questions and hypotheses\n- Evaluating the methodology for validity\n- Examining figures and tables closely\n- Noting limitations acknowledged by the authors\n\nDeveloping critical reading skills is essential for academic success.",
    category: "General",
    teacherId: "t2",
    tags: ["research", "academic", "papers"],
    createdAt: "2025-03-05T14:50:00",
    views: 167
  },
  {
    id: "kb10",
    title: "Ethics in Artificial Intelligence",
    content: "As artificial intelligence systems become more powerful and widespread, ethical considerations become increasingly important.\n\nKey ethical issues in AI include:\n\n1. Bias and Fairness: AI systems may perpetuate or amplify existing biases\n2. Privacy: AI often requires large amounts of data, raising privacy concerns\n3. Transparency and Explainability: The \"black box\" nature of some AI systems\n4. Accountability: Who is responsible when AI makes mistakes?\n5. Autonomy: How much decision-making power should be given to AI?\n6. Employment Impact: How AI affects jobs and employment\n\nAddressing these ethical issues requires input from diverse stakeholders, including technologists, ethicists, policymakers, and the public.",
    category: "Computer Science",
    teacherId: "t3",
    tags: ["ai", "ethics", "technology"],
    createdAt: "2025-03-10T10:15:00",
    views: 231
  }
];

// Mock knowledge bases
export const knowledgeBases = [
  {
    id: "kb_cs_programming",
    name: "Programming Fundamentals",
    description: "Basic concepts and principles of programming",
    ownerId: "t1",
    documentCount: 2,
    createdAt: "2025-01-10T10:30:00Z"
  },
  {
    id: "kb_math_calculus",
    name: "Calculus and Analysis",
    description: "Fundamental concepts in calculus and mathematical analysis",
    ownerId: "t2",
    documentCount: 1,
    createdAt: "2025-01-15T14:30:00Z"
  },
  {
    id: "kb_cs_ai",
    name: "Artificial Intelligence",
    description: "Core principles and applications of AI and machine learning",
    ownerId: "t3",
    documentCount: 0,
    createdAt: "2025-01-20T09:15:00Z"
  },
  {
    id: "general",
    name: "University General Knowledge",
    description: "Common information about university policies and procedures",
    ownerId: "admin",
    documentCount: 5,
    createdAt: "2025-01-01T08:00:00Z"
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

// Get knowledge bases for a teacher
export const getTeacherKnowledgeBases = (teacherId) => {
  return knowledgeBases.filter(kb => kb.ownerId === teacherId);
};

// Create a new knowledge base
export const createKnowledgeBase = (data) => {
  // Generate a unique ID
  const id = `kb_${data.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
  
  // Create the new knowledge base
  const newKnowledgeBase = {
    id,
    documentCount: 0,
    createdAt: new Date().toISOString(),
    ...data
  };
  
  // Add to the mock database
  knowledgeBases.push(newKnowledgeBase);
  
  return { success: true, knowledgeBase: newKnowledgeBase };
};

// Update an existing knowledge base
export const updateKnowledgeBase = (id, data) => {
  const index = knowledgeBases.findIndex(kb => kb.id === id);
  
  if (index === -1) {
    return { success: false, message: "Knowledge base not found" };
  }
  
  // Update the knowledge base
  knowledgeBases[index] = {
    ...knowledgeBases[index],
    ...data
  };
  
  return { success: true, knowledgeBase: knowledgeBases[index] };
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