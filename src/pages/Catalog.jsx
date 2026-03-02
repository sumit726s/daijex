import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useAccessories } from '../hooks/useAccessories';
import AccessoryCard from '../components/ui/AccessoryCard';


const Catalog = () => {
  const location = useLocation();
  const { products, loading } = useAccessories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(location.state?.initialFilters ||{ brand: 'All', model: 'All', category: 'All' });

  // --- Logic: Dependent Dropdowns ---
  
  // Get all unique brands (Makes)
  const brandOptions = useMemo(() => 
    ['All', ...new Set(products.map(p => p.brand))], [products]
  );

  // Get models ONLY for the selected brand
  const modelOptions = useMemo(() => {
    if (filters.brand === 'All') {
      return ['All', ...new Set(products.map(p => p.model))];
    }
    return ['All', ...new Set(products
      .filter(p => p.brand === filters.brand)
      .map(p => p.model))];
  }, [filters.brand, products]);

  // Master Filter Logic
  const filteredProducts = products.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filters.brand === 'All' || item.brand === filters.brand;
    const matchesModel = filters.model === 'All' || item.model === filters.model;
    const matchesCat = filters.category === 'All' || item.category === filters.category;
    return matchesSearch && matchesBrand && matchesModel && matchesCat;
  });

  return (
    <div className="space-y-8 py-10">
      {/* 1. Search & Top Level Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        
        {/* Search */}
        <div className="lg:col-span-1">
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Search</label>
          <input 
            type="text" 
            placeholder="Spoiler, Bumper..." 
            className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-daijex-red transition-all outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Make (Brand) */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Make</label>
          <select 
            value={filters.brand}
            onChange={(e) => setFilters({...filters, brand: e.target.value, model: 'All'})}
            className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
          >
            {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Model (Dependent) */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Model</label>
          <select 
            value={filters.model}
            disabled={filters.brand === 'All' && filters.model === 'All'}
            onChange={(e) => setFilters({...filters, model: e.target.value})}
            className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none disabled:opacity-50 transition-opacity cursor-pointer"
          >
            {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Category</label>
          <select 
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
            className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {[...new Set(products.map(p => p.category))].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* 2. Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(product => (
          <AccessoryCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;