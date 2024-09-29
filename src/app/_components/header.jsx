import Link from 'next/link';
import { useState } from 'react';

export default function Header(){
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [points, setPoints] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        setTheme(isDarkMode ? 'light' : 'dark');
      };
      
  return(
    <div>
          <nav className="flex flex-col md:flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
            <div className="flex justify-between items-center w-full">
              <div className="md:hidden">
                <button className="text-gray-800 dark:text-gray-200" onClick={() => setMenuOpen(!menuOpen)}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4`}>
                <button className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  Light/Dark
                </button>
                <Link href="/signup">
                <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  Sign Up
                </button>
                </Link>
                <Link href="/signin">
                <button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  Sign In
                </button>
                </Link>
              </div>
              <button className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors">
                Points
              </button>
            </div>
          </nav>
    </div>
  )
}