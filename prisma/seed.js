// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');
  
  // Clear existing data
  await prisma.callbackRequest.deleteMany();
  await prisma.studentTeacher.deleteMany();
  await prisma.knowledgeArticle.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('Cleared existing data');
  
  // Create teachers
  const hashedPassword = await bcrypt.hash('teacher123', 10);
  
  // Create knowledge base IDs for teachers
  const knowledgeBases = [
    {
      id: 'kb_cs_programming',
      name: 'Programming Fundamentals',
      description: 'Basic concepts and principles of programming'
    },
    {
      id: 'kb_math_calculus',
      name: 'Calculus and Analysis',
      description: 'Fundamental concepts in calculus and mathematical analysis'
    },
    {
      id: 'kb_cs_ai',
      name: 'Artificial Intelligence',
      description: 'Core principles and applications of AI and machine learning'
    },
    {
      id: 'kb_general',
      name: 'University General Knowledge',
      description: 'Common information about university policies and procedures'
    }
  ];
  
  const teacherUsers = [
    {
      email: 'professor1@university.edu',
      name: 'Dr. Richards',
      password: hashedPassword,
      role: 'TEACHER',
      phoneNumber: '+11234567890',
      teacher: {
        create: {
          department: 'Computer Science',
          expertise: ['Programming', 'Data Structures', 'Algorithms'],
          voiceId: 'bland_male_1',
          knowledgeBaseId: knowledgeBases[0].id // Programming KB
        }
      }
    },
    {
      email: 'professor2@university.edu',
      name: 'Prof. Chen',
      password: hashedPassword,
      role: 'TEACHER',
      phoneNumber: '+11234567891',
      teacher: {
        create: {
          department: 'Mathematics',
          expertise: ['Calculus', 'Linear Algebra', 'Statistics'],
          voiceId: 'bland_female_1',
          knowledgeBaseId: knowledgeBases[1].id // Calculus KB
        }
      }
    },
    {
      email: 'professor3@university.edu',
      name: 'Dr. Patel',
      password: hashedPassword,
      role: 'TEACHER',
      phoneNumber: '+11234567892',
      teacher: {
        create: {
          department: 'Computer Science',
          expertise: ['Artificial Intelligence', 'Machine Learning'],
          voiceId: 'bland_male_2',
          knowledgeBaseId: knowledgeBases[2].id // AI KB
        }
      }
    }
  ];
  
  const teachers = await Promise.all(
    teacherUsers.map(teacher => prisma.user.create({ data: teacher, include: { teacher: true } }))
  );
  
  console.log('Created teachers with knowledge bases');
  
  // Create students
  const studentPassword = await bcrypt.hash('password123', 10);
  
  const studentUsers = [
    {
      email: 'student1@university.edu',
      name: 'Alex Johnson',
      password: studentPassword,
      role: 'STUDENT',
      phoneNumber: '+11234567893',
      student: {
        create: {
          course: 'Computer Science',
          year: 2
        }
      }
    },
    {
      email: 'student2@university.edu',
      name: 'Sam Smith',
      password: studentPassword,
      role: 'STUDENT',
      phoneNumber: '+11234567894',
      student: {
        create: {
          course: 'Mathematics',
          year: 3
        }
      }
    },
    {
      email: 'student3@university.edu',
      name: 'Taylor Wong',
      password: studentPassword,
      role: 'STUDENT',
      phoneNumber: '+11234567895',
      student: {
        create: {
          course: 'Physics',
          year: 1
        }
      }
    }
  ];
  
  const students = await Promise.all(
    studentUsers.map(student => prisma.user.create({ data: student, include: { student: true } }))
  );
  
  console.log('Created students');
  
  // Assign teachers to students
  const teacherStudentAssignments = [
    { teacherId: teachers[0].teacher.id, studentId: students[0].student.id },
    { teacherId: teachers[1].teacher.id, studentId: students[0].student.id },
    { teacherId: teachers[2].teacher.id, studentId: students[0].student.id },
    { teacherId: teachers[0].teacher.id, studentId: students[1].student.id },
    { teacherId: teachers[1].teacher.id, studentId: students[1].student.id },
    { teacherId: teachers[0].teacher.id, studentId: students[2].student.id },
    { teacherId: teachers[2].teacher.id, studentId: students[2].student.id }
  ];
  
  await Promise.all(
    teacherStudentAssignments.map(assignment => 
      prisma.studentTeacher.create({
        data: {
          teacher: { connect: { id: assignment.teacherId } },
          student: { connect: { id: assignment.studentId } }
        }
      })
    )
  );
  
  console.log('Assigned teachers to students');
  
  // Create knowledge base articles mapped to knowledge bases
  const knowledgeArticles = [
    {
      title: 'Course Registration Process',
      content: 'The course registration process begins two weeks before the semester starts. Students must log into the portal and select courses based on their program requirements. Important deadlines to remember:\n\n- Pre-registration: 2 weeks before semester start\n- Drop/Add period: First 2 weeks of semester\n- Withdrawal deadline: Week 8 of semester\n\nTo register, visit the student portal at portal.university.edu and follow the steps outlined in your program guide. If you encounter any issues, contact the registrar\'s office at registrar@university.edu.',
      category: 'Administrative',
      teacherId: teachers[0].teacher.id,
      tags: ['registration', 'courses', 'portal']
    },
    {
      title: 'Understanding Big O Notation',
      content: 'Big O notation is used to describe the performance or complexity of an algorithm. It describes the worst-case scenario and can be used to describe the execution time required or the space used by an algorithm.\n\nCommon complexities include:\n\n- O(1): Constant time\n- O(log n): Logarithmic time\n- O(n): Linear time\n- O(n log n): Log-linear time\n- O(n²): Quadratic time\n- O(2^n): Exponential time\n\nWhen analyzing algorithms, we focus on how the runtime or space requirements grow as the input size increases. For example, a linear search through an array takes O(n) time because it may need to check every element in the worst case.',
      category: 'Computer Science',
      teacherId: teachers[0].teacher.id,
      tags: ['algorithms', 'complexity', 'performance']
    },
    {
      title: 'Introduction to Linear Algebra',
      content: 'Linear algebra is the branch of mathematics concerning linear equations, linear functions, and their representations through matrices and vector spaces.\n\nKey concepts include:\n\n- Vectors and vector operations\n- Matrices and matrix operations\n- Linear transformations\n- Eigenvalues and eigenvectors\n- Vector spaces and subspaces\n\nApplications of linear algebra are widespread in science and engineering, including computer graphics, machine learning, quantum mechanics, and optimization problems.',
      category: 'Mathematics',
      teacherId: teachers[1].teacher.id,
      tags: ['vectors', 'matrices', 'linear systems']
    },
    {
      title: 'Neural Networks Basics',
      content: 'Neural networks are computing systems inspired by the biological neural networks that constitute animal brains. The neural network itself is not an algorithm, but rather a framework for many different machine learning algorithms to work together.\n\nKey components of neural networks include:\n\n- Neurons: Basic computational units\n- Layers: Input, hidden, and output layers\n- Weights and biases: Parameters that are adjusted during training\n- Activation functions: Functions that determine the output of a neuron\n- Loss functions: Measure how well the network performs\n\nNeural networks are at the core of deep learning, a subfield of machine learning that has achieved remarkable results in areas such as computer vision, natural language processing, and game playing.',
      category: 'Computer Science',
      teacherId: teachers[2].teacher.id,
      tags: ['ai', 'machine learning', 'neural networks']
    },
    {
      title: 'Object-Oriented Programming Principles',
      content: 'Object-oriented programming (OOP) is a programming paradigm based on the concept of "objects", which can contain data and code: data in the form of fields (often known as attributes or properties), and code, in the form of procedures (often known as methods).\n\nThe four main principles of OOP are:\n\n1. Encapsulation: Bundling data and methods that operate on that data\n2. Inheritance: Ability of a class to inherit properties and methods from another class\n3. Polymorphism: Ability to present the same interface for different underlying forms\n4. Abstraction: Hiding complex implementation details and showing only the necessary features\n\nThese principles help in creating modular, reusable, and maintainable code.',
      category: 'Computer Science',
      teacherId: teachers[0].teacher.id,
      tags: ['programming', 'oop', 'classes']
    },
    {
      title: 'Calculus: Limits and Continuity',
      content: 'Limits and continuity are fundamental concepts in calculus. A limit describes the behavior of a function as its input approaches a certain value.\n\nKey concepts include:\n\n- Definition of a limit\n- One-sided limits\n- Continuity at a point\n- Continuous functions\n- Properties of limits\n- Evaluating limits\n\nA function is continuous at a point if the limit exists at that point, equals the function value, and the function is defined at that point. Understanding continuity is essential for applying many calculus theorems.',
      category: 'Mathematics',
      teacherId: teachers[1].teacher.id,
      tags: ['calculus', 'limits', 'functions']
    },
    {
      title: 'Machine Learning Model Evaluation',
      content: 'Evaluating machine learning models is crucial to ensure they generalize well to unseen data. Different metrics are appropriate for different types of problems.\n\nFor classification problems:\n- Accuracy: Proportion of correct predictions\n- Precision: Proportion of positive identifications that were actually correct\n- Recall: Proportion of actual positives that were identified correctly\n- F1 Score: Harmonic mean of precision and recall\n- ROC Curve and AUC: Graphical plot showing the diagnostic ability\n\nFor regression problems:\n- Mean Absolute Error (MAE)\n- Mean Squared Error (MSE)\n- Root Mean Squared Error (RMSE)\n- R-squared (coefficient of determination)\n\nThe choice of evaluation metric should align with the business or research objectives of the project.',
      category: 'Computer Science',
      teacherId: teachers[2].teacher.id,
      tags: ['machine learning', 'evaluation', 'metrics']
    },
    {
      title: 'Study Techniques for STEM Subjects',
      content: 'STEM (Science, Technology, Engineering, and Mathematics) subjects often require specific study approaches.\n\nEffective study techniques include:\n\n1. Active Learning: Engage with the material through practice problems, not just reading\n2. Spaced Repetition: Study material over increasing intervals rather than cramming\n3. Concept Mapping: Create visual representations of how concepts relate to each other\n4. Peer Teaching: Explaining concepts to others reinforces your understanding\n5. Practice Testing: Regular self-quizzing on material\n6. Applied Learning: Connect theoretical concepts to real-world applications\n\nRemember that understanding fundamental principles is more important than memorizing procedures in STEM fields.',
      category: 'General',
      teacherId: teachers[0].teacher.id,
      tags: ['study skills', 'learning', 'STEM']
    },
    {
      title: 'Understanding Research Papers',
      content: 'Academic research papers follow a specific structure that, once understood, makes them easier to comprehend and analyze.\n\nTypical sections include:\n\n1. Abstract: Summary of the paper\'s content\n2. Introduction: Context, motivation, and research questions\n3. Literature Review: Prior work in the field\n4. Methodology: How the research was conducted\n5. Results: What was found\n6. Discussion: Interpretation of results and implications\n7. Conclusion: Summary and future work\n\nWhen reading research papers, consider:\n- Reading the abstract and conclusion first for an overview\n- Identifying the key research questions and hypotheses\n- Evaluating the methodology for validity\n- Examining figures and tables closely\n- Noting limitations acknowledged by the authors\n\nDeveloping critical reading skills is essential for academic success.',
      category: 'General',
      teacherId: teachers[1].teacher.id,
      tags: ['research', 'academic', 'papers']
    },
    {
      title: 'Ethics in Artificial Intelligence',
      content: 'As artificial intelligence systems become more powerful and widespread, ethical considerations become increasingly important.\n\nKey ethical issues in AI include:\n\n1. Bias and Fairness: AI systems may perpetuate or amplify existing biases\n2. Privacy: AI often requires large amounts of data, raising privacy concerns\n3. Transparency and Explainability: The "black box" nature of some AI systems\n4. Accountability: Who is responsible when AI makes mistakes?\n5. Autonomy: How much decision-making power should be given to AI?\n6. Employment Impact: How AI affects jobs and employment\n\nAddressing these ethical issues requires input from diverse stakeholders, including technologists, ethicists, policymakers, and the public.',
      category: 'Computer Science',
      teacherId: teachers[2].teacher.id,
      tags: ['ai', 'ethics', 'technology']
    }
  ];
  
  await Promise.all(
    knowledgeArticles.map(article => 
      prisma.knowledgeArticle.create({
        data: article
      })
    )
  );
  
  console.log('Created knowledge base articles');
  
  // Create sample callback requests
  const callbackRequests = [
    {
      studentId: students[0].student.id,
      teacherId: teachers[0].teacher.id,
      subject: 'Help with Assignment 3',
      message: 'I\'m struggling with the recursion section of assignment 3. Could you help me understand it better?',
      requestedDate: new Date(),
      status: 'PENDING',
      phoneNumber: students[0].phoneNumber
    },
    {
      studentId: students[1].student.id,
      teacherId: teachers[1].teacher.id,
      subject: 'Question about Linear Algebra',
      message: 'I have questions about the eigenvalue problems we covered last week.',
      requestedDate: new Date(),
      status: 'SCHEDULED',
      scheduledDate: new Date(),
      phoneNumber: students[1].phoneNumber,
      callId: 'mock_call_123456'
    },
    {
      studentId: students[2].student.id,
      teacherId: teachers[2].teacher.id,
      subject: 'Question about Quantum Mechanics',
      message: 'I\'m having trouble understanding the Schrödinger equation. Could you explain it in simpler terms?',
      requestedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'COMPLETED',
      scheduledDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      completedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      phoneNumber: students[2].phoneNumber
    }
  ];
  
  await Promise.all(
    callbackRequests.map(request => 
      prisma.callbackRequest.create({
        data: request
      })
    )
  );
  
  console.log('Created callback requests');
  
  console.log('Database seed completed successfully!');
}

main()
  .catch(e => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });