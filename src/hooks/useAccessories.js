import { useState, useEffect } from 'react';
import { ENDPOINTS, formatAccessoryData } from '../api/config';

export const useAccessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const response = await fetch(ENDPOINTS.accessories);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const json = await response.json();
        
        // Map through the nodes and format them using your helper
        const formatted = json.data.map(node => 
          formatAccessoryData(node, json.included)
        );
        
        setProducts(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, []);

  return { products, loading, error };
};