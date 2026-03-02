import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, CheckCircle, XCircle } from 'lucide-react';
import { fadeInUp } from '../../animations/variants';

const AccessoryCard = ({ product }) => {
  return (
    <motion.div 
      variants={fadeInUp}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img 
          src={product.thumb} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 right-3">
          {product.available ? (
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              <CheckCircle size={10} /> In Stock
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-slate-400 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
              <XCircle size={10} /> Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5">
        <span className="text-daijex-red text-xs font-bold tracking-widest uppercase">
          {product.sku}
        </span>
        <h3 className="text-lg font-bold text-daijex-dark mt-1 line-clamp-2 min-h-[3.5rem]">
          <Link to={product.path} state={{ title: product.title }} className="hover:text-daijex-red transition-colors">
            {product.title}
          </Link>
        </h3>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-[10px] uppercase font-bold">Price</p>
            <p className="text-2xl font-black text-daijex-dark">₹{Math.round(product.price)}</p>
          </div>
          
          <button 
            className="bg-daijex-dark text-white p-3 rounded-xl hover:bg-daijex-red transition-colors focus-visible:ring-4 focus-visible:ring-daijex-accent"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccessoryCard;