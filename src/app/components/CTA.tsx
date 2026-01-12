import React from 'react';
import { Button } from './ui/button';

export function CTA() {
  return (
    <section className="bg-emerald-900 py-20 md:py-28 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-white rounded-full blur-[128px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-emerald-400 rounded-full blur-[96px] -translate-x-1/2 translate-y-1/2"></div>
        </div>

      <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          Join Minnesota's Premier Hemp Wholesale Network
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with top brands, streamline your ordering process, and grow your retail business with VitalLogistics.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-emerald-950 hover:bg-emerald-50 h-12 px-8 text-base font-semibold w-full sm:w-auto">
            View Products
          </Button>
          <Button variant="outline" size="lg" className="border-emerald-700 text-emerald-100 hover:bg-emerald-800 hover:text-white border-2 bg-transparent h-12 px-8 text-base font-semibold w-full sm:w-auto">
            Apply for Access
          </Button>
        </div>
      </div>
    </section>
  );
}
