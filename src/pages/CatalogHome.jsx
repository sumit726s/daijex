import Layout from '../components/layout/Layout';
import HeroSlider from '../features/banner/HeroSlider';

const CatalogHome = () => {
  return (
    <div>
      <HeroSlider />
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-black mb-8 uppercase italic">Featured Accessories</h2>
        {/* Your content here */}
      </section>
    </div>
  );
};

export default CatalogHome;