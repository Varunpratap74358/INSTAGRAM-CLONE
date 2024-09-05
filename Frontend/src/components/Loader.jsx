import React from 'react';

// Add custom styles in the same file
const styles = `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .animate-spin-fast {
    animation: spin 1s linear infinite;
  }
  .animate-spin-slow {
    animation: spin 3s linear infinite;
  }
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
}
`;

const Loader = () => {
  return (
    <>
      <style>{styles}</style>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300">
        <div className="relative w-24 h-24">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-t-transparent border-blue-600 rounded-full animate-spin-fast"></div>
          {/* Middle Ring */}
          <div className="absolute inset-1 border-4 border-b-transparent border-purple-500 rounded-full animate-spin-slow"></div>
          {/* Inner Circle */}
          <div className="absolute inset-3 bg-white rounded-full"></div>
          {/* Pulsing Dot */}
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-pink-500 rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
