import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/navigation/Navbar';
import CatalogHome from './pages/CatalogHome';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';

// Wrapper to handle exit animations on route change
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<CatalogHome />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/accessory/*" element={<ProductDetail />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 selection:bg-daijex-red selection:text-white">
        <Navbar />
        <AnimatedRoutes />
        <footer className="bg-daijex-dark text-white py-16 mt-20">
          <div className="container mx-auto px-6 text-center opacity-60 text-sm tracking-widest uppercase">
            &copy; 2026 Daijex Automotive | Powered by Drupal 11
          </div>
        </footer>
      </div>
    </Router>
  );
}