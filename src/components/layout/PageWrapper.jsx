import React from 'react';
import { motion } from 'framer-motion';

const PageWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      // 1. Explicitly define the animation states so Framer Motion knows what to do
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      
      // 2. Removed min-h-screen. Changed to w-full. 
      // Adjusted top padding (pt-10) since Layout.jsx already handles the header spacing.
      className={`w-[100vw] lg:w-[calc(100vw-1rem)] pt-10 pb-12 ${className}`}
    >
      {/* This centering container is perfect! It keeps your Catalog restricted and aligned. */}
      <div className="max-w-[98vw] lg:max-w-[90vw] md:max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.div>
  );
};

export default PageWrapper;