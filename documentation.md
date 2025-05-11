# SAGE: Student Assistance & Guidance System Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Key Features](#key-features)
5. [Pages and Routes](#pages-and-routes)
6. [Database Design](#database-design)
7. [Authentication System](#authentication-system)
8. [Terminology and Abbreviations](#terminology-and-abbreviations)

## Introduction

SAGE (Student Assistance & Guidance System) is a research-focused web application exploring the future of academic support through technology. The platform connects students with faculty for knowledge exchange and offers AI-powered academic assistance. It serves as an experimental platform to investigate how AI systems can enhance educational experiences, facilitate faculty-student communication, and improve learning outcomes.

## Tech Stack

### Frontend
- **Next.js**: A React framework that enables server-side rendering and generating static websites. We chose Next.js for its built-in routing, API routes, and performance optimizations.
- **React**: A JavaScript library for building user interfaces. It allows us to create reusable UI components.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces. It was chosen for its flexibility and development speed.
- **Shadcn UI**: A collection of reusable components that works with Tailwind CSS, providing accessible and customizable UI elements.

### Backend
- **Next.js API Routes**: Serverless functions that can be deployed as API endpoints.
- **Prisma**: An ORM (Object-Relational Mapping) tool that helps developers interact with databases using TypeScript or JavaScript. It simplifies database operations and provides type safety.

### Database
- **PostgreSQL**: A powerful, open-source relational database system that offers robustness, performance, and extensive features.

### Authentication
- **NextAuth.js**: A complete authentication solution for Next.js applications, supporting various authentication methods including credentials and OAuth providers.
- **Bcrypt**: A library for hashing passwords to securely store user credentials.

### Other Libraries
- **React Hook Form**: A library for efficient form handling with validation.
- **Zod**: A TypeScript-first schema validation library.
- **Recharts**: A composable charting library built on React components.
- **Axios**: A promise-based HTTP client for making API requests.

## Project Structure

The project follows a typical Next.js application structure with some custom organization:

```
sage/
├── app/                # Main application code
│   ├── (auth)/         # Authentication related pages
│   ├── (student)/      # Student dashboard and features
│   ├── (teacher)/      # Teacher dashboard and features
│   ├── api/            # API routes
│   ├── components/     # Application-specific components
│   ├── page.jsx        # Home page
│   └── layout.js       # Root layout
├── components/         # Shared UI components
│   └── ui/             # Base UI components
├── lib/                # Utility functions and shared code
├── prisma/             # Database schema and migrations
│   ├── schema.prisma   # Database model definitions
│   └── seed.js         # Seed data for development
├── public/             # Static assets
└── middleware.js       # Next.js middleware for route protection
```

## Key Features

### 1. AI Interaction Research
The platform explores how AI systems can provide relevant academic information and support to students. This includes AI-generated study materials and their impact on knowledge retention.

### 2. Faculty-Student Communication
SAGE investigates new models for direct faculty guidance and mentorship through integrated communication channels, including a callback request system.

### 3. Learning Augmentation
The system studies AI-generated study materials and their impact on knowledge retention and academic performance.

### 4. Role-Based Access
The application provides different interfaces and capabilities based on user roles (student or teacher), tailoring the experience to specific needs.

## Pages and Routes

### Public Pages
- **Home Page (`/`)**: Landing page introducing the research project, its objectives, and features.
- **Authentication Pages**:
  - Student Login (`/student-login`)
  - Teacher Login (`/teacher-login`)
  - General Login (`/login`)
  - Registration (`/register`)

### Student Area
The student dashboard (`/student`) provides access to:
- Profile management
- Academic assistance through AI
- Teacher knowledge base access
- Callback request system to schedule calls with teachers
- Study materials and resources

### Teacher Area
The teacher dashboard (`/teacher`) offers:
- Profile management
- Knowledge base article creation and management
- Student callback requests management
- Analytics on knowledge base usage
- Voice call integration for student assistance

### API Routes
The application includes several API endpoints:
- Authentication (`/api/auth/*`)
- Student management (`/api/students/*`)
- Teacher management (`/api/teachers/*`)
- Chat functionality (`/api/chat/*`)
- Callback request handling (`/api/callback-requests/*`)
- Study assistance (`/api/study-assistance/*`)
- Bland AI integration (`/api/bland-ai/*`) for voice calls

## Database Design

SAGE uses a PostgreSQL database with Prisma as the ORM. The key models include:

### User
Central user model with role-based design (STUDENT, TEACHER, ADMIN). Contains common fields like email, password, and name.

### Student
Student-specific data linked to a User, including course, year, and relationships to teachers and callback requests.

### Teacher
Teacher-specific data linked to a User, including department, expertise, and relationships to students, callback requests, and knowledge articles.

### CallbackRequest
Represents a student's request for a teacher callback, with details like subject, message, and status.

### KnowledgeArticle
Content created by teachers to share expertise, categorized and tagged for searchability.

### Authentication Models
NextAuth.js models for handling sessions, accounts, and verification tokens.

## Authentication System

SAGE implements a comprehensive authentication system using NextAuth.js:

1. **User Registration**: New users can register as either students or teachers with email and password.

2. **Login Process**: Users can log in through:
   - Email/password authentication
   - (Potentially) OAuth providers

3. **Session Management**: NextAuth.js handles secure session creation and validation.

4. **Middleware Protection**: Routes are protected based on user roles, ensuring students can only access student areas and teachers can only access teacher areas.

5. **Password Security**: Passwords are hashed using Bcrypt before storage.

## Terminology and Abbreviations

### Technical Terms
- **ORM (Object-Relational Mapping)**: A programming technique that converts data between incompatible type systems in relational databases and object-oriented programming languages.
- **API (Application Programming Interface)**: A set of rules that allows different software applications to communicate with each other.
- **JWT (JSON Web Token)**: A compact, URL-safe means of representing claims to be transferred between two parties.
- **SSR (Server-Side Rendering)**: A technique where the server generates the HTML for a page and sends it to the client fully rendered.

### Project-Specific Terms
- **SAGE**: Student Assistance & Guidance System - the name of the application.
- **Knowledge Base**: A collection of articles and resources created by teachers to share their expertise.
- **Callback Request**: A system allowing students to request a voice call with a teacher at a scheduled time.
- **Voice Integration**: The feature that enables voice calls between students and teachers through the Bland AI service.

### User Roles
- **Student**: Users who access learning resources and request assistance.
- **Teacher**: Users who provide knowledge content and respond to student inquiries.
- **Admin**: System administrators with full access to the platform (implementation may be in progress).

---

This documentation provides a comprehensive overview of the SAGE platform, its features, and technical implementation. As the project evolves, this document should be updated to reflect new features and architectural changes. 