import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/config';
import Layout from '../components/layout/Layout'; // Assuming you have a Layout wrapper
import SEO from '../components/seo/SEO';

const Page = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch ALL basic pages from Drupal (No path filter!)
        const response = await api.get(ENDPOINTS.pages);
        const allPages = response.data.data;

        // 2. Use vanilla JavaScript to find the matching alias
        const currentPath = location.pathname; // e.g., "/about-us"
        const matchedPage = allPages.find(
          (page) => page.attributes.path?.alias === currentPath
        );

        if (matchedPage) {
          const attributes = matchedPage.attributes;
          setPageData({
            title: attributes.title,
            body: attributes.body?.processed || '',
            metatag: attributes.metatag || [], 
          });
        } else {
          setError('Page not found');
        }
      } catch (err) {
        console.error("Failed to fetch page:", err);
        setError('Failed to load content.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [location.pathname]);// Re-run if the user clicks a link to another basic page

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-daijex-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error || !pageData) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-black text-slate-800 uppercase italic mb-4">404</h1>
            <p className="text-slate-500 font-bold">{error || 'Page not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  
  return (
    <Layout>
      <SEO metatags={pageData.metatag} fallbackTitle={`${pageData.title} | Daijex Auto`} />
      
      {/* 1. Wrapper: Reduced vertical padding on mobile (py-8) vs desktop (md:py-16) */}
      <div className="py-8 md:py-16 px-4 sm:px-6 bg-slate-50 min-h-[60vh]">
        
        {/* 2. Card Container: Added max-w-4xl to prevent it from stretching too wide on massive screens, 
             and scaled down padding (p-6) and rounding (rounded-2xl) for mobile. */}
        <div>
          
          {/* 3. Header margins scaled down for mobile */}
          <header className="mb-8 md:mb-12 border-b border-slate-100 pb-6 md:pb-8">
            {/* 4. Responsive Title: 3xl on phones, 4xl on tablets, 5xl on desktops */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 uppercase italic tracking-tighter">
              {pageData.title}
            </h1>
          </header>

          {/* 5. Typography: Uses default 'prose' (base size) for mobile, and jumps to 'prose-lg' for tablets/desktop */}
          <div 
            class="prose prose-base md:prose-lg prose-slate max-w-none md:text-left text-justify prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-a:text-daijex-red prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: pageData.body }} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Page;