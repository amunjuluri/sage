// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "student-login",
      name: "Student Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            role: "STUDENT"
          },
          include: {
            student: true
          }
        });
        
        if (!user || !user.password) return null;
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isPasswordValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          studentId: user.student?.id
        };
      }
    }),
    CredentialsProvider({
      id: "teacher-login",
      name: "Teacher Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            role: "TEACHER"
          },
          include: {
            teacher: true
          }
        });
        
        if (!user || !user.password) return null;
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        
        if (!isPasswordValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          teacherId: user.teacher?.id
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.studentId = user.studentId;
        token.teacherId = user.teacherId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.studentId = token.studentId;
        session.user.teacherId = token.teacherId;
      }
      return session;
    }
  },
  pages: {
    signIn: '/', // Redirect to home page which has login options
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };