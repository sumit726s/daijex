import React from 'react';
import { Car, ChevronRight, Loader2 } from 'lucide-react';
import { useFeaturedProducts } from '../../hooks/useFeaturedProducts';

const FeaturedProducts = () => {
  const { products, loading } = useFeaturedProducts();

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <h2 className="text-3xl font-black uppercase italic text-slate-900 mb-10 text-center">Latest Arrivals</h2>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-daijex-red" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
              <div className="aspect-square bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <Car size={48} className="text-slate-300" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white text-slate-900 font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:bg-daijex-red hover:text-white transition-colors">
                    View Details
                  </button>
                </div>
              </div>
              <div className="p-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-daijex-red block mb-2">{product.brand}</span>
                <h3 className="font-bold text-slate-900 text-lg mb-2 leading-tight line-clamp-2">{product.title}</h3>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                  <span className="font-black text-slate-900">{product.price}</span>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-daijex-red" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;