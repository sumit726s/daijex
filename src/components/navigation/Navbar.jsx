import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react'; // Import icons
import { useNavigation } from '../../hooks/useNavigation';
import HeaderSearch from '../layout/HeaderSearch';

const Navbar = () => {
  const { menuItems, loading } = useNavigation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-4">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-slate-900 hover:text-daijex-red transition-colors z-10">
          <img 
    src="/daijex.png" 
    alt="Daijex Auto Accessories" 
    className="w-auto max-h-[40px] object-contain"
    // Optimization: Ensure image doesn't layout shift
    width="160"
    height="40"
  />
        </Link>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <ul className="hidden md:flex items-center gap-8">
          {loading ? (
            <li className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Syncing...</li>
          ) : (
            menuItems.map((item) => (
              <motion.li 
                key={item.id}
                whileHover={{ y: -2 }}
                className="relative"
              >
                <Link 
                  to={item.path}
                  className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                    location.pathname === item.path ? 'text-daijex-red' : 'text-slate-600 hover:text-daijex-red'
                  }`}
                >
                  {item.title}
                </Link>
                {/* Active Indicator */}
                {location.pathname === item.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-daijex-red"
                  />
                )}
              </motion.li>
            ))
          )}
        </ul>

        {/* Actions Area (Search + Mobile Toggle) */}
        <div className="flex items-center gap-2 md:gap-6 z-10">
          <HeaderSearch />
          
          {/* Mobile Hamburger Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-daijex-red transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 🚀 Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <Link 
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className={`block py-3 text-sm font-bold uppercase tracking-widest border-b border-slate-50 ${
                      location.pathname === item.path ? 'text-daijex-red' : 'text-slate-600'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;