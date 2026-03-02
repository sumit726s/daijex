import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNavigation } from '../../hooks/useNavigation';

const Navbar = () => {
  const { menuItems, loading } = useNavigation();
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tighter text-daijex-dark hover:text-daijex-red transition-colors">
          DAIJEX<span className="text-daijex-red">.</span>
        </Link>

        {/* Navigation Items from Drupal */}
        <ul className="hidden md:flex items-center gap-8">
          {loading ? (
            <li className="text-slate-400 text-sm animate-pulse">Syncing menu...</li>
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

        {/* CTA Button */}
        <Link 
          to="/catalog" 
          className="bg-daijex-dark text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-daijex-red transition-all focus-visible:ring-4 focus-visible:ring-daijex-accent"
        >
          EXPLORE CATALOG
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;