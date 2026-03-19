import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/config';
import Layout from '../components/layout/Layout';
import HeroSlider from '../features/banner/HeroSlider';
import CategoryGrid from '../components/ui/CategoryGrid';
import TrustedBrands from '../components/ui/TrustedBrands';
import FeaturedProducts from '../components/ui/FeaturedProducts';
import CustomerReviews from '../components/ui/CustomerReviews';
import SEO from '../components/seo/SEO'; // 1. Import the SEO component


const CatalogHome = () => {
  // 2. Initialize the state to hold the Drupal tags
  const [homeMetatags, setHomeMetatags] = useState(null);

  useEffect(() => {
    const fetchHomeSEO = async () => {
      try {
        // Fetch all basic pages from Drupal
        const response = await api.get(ENDPOINTS.pages);
        const allPages = response.data.data;

        // Tell React to specifically find the page with the root '/' alias
        const homePage = allPages.find(
          (page) => page.attributes.path?.alias === '/node'
        );

        // If found, inject its SEO tags into the component state
        if (homePage && homePage.attributes.metatag) {
          setHomeMetatags(homePage.attributes.metatag);
        }
      } catch (err) {
        console.error("Failed to fetch Home SEO from Drupal:", err);
      }
    };

    fetchHomeSEO();
  }, []);

  return (
    <div>
      <SEO 
        metatags={homeMetatags} 
        fallbackTitle="Premium Car Accessories & ABS Spoilers | Daijex Auto" 
      />

      <HeroSlider />
      <CategoryGrid />
        <TrustedBrands />
        <FeaturedProducts />
        <CustomerReviews />
      </div>
  );
};

export default CatalogHome;