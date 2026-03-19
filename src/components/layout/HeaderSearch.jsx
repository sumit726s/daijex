import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeaderSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Send the user to your search page with the query in the URL
      navigate(`/search?query_string=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false); // Auto-close on submit
      setSearchQuery(''); 
    }
  };

  return (
    <>
      {/* 1. Desktop Search Form (Hidden on Mobile) */}
      <form onSubmit={handleSubmit} className="hidden md:flex relative w-64 lg:w-80">
        <input 
          type="text" 
          placeholder="Search Daijex catalog..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-5 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-daijex-red focus:bg-white transition-all shadow-sm"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-transparent border-none text-slate-400 hover:text-daijex-red flex items-center justify-center outline-none transition-colors"
        >
          <Search size={18} />
        </button>
      </form>

      {/* 2. Mobile Search Icon Toggle (Hidden on Desktop) */}
      <button 
        onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        className="md:hidden p-2 text-slate-600 hover:text-daijex-red transition-colors"
        aria-label="Toggle search bar"
      >
        <Search size={24} />
      </button>

      {/* 3. Mobile Expanding Search Bar (Slides down over the header) */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg px-6 py-4 overflow-hidden"
          >
            {/* 🚀 FIX: Removed hidden, md:flex, and fixed widths. Replaced with w-full flex */}
            <form onSubmit={handleSubmit} className="flex relative w-full">
              <input 
                type="text" 
                placeholder="Search Daijex catalog..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus /* UX Boost: Opens the mobile keyboard immediately */
                className="w-full pl-5 pr-12 py-3 bg-white border border-slate-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-daijex-red shadow-sm"
              />
              <button 
                type="submit" 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-transparent border-none text-slate-400 hover:text-daijex-red flex items-center justify-center outline-none transition-colors"
              >
                <Search size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderSearch;