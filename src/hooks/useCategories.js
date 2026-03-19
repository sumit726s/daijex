// src/hooks/useCategories.js
import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/config'; // Import the endpoints

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Use the centralized endpoint definition
        const response = await api.get(ENDPOINTS.categories); 
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Could not load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};