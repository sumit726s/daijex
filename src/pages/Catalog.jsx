import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useAccessories } from '../hooks/useAccessories';
import AccessoryCard from '../components/ui/AccessoryCard';
import SEO from '../components/seo/SEO';
import Layout from '../components/layout/Layout';

const Catalog = () => {
  const location = useLocation();
  const { products, loading, error } = useAccessories();
  
  // Set initial search term from the HeroSlider state
  const [searchTerm, setSearchTerm] = useState(location.state?.initialSearch || '');
  
  const [filters, setFilters] = useState(
    location.state?.initialFilters || { brand: 'All', model: 'All', category: 'All' }
  );

  useEffect(() => {
    if (location.state?.initialSearch !== undefined) {
      setSearchTerm(location.state.initialSearch);
    }
    if (location.state?.initialFilters) {
      setFilters(location.state.initialFilters);
    }
  }, [location.state]); // This fires whenever the navigation state changes

  // --- Logic: Dependent Dropdowns ---
  const brandOptions = useMemo(() => 
    ['All', ...new Set(products.map(p => p.brand))], [products]
  );

  const modelOptions = useMemo(() => {
    if (filters.brand === 'All') {
      return ['All', ...new Set(products.map(p => p.model))];
    }
    return ['All', ...new Set(products
      .filter(p => p.brand === filters.brand)
      .map(p => p.model))];
  }, [filters.brand, products]);
``
  // Master Filter Logic
  const filteredProducts = products.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = filters.brand === 'All' || item.brand === filters.brand;
    const matchesModel = filters.model === 'All' || item.model === filters.model;
    const matchesCat = filters.category === 'All' || item.category === filters.category;
    return matchesSearch && matchesBrand && matchesModel && matchesCat;
  });

  const activeFilters = [];
  if (filters.brand !== 'All') activeFilters.push(filters.brand);
  if (filters.model !== 'All') activeFilters.push(filters.model);

  const metaTitle = activeFilters.length > 0
    ? `${activeFilters.join(' ')} Accessories | Daijex Auto Industries`
    : 'Catalog | Daijex Auto Industries';

  const metaDescription = activeFilters.length > 0
    ? `Browse our premium selection of ${activeFilters.join(', ')} auto accessories at Daijex. Find the perfect fit for your vehicle.`
    : 'Explore the complete Daijex catalog of premium auto accessories, including bumpers, spoilers, and guards for all major car brands.';

  // Format it exactly how your SEO component expects it
  const pageMetaTags = [
    { tag: 'meta', attributes: { name: 'title', content: metaTitle } },
    { tag: 'meta', attributes: { name: 'description', content: metaDescription } },
    { tag: 'meta', attributes: { name: 'keywords', content: 'auto accessories, car parts, Daijex catalog, aftermarket accessories' } },
    { tag: 'meta', attributes: { property: 'og:title', content: metaTitle } },
    { tag: 'meta', attributes: { property: 'og:description', content: metaDescription } }
  ];

  // Handle Loading State
  if (loading) {
    return (
      <Layout>
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-12 h-12 border-4 border-daijex-red border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium italic">Loading Daijex Catalog...</p>
      </div>
    </Layout>
    );
  }

  // Handle Error State (e.g., Auth failure or Network error)
  if (error) {
    return (
      <Layout>
      <div className="py-20 text-center space-y-4">
        <p className="text-red-500 font-bold">Failed to load accessories.</p>
        <p className="text-sm text-slate-400">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-2 bg-daijex-dark text-white rounded-full text-xs font-black uppercase tracking-widest"
        >
          Retry
        </button>
      </div>
    </Layout>
    );
  }

  return (
    <Layout>
    <div className="space-y-8 py-10">
      <SEO metatags={pageMetaTags} />
      {/* Search & Top Level Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="lg:col-span-1">
          <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Search</label>
          <input 
            type="text" 
            placeholder="Spoiler, Bumper..." 
            className="w-full p-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-daijex-red transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

      {/* Products Grid */}
      <div className="mx-auto px-10 py-10 flex justify-between items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                key={product.id}
              >
                <AccessoryCard product={product} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-40 italic">
              No products found matching your selection.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </Layout>
  );
};

export default Catalog;