import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // FIX: Imported AnimatePresence
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const Banner = ({ title, subtitle, imageUrl, linkUrl, linkText, isActive }) => {
  // Gracefully handle Drupal's internal link prefixing
  const path = linkUrl?.replace('internal:', '').replace('<front>', '/') || '/';

  return (
    <div 
      className="relative w-full h-full bg-cover bg-center flex items-center overflow-hidden"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {/* High-contrast overlay for WCAG compliance */}
      <div className="absolute inset-0 bg-black/50" />
      <div className={`w-[calc(100vw-1rem)] pt-10 pb-12`}>
      <div className="max-w-[90vw] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-6 relative z-10 text-white">
        {/* AnimatePresence allows the exit animation to fire before the element is removed */}
        <AnimatePresence mode="wait">
          {isActive && (
            <motion.div
              key={title} // Important for AnimatePresence to track the element
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }} // ADDED: Smooth exit animation
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">
                {title}
              </h2>
              <p className="text-lg md:text-2xl max-w-2xl mb-8 text-slate-200">
                {subtitle}
              </p>
              <Link 
                to={path}
                className="inline-block bg-daijex-red hover:bg-red-700 text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-all focus-visible:ring-4 focus-visible:ring-daijex-accent"
              >
                {linkText || 'Shop Now'}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
    </div>
  );
};

export default Banner;