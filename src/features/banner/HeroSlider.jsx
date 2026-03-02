import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Search } from 'lucide-react';
import { ENDPOINTS } from '../../api/config';
import { useAccessories } from '../../hooks/useAccessories'; // Reusing your existing hook

const HeroSlider = () => {
  const navigate = useNavigate();
  const { products } = useAccessories();
  const [slides, setSlides] = useState([]);
  
  // Local Filter State
  const [selections, setSelections] = useState({ brand: 'All', model: 'All' });

  // Reusing your Catalog Logic: Generate Options from live data
  const brandOptions = ['All', ...new Set(products.map(p => p.brand))];
  const modelOptions = selections.brand === 'All' 
    ? ['All', ...new Set(products.map(p => p.model))]
    : ['All', ...new Set(products.filter(p => p.brand === selections.brand).map(p => p.model))];

  useEffect(() => {
    fetch(ENDPOINTS.hero).then(res => res.json()).then(setSlides);
  }, []);

  const handleQuickSearch = () => {
    // Navigate to Catalog and pass the filters in the state
    navigate('/catalog', { state: { initialFilters: selections } });
  };

  return (
    <section className="relative w-screen h-[85vh] bg-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000 }}
        className="h-full w-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full flex items-center">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.field_banner_image})` }}
              >
                <div className="absolute inset-0 bg-black/60" />
              </div>
              
              <div className="container mx-auto px-6 relative z-10 text-white">
                <h2 className="text-6xl md:text-8xl font-black uppercase italic italic tracking-tighter">
                  {slide.title}
                </h2>
                <p className="text-xl text-slate-300 mt-4 max-w-xl font-bold">{slide.field_subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* RE-USED CATALOG FILTERS IN HERO */}
      <div className="absolute bottom-10 left-0 w-full z-20 px-6 hidden lg:block">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-white p-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-100">
            <div className="flex-grow grid grid-cols-2 divide-x divide-slate-100">
              {/* Make Dropdown */}
              <div className="px-8 py-4">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Vehicle Make</label>
                <select 
                  className="w-full bg-transparent font-black text-slate-800 outline-none appearance-none cursor-pointer uppercase italic"
                  value={selections.brand}
                  onChange={(e) => setSelections({ brand: e.target.value, model: 'All' })}
                >
                  {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Model Dropdown */}
              <div className="px-8 py-4">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Vehicle Model</label>
                <select 
                  className="w-full bg-transparent font-black text-slate-800 outline-none appearance-none cursor-pointer uppercase italic"
                  value={selections.model}
                  disabled={selections.brand === 'All'}
                  onChange={(e) => setSelections({ ...selections, model: e.target.value })}
                >
                  {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={handleQuickSearch}
              className="bg-black-900 text-white px-10 py-5 rounded-xl hover:bg-red-600 transition-all flex items-center gap-3 font-black uppercase text-xs tracking-widest"
            >
              <Search size={18} /> Find Accessories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;