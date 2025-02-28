'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authenticateUser } from '../../../lib/data/mockData';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = authenticateUser(email, password, 'student');
    
    if (result.success) {
      // In a real app, we would use proper authentication with cookies/JWT
      // For now, we'll just store in sessionStorage
      sessionStorage.setItem('student', JSON.stringify(result.user));
      router.push('/student/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Student Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your student assistance portal
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link href="/teacher-login" className="font-medium text-blue-600 hover:text-blue-500">
            Are you a teacher? Login here
          </Link>
        </div>
        
        {/* For demo purposes - quick login links */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-xs text-gray-500 text-center">Demo accounts:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <button 
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              onClick={() => {
                setEmail('student1@university.edu');
                setPassword('password123');
              }}
            >
              Student 1
            </button>
            <button 
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              onClick={() => {
                setEmail('student2@university.edu');
                setPassword('password123');
              }}
            >
              Student 2
            </button>
            <button 
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              onClick={() => {
                setEmail('student3@university.edu');
                setPassword('password123');
              }}
            >
              Student 3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}