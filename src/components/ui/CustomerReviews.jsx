import React from 'react';
import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  { id: 1, name: 'Rahul Sharma', location: 'New Delhi', text: 'The build quality of the front guard for my Nexon is exceptional. Perfect fit and very sturdy.', rating: 5 },
  { id: 2, name: 'Amit Patel', location: 'Ahmedabad', text: 'Been buying wholesale from Daijex since 2018. Their roof rails are the best in the aftermarket segment.', rating: 5 },
  { id: 3, name: 'Vikram Singh', location: 'Chandigarh', text: 'Quick shipping and the exact OEM fit for my Creta. Highly recommend their ABS products.', rating: 4 },
];

const CustomerReviews = () => {
  return (
    <section className="bg-slate-900 text-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase italic mb-4">What Our Clients Say</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Trusted by distributors, dealerships, and car enthusiasts across India.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div key={review.id} className="bg-slate-800 p-8 rounded-2xl relative">
              <Quote size={40} className="absolute top-6 right-6 text-slate-700 opacity-50" />
              <div className="flex text-yellow-500 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-slate-300 italic mb-8 relative z-10 leading-relaxed">"{review.text}"</p>
              <div>
                <h4 className="font-bold text-white">{review.name}</h4>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">{review.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;