import { useState, useEffect } from 'react';
import { ENDPOINTS, cleanPath } from '../api/config';

export const useNavigation = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(ENDPOINTS.menu);
        const json = await response.json();
        
        // Drupal JSON:API menu items are in json.data
        const formattedMenu = json.data.map(item => ({
          id: item.id,
          title: item.attributes.title,
          path: cleanPath(item.attributes.url),
          weight: item.attributes.weight || 0
        })).sort((a, b) => a.weight - b.weight); // Sort by Drupal's menu weight

        setMenuItems(formattedMenu);
      } catch (error) {
        console.error("Failed to fetch Drupal menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menuItems, loading };
};