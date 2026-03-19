import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { ENDPOINTS } from '../api/config';

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 💡 TODO: Swap this with a real Drupal API call later:
    // const response = await api.get(ENDPOINTS.latestProducts);
    // setProducts(response.data);
    
    setTimeout(() => {
      setProducts([
        { id: 1, title: 'Swift Premium Front Guard', brand: 'Maruti', price: '₹3,499' },
        { id: 2, title: 'Creta Roof Rail ABS', brand: 'Hyundai', price: '₹2,899' },
        { id: 3, title: 'Nexon Rear Bumper Protector', brand: 'Tata', price: '₹1,999' },
        { id: 4, title: 'Innova Crysta Foot Step', brand: 'Toyota', price: '₹4,599' },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  return { products, loading };
};