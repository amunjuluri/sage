// app/(auth)/login/page.jsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e, role) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const providerId = role === 'student' ? 'student-login' : 'teacher-login';
      const result = await signIn(providerId, {
        redirect: false,
        email,
        password,
      });
      
      if (result.error) {
        setError('Invalid email or password');
        setIsSubmitting(false);
        return;
      }
      
      if (result.ok) {
        router.push(role === 'student' ? '/student/dashboard' : '/teacher/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your login type
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        <div className="flex flex-col space-y-4">
          <Link
            href="/student-login"
            className="py-3 px-4 bg-blue-600 text-white rounded-md text-center font-medium hover:bg-blue-700 transition-colors"
          >
            Student Login
          </Link>
          
          <Link
            href="/teacher-login"
            className="py-3 px-4 bg-indigo-600 text-white rounded-md text-center font-medium hover:bg-indigo-700 transition-colors"
          >
            Faculty Login
          </Link>
          
          <div className="text-center">
            <Link href="/register" className="text-sm text-blue-600 hover:text-blue-500">
              Don't have an account? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}