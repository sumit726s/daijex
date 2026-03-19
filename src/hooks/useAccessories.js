import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { ENDPOINTS, formatAccessoryData } from '../api/config';

export const useAccessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        // Axios automatically handles the base URL and auth headers from your config
        const response = await api.get(ENDPOINTS.accessories);
        
        // Axios returns the parsed JSON directly in the 'data' property
        const json = response.data;
        
        // Map through the nodes and format them using your helper
        if (json.data) {
          const formatted = json.data.map(node => 
            formatAccessoryData(node, json.included)
          );
          setProducts(formatted);
        }
      } catch (err) {
        // Axios throws an error for non-2xx responses automatically
        setError(err.response?.data?.message || err.message);
        console.error('Drupal Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  return { products, loading, error };
};