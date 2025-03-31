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
          knowledgeBaseId: 'kb_cs_programming'
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
          knowledgeBaseId: 'kb_math_calculus'
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
          knowledgeBaseId: 'kb_cs_ai'
        }
      }
    }
  ];
  
  const teachers = await Promise.all(
    teacherUsers.map(teacher => prisma.user.create({ data: teacher, include: { teacher: true } }))
  );
  
  console.log('Created teachers');
  
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
  
  // Create knowledge base articles
  const knowledgeArticles = [
    {
      title: 'Course Registration Process',
      content: 'The course registration process begins two weeks before the semester starts. Students must log into the portal and select courses based on their program requirements...',
      category: 'Administrative',
      teacherId: teachers[0].teacher.id,
      tags: ['registration', 'courses', 'portal']
    },
    {
      title: 'Understanding Big O Notation',
      content: 'Big O notation is used to describe the performance or complexity of an algorithm. It describes the worst-case scenario and can be used to describe the execution time required or the space used...',
      category: 'Computer Science',
      teacherId: teachers[0].teacher.id,
      tags: ['algorithms', 'complexity', 'performance']
    },
    {
      title: 'Introduction to Linear Algebra',
      content: 'Linear algebra is the branch of mathematics concerning linear equations, linear functions, and their representations through matrices and vector spaces...',
      category: 'Mathematics',
      teacherId: teachers[1].teacher.id,
      tags: ['vectors', 'matrices', 'linear systems']
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