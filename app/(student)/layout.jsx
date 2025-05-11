// app/(student)/layout.jsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Handle authentication and role checking
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session.user.role !== 'STUDENT') {
      router.push('/login');
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'Request Callback', href: '/student/request-callback', icon: PhoneIcon },
    { name: 'Study Assistant', href: '/student/study-assistant', icon: BookIcon },
    { name: 'Knowledge Base', href: '/student/knowledge-base', icon: FolderIcon },
    { name: 'Logout', href: '#', icon: LogoutIcon, isLogout: true }, // Added logout item
  ];

  if (status === 'loading') {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }
  
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div>
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar for mobile */}
      <div 
        className={`fixed inset-y-0 left-0 flex flex-col z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <span className="text-lg font-bold">Student Portal</span>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon />
          </button>
        </div>
        <SidebarContent 
          navigation={navigation} 
          pathname={pathname} 
          handleLogout={handleLogout} // Pass the logout handler
        />
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <div className="h-16 flex items-center px-4 border-b">
            <span className="text-lg font-bold">Student Portal</span>
          </div>
          <SidebarContent 
            navigation={navigation} 
            pathname={pathname} 
            handleLogout={handleLogout} // Pass the logout handler
          />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto flex flex-col min-h-screen">
          {/* Top navigation */}
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <MenuIcon />
                </button>
              </div>
              <div className="flex items-center">
                <span className="md:hidden font-semibold">Student Portal</span>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
                    <span className="hidden md:inline-block">{session.user.name}</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {session.user.name.charAt(0)}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ navigation, pathname, handleLogout }) {
  return (
    <nav className="flex-1 overflow-y-auto">
      <ul className="space-y-1 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
                         (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          // Check if this is the logout item
          if (item.isLogout) {
            return (
              <li key={item.name}>
                <button 
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md w-full
                    text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400" />
                  {item.name}
                </button>
              </li>
            );
          }
          
          // Regular navigation item
          return (
            <li key={item.name}>
              <Link 
                href={item.href}
                className={`
                  flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Icons
function HomeIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ChatIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function BookIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function FolderIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
}

function LogoutIcon({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}