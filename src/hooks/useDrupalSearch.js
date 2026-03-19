import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/config';

export const useDrupalSearch = (queryString, delay = 500) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!queryString || queryString.trim() === '') {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(ENDPOINTS.search, {
          params: { query_string: queryString }
        });
        
        // ✨ THE FIX: REST Export returns the array directly in response.data
        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search API Error:", err);
        setError(err.message || "Failed to fetch search results");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      performSearch();
    }, delay);

    return () => clearTimeout(timerId);
    
  }, [queryString, delay]);

  return { results, loading, error };
};