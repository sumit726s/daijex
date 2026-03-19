import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

// Dynamic Icon Helper
const DynamicIcon = ({ name, size = 24, className = "" }) => {
  const IconComponent = LucideIcons[name] || LucideIcons['Package']; 
  return <IconComponent size={size} className={className} />;
};

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { categories, loading, error } = useCategories();

  if (error) return null; // Fail gracefully if categories don't load

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-black uppercase italic text-slate-900">Shop by Category</h2>
          <p className="text-slate-500 mt-2">Explore our premium manufacturing lineup.</p>
        </div>
        <button 
          onClick={() => navigate('/catalog')} 
          className="hidden sm:flex items-center text-daijex-red font-bold uppercase tracking-widest text-sm hover:text-red-700 transition-colors"
        >
          View All <LucideIcons.ArrowRight size={16} className="ml-1" />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12" aria-live="polite">
          <LucideIcons.Loader2 className="animate-spin text-daijex-red" size={32} />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.tid} 
              className="bg-white p-8 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-daijex-red transition-all group cursor-pointer flex flex-col items-center text-center" 
              onClick={() => navigate('/catalog', { 
                state: { 
                  initialFilters: { 
                    category: cat.name,
                    brand: 'All',
                    model: 'All'
                  } 
                } 
              })}
            >
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center text-slate-900 group-hover:text-white group-hover:bg-daijex-red transition-colors mb-6">
                <DynamicIcon name={cat.field_icon} size={28} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">{cat.name}</h3>
              <p className="text-sm text-slate-500 font-medium">
                {cat.nid} {cat.nid === "1" ? "Product" : "Products"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryGrid;