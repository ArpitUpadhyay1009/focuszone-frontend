import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO/SEO';
import Navbar from '@components/navbar/Navbar.jsx';
import AnimatedBackground from '@components/AnimatedBackground/AnimatedBackground.jsx';

const NotFound = () => {
  return (
    <>
      <SEO 
        title="Page Not Found | FocusZone"
        description="The page you are looking for doesn't exist. Return to FocusZone to continue your productivity journey."
        canonicalUrl="https://focuszone.io/404"
      />
      <AnimatedBackground />
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-6xl font-bold text-purple-700 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-lg mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;