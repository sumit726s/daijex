import { useState, useEffect } from 'react';
import { ENDPOINTS, cleanPath } from '../api/config';
import api from '../api/axiosConfig'; // Import your authenticated axios instance

export const useNavigation = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        // Use the authenticated api instance instead of fetch
        const response = await api.get(ENDPOINTS.menu);
        
        // Axios stores the parsed JSON response in the .data property
        const json = response.data;
        
        if (json.data && Array.isArray(json.data)) {
          // Map through the nodes and format them using your helper
          const formattedMenu = json.data.map(item => ({
            id: item.id,
            title: item.attributes.title,
            // cleanPath ensures URLs work correctly with React Router
            path: cleanPath(item.attributes.url),
            weight: item.attributes.weight || 0
          })).sort((a, b) => a.weight - b.weight); // Sort by Drupal's menu weight

          setMenuItems(formattedMenu);
        }
      } catch (error) {
        // Detailed error logging for debugging
        console.error("Failed to fetch Drupal menu:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return { menuItems, loading };
};