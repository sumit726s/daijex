import React from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { isInstallable, handleInstallClick } = usePWAInstall();

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* 1. PWA INSTALL BANNER */}
      <AnimatePresence>
        {isInstallable && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 w-full z-[200] bg-slate-900 text-white shadow-2xl border-b border-slate-800"
          >
            <div className="w-full px-6 py-4 flex justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black text-sm shadow-inner">
                  D
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-daijex-red">Daijex App</p>
                  <p className="text-sm font-bold text-slate-300">Install for offline catalog browsing</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleInstallClick}
                  className="bg-white text-slate-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 active:scale-95 shadow-lg"
                >
                  <Download size={14} /> Install
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT AREA */}
      {/* Removed max-w-7xl to support full-width pages like ProductDetail */}
      <main className={`transition-all duration-500 ${isInstallable ? 'pt-24' : 'pt-4'}`}>
        <div className="w-screen">
          {children}
        </div>
      </main>

      {/* 3. FOOTER SECTION */}
      <footer className="mt-20 py-12 bg-slate-50 border-t border-slate-100 px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            © 2026 Daijex Automotive | Powered by Drupal 11
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase text-slate-600 tracking-widest">
            <a href="/catalog" className="hover:text-red-600 transition-colors">Catalog</a>
            <a href="/privacy" className="hover:text-red-600 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-red-600 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;