import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom'; // 1. Import useSearchParams
import { Search, PackageX, Loader2 } from 'lucide-react';
import { useDrupalSearch } from '../../hooks/useDrupalSearch';
import Layout from '../../components/layout/Layout';
import SEO from '../../components/seo/SEO';

const SearchCatalog = () => {
  // 2. Initialize search params
  const [searchParams, setSearchParams] = useSearchParams();

  // 3. Set the initial state of the search box to whatever is in the URL
  const initialQuery = searchParams.get('query_string') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  const { results, loading, error } = useDrupalSearch(searchQuery, 400);

  const isSearchActive = searchQuery.trim().length > 0;
  // 1. Define dynamic text strings
  const metaTitle = isSearchActive 
    ? `Search Results for "${searchQuery}" | Daijex Auto Industries`
    : "Auto Accessories Catalog | Daijex Auto Industries";
    
  const metaDesc = isSearchActive
    ? `Explore search results for "${searchQuery}" in our premium auto accessories catalog.`
    : "Browse our complete catalog of premium auto accessories, including Front Safety Guards, Rear Guards, Roof Rails, and Spoilers.";

  // 2. Construct the metadata array to match the SEO component's expectations
  const pageMetaTags = [
    { tag: 'meta', attributes: { name: 'title', content: metaTitle } },
    { tag: 'meta', attributes: { name: 'description', content: metaDesc } },
    { tag: 'meta', attributes: { name: 'keywords', content: 'auto accessories catalog, car guards, Daijex, roof rails' } },
    { tag: 'meta', attributes: { name: 'robots', content: 'index, follow' } },
    // Open Graph tags for rich previews on WhatsApp/Facebook
    { tag: 'meta', attributes: { property: 'og:title', content: metaTitle } },
    { tag: 'meta', attributes: { property: 'og:description', content: metaDesc } },
    { tag: 'meta', attributes: { property: 'og:type', content: 'website' } }
  ];
  

  // 4. Update the URL whenever the user types in the big search box on this page
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ query_string: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // If the user uses the Header search again while already on the search page,
  // we need to catch that URL change and update our local state.
  useEffect(() => {
    const urlQuery = searchParams.get('query_string') || '';
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  return (
    <Layout>
      <SEO metatags={pageMetaTags} />
      <div className="bg-slate-50 min-h-screen py-16 px-6" role="main">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-12">
            {/* WCAG: Search role and explicit form prevention */}
            <form 
              className="relative w-full max-w-xl mx-auto" 
              role="search"
              onSubmit={(e) => e.preventDefault()} 
            >
              {/* WCAG: Screen reader only label for the input */}
              <label htmlFor="catalog-search" className="sr-only">
                Search auto accessories
              </label>
              <input 
                id="catalog-search"
                type="text" 
                placeholder="Search Daijex Auto parts..."
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-daijex-red focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search auto accessories"
              />
              <Search 
                className="absolute left-4 top-4 text-slate-400" 
                aria-hidden="true" 
                size={20} 
              />
            </form>
          </div>

          {/* WCAG: aria-live polite ensures screen readers announce status changes (loading/error) */}
          <div aria-live="polite">
            {loading && (
              <div className="flex justify-center items-center py-10 text-slate-500 font-bold uppercase tracking-widest">
                <Loader2 className="animate-spin mr-3" aria-hidden="true" /> 
                Searching Catalog...
              </div>
            )}

            {error && (
               <div className="text-center text-red-500 font-bold py-10" role="alert">
                 {error}
               </div>
            )}

            {!loading && !error && results.length === 0 && searchQuery.trim() !== '' && (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                 <PackageX className="mx-auto text-slate-300 mb-4" size={48} aria-hidden="true" />
                 <h3 className="text-xl font-bold text-slate-700">No results found for "{searchQuery}"</h3>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item, index) => {
              
              // 1. Extract the title from the nested array
              const title = item.title?.[0]?.value || 'Unnamed Part';
              
              // 2. Extract the summary for a nice description preview
              const summary = item.body?.[0]?.summary || '';
              
              // 3. Extract the path alias. If it doesn't exist, fallback to the node ID.
              const rawAlias = item.path?.[0]?.alias || `/node/${item.nid?.[0]?.value}`;
              
              // 4. Clean the URL just in case Drupal appended '/api' to the frontend path
              const slug = rawAlias.replace('/api', '');
              
              // Use a combination of node ID and index for a guaranteed unique key
              const uniqueKey = item.nid?.[0]?.value ? `node-${item.nid[0].value}` : `search-res-${index}`;

              return (
                <Link 
                  to={slug} 
                  key={uniqueKey}
                  className="block bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-daijex-red transition-all group focus:outline-none focus:ring-2 focus:ring-daijex-red flex flex-col h-full"
                  aria-label={`View details for ${title}`}
                >
                  <h3 className="text-lg font-black uppercase italic text-slate-900 group-hover:text-daijex-red transition-colors mb-2">
                    {title}
                  </h3>
                  
                  {summary && (
                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                      {summary}
                    </p>
                  )}
                  
                  {/* Pushing the link to the bottom using em for spacing */}
                  <div className="mt-auto pt-[1em]">
                    <span className="text-daijex-red font-bold text-xs uppercase tracking-widest">
                      View details &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default SearchCatalog;