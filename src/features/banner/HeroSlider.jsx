import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Search } from 'lucide-react';
import { ENDPOINTS } from '../../api/config';
import api from '../../api/axiosConfig';
import { useAccessories } from '../../hooks/useAccessories';
import Banner from '../../components/Banner';
import Layout from '../../components/layout/Layout';

const HeroSlider = () => {
  const navigate = useNavigate();
  
  const { products, loading: productsLoading } = useAccessories(); 
  
  const [slides, setSlides] = useState([]);
  const [bannersLoading, setBannersLoading] = useState(true); 
  
  // Local Filter State
  const [selections, setSelections] = useState({ 
    brand: 'All', 
    model: 'All', 
    category: 'All', 
    searchTerm: '' 
  });

  const brandOptions = ['All', ...new Set(products.map(p => p.brand))];
  const categoryOptions = ['All', ...new Set(products.map(p => p.category))];
  const modelOptions = selections.brand === 'All' 
    ? ['All', ...new Set(products.map(p => p.model))]
    : ['All', ...new Set(products.filter(p => p.brand === selections.brand).map(p => p.model))];

  const handleQuickSearch = () => {
    navigate('/catalog', { 
      state: { 
        initialFilters: {
          brand: selections.brand,
          model: selections.model,
          category: selections.category
        },
        initialSearch: selections.searchTerm 
      } 
    });
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannersLoading(true);
        const response = await api.get(ENDPOINTS.hero);
        const viewData = response.data;

        const parser = new DOMParser();

        const extractText = (htmlString) => {
          if (!htmlString) return '';
          const doc = parser.parseFromString(htmlString, 'text/html');
          return doc.body.textContent.trim();
        };

        const extractLinkData = (htmlString) => {
          if (!htmlString) return { text: 'EXPLORE CATALOG', url: '/catalog' };
          
          const doc = parser.parseFromString(htmlString, 'text/html');
          
          const titleNode = doc.querySelector('.link-title');
          const linkText = titleNode ? titleNode.textContent.trim() : 'EXPLORE CATALOG';
          
          const anchorNode = doc.querySelector('a');
          let linkUrl = anchorNode ? anchorNode.getAttribute('href') : '/catalog';
          
          linkUrl = linkUrl.replace('/api', '');

          return { text: linkText, url: linkUrl };
        };

        const formattedSlides = viewData.map((item, index) => {
          const cleanTitle = extractText(item.title);
          const cleanSubtitle = extractText(item.field_subtitle);
          
          const linkData = extractLinkData(item.field_link);

          const baseImageUrl = item.field_media_image || '';
          const finalImageUrl = baseImageUrl.startsWith('http') 
            ? baseImageUrl 
            : `${import.meta.env.VITE_API_BASE_URL}${baseImageUrl}`;

          return {
            id: index,
            title: cleanTitle, 
            subtitle: cleanSubtitle,
            imageUrl: finalImageUrl,
            linkUrl: linkData.url,     
            linkText: linkData.text     
          };
        });

        setSlides(formattedSlides);
      } catch (error) {
        console.error("Banner fetch failed:", error);
      } finally {
        setBannersLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (productsLoading || bannersLoading) {
    return (
      <div className="w-[calc(100vw-1rem)] h-[85vh] bg-slate-900 animate-pulse flex items-center justify-center text-slate-700 font-black italic">
        LOADING DAIJEX...
      </div>
    );
  }

  return (
    // Replaced w-screen with w-full. Tweaked height for mobile to fit the larger filter form.
    // <section className="relative lg:w-[calc(100vw-1rem)] md:w-[calc(100vw-1px)] h-[110vh] md:h-[90vh] lg:h-[85vh] bg-black">
    <section className="relative w-[100vw] lg:w-[calc(100vw-1rem)] overflow-hidden h-[110vh] md:h-[90vh] lg:h-[85vh] bg-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <Banner 
                title={slide.title}
                subtitle={slide.subtitle}
                imageUrl={slide.imageUrl}
                linkUrl={slide.linkUrl}
                linkText={slide.linkText}
                isActive={isActive} 
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 🚀 RESPONSIVE CATALOG FILTERS IN HERO */}
      <div className="absolute bottom-6 lg:bottom-10 left-0 w-full z-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Changed to flex-col on mobile, flex-row on desktop */}
          <div className="bg-white/95 backdrop-blur-md lg:bg-white p-4 lg:p-2 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center gap-4 border border-slate-100/50">
            
            {/* Grid responds to screen size: 1 col (mobile), 2 col (tablet), 4 col (desktop) */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0 lg:divide-x divide-slate-100">
              
              {/* 1. Text Search */}
              <div className="px-4 py-3 bg-slate-50 lg:bg-transparent rounded-xl lg:rounded-none">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Search Keywords</label>
                <input 
                  type="text"
                  placeholder="e.g. Spoiler..."
                  className="w-full bg-transparent font-black text-slate-800 outline-none placeholder:text-slate-300 uppercase italic text-sm md:text-base"
                  value={selections.searchTerm}
                  onChange={(e) => setSelections({ ...selections, searchTerm: e.target.value })}
                />
              </div>

              {/* 2. Category */}
              <div className="px-4 py-3 bg-slate-50 lg:bg-transparent rounded-xl lg:rounded-none">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Category</label>
                <select 
                  className="w-full bg-transparent font-black text-slate-800 outline-none cursor-pointer uppercase italic text-sm md:text-base"
                  value={selections.category}
                  onChange={(e) => setSelections({ ...selections, category: e.target.value })}
                >
                  {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* 3. Make */}
              <div className="px-4 py-3 bg-slate-50 lg:bg-transparent rounded-xl lg:rounded-none">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Make</label>
                <select 
                  className="w-full bg-transparent font-black text-slate-800 outline-none cursor-pointer uppercase italic text-sm md:text-base"
                  value={selections.brand}
                  onChange={(e) => setSelections({ ...selections, brand: e.target.value, model: 'All' })}
                >
                  {brandOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* 4. Model */}
              <div className="px-4 py-3 bg-slate-50 lg:bg-transparent rounded-xl lg:rounded-none">
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Model</label>
                <select 
                  className="w-full bg-transparent font-black text-slate-800 outline-none cursor-pointer uppercase italic text-sm md:text-base"
                  value={selections.model}
                  disabled={selections.brand === 'All'}
                  onChange={(e) => setSelections({ ...selections, model: e.target.value })}
                >
                  {modelOptions.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Button spans full width on mobile, shrinks on desktop */}
            <button 
              onClick={handleQuickSearch}
              className="w-full lg:w-auto bg-slate-900 text-white px-8 py-4 lg:py-5 rounded-xl hover:bg-daijex-red transition-all flex justify-center items-center gap-3 font-black uppercase text-xs tracking-widest mt-2 lg:mt-0"
            >
              <Search size={18} /> Find
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;