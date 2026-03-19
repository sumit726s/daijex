import React from 'react';

const BRANDS = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Toyota', 'Honda', 'Kia'];

const TrustedBrands = () => {
  return (
    <section className="bg-white border-y border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Trusted aftermarket parts for leading brands</h2>
        <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
          {BRANDS.map((brand, i) => (
            <div key={i} className="px-6 py-3 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 font-bold hover:bg-white hover:shadow-sm hover:text-daijex-red transition-all cursor-pointer">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBrands;