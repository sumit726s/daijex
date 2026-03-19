import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/navigation/Navbar';
import CatalogHome from './pages/CatalogHome';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Page from './pages/Page';
import SearchCatalog from './features/search/SearchCatalog';

// Wrapper to handle exit animations on route change
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<CatalogHome />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/accessory/*" element={<ProductDetail />} />
        <Route path="/:slug" element={<Page />} />
        <Route path="/search" element={<SearchCatalog />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
      <Router>
        <div className="min-h-screen bg-white selection:bg-daijex-red selection:text-white">
          <Navbar />
          <AnimatedRoutes />
        </div>
      </Router>
  );
}