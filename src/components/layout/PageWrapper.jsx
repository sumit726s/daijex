import { motion } from 'framer-motion';

const PageWrapper = ({ children, className = "" }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0 }}
      className={`min-h-screen pt-20 pb-12 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.div>
  );
};

export default PageWrapper;