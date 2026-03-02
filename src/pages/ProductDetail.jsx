import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ShoppingCart, 
  CheckCircle2, 
  Package, 
  Settings, 
  Palette, 
  Calendar 
} from 'lucide-react';
import api from '../api/axiosConfig';
import { ENDPOINTS, formatAccessoryData } from '../api/config';
import Layout from '../components/layout/Layout';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductDetail = () => {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Use title from state if available, otherwise reconstruct from path
        const titleSearch = location.state?.title || 
                            location.pathname.split('/').pop().replace(/-/g, ' ');

        // Fetch single product by Title to avoid 'path.alias' 500 errors
        const response = await api.get(
          `${ENDPOINTS.accessories}&filter[title]=${encodeURIComponent(titleSearch)}`
        );
        const json = await response.data();

        if (json.data && json.data.length > 0) {
          setProduct(formatAccessoryData(json.data[0], json.included));
        }
      } catch (err) {
        console.error("Product Detail Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [location.pathname, location.state]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-xl font-black italic animate-pulse text-daijex-dark">
        SYNCING DAIJEX PART...
      </div>
    </div>
  );

  if (!product) return (
    <Layout>
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Accessory Not Found</h2>
        <Link to="/catalog" className="text-daijex-red font-black underline underline-offset-4">
          Return to Catalog
        </Link>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="py-8 w-screen mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <Link to="/catalog" className="flex items-center gap-2 text-slate-400 mb-10 font-bold text-xs uppercase tracking-widest hover:text-daijex-red transition-colors">
          <ChevronLeft size={16} /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Image Carousel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl overflow-hidden border border-slate-100 shadow-2xl bg-white"
          >
            <Swiper
              modules={[Navigation, Pagination, A11y]}
              navigation
              pagination={{ clickable: true }}
              className="aspect-square"
            >
              {product.gallery.map((imgUrl, index) => (
                <SwiperSlide key={index}>
                  <img 
                    src={imgUrl} 
                    alt={`${product.title} - Angle ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* Right: Product Details */}
          <div className="space-y-8">
            <header className="space-y-3">
              <span className="inline-block bg-daijex-red/10 text-daijex-red px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                {product.category}
              </span>
              <h1 className="text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                {product.title}
              </h1>
              <p className="text-slate-400 font-bold text-sm tracking-widest">
                PART NO: {product.sku}
              </p>
            </header>

            <div className="flex items-center gap-6 py-8 border-y border-slate-100">
              <span className="text-6xl font-black text-daijex-dark italic">
                ₹{product.price}
              </span>
              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <CheckCircle2 size={18} /> 
                {product.available ? 'In Stock & Ready to Ship' : 'Out of Stock'}
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 mb-1">
                  <Package size={12}/> Compatible Make
                </p>
                <p className="font-bold text-slate-800 uppercase">{product.brand}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 mb-1">
                  <Settings size={12}/> Specific Model
                </p>
                <p className="font-bold text-slate-800 uppercase">{product.model}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Material</p>
                <p className="font-bold text-slate-800 uppercase">{product.material || 'ABS Polymer'}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Finish Type</p>
                <p className="font-bold text-slate-800 uppercase">{product.finish}</p>
              </div>
            </div>

            {/* Compatible Years & Colors */}
            <div className="space-y-6 pt-2">
              <div className="flex gap-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <Calendar size={14}/> Fitment Years
                  </p>
                  <div className="flex gap-2">
                    {product.years.map(year => (
                      <span key={year} className="text-sm font-bold text-slate-700">{year}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                    <Palette size={14}/> Factory Colors
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(color => (
                      <span key={color} className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 uppercase">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase CTA */}
            <button className="w-full bg-daijex-dark text-white py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-daijex-red transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4">
              <ShoppingCart size={22} /> Add to Selection
            </button>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-20 pt-10 border-t border-slate-100">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-black uppercase italic mb-6">Deep Technical Details</h3>
            <div 
              className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }} //
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;