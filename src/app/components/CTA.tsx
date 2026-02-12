import React from 'react';
import { Button } from './ui/button';

export function CTA() {
  return (
    <section className="bg-emerald-900 py-24 md:py-32 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-white rounded-full blur-[128px] translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute left-0 bottom-0 w-[400px] h-[400px] bg-emerald-400 rounded-full blur-[96px] -translate-x-1/2 translate-y-1/2"></div>
        </div>

      <div className="container mx-auto max-w-7xl px-4 md:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Join Minnesota's Premier Hemp Wholesale Network
        </h2>
        <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed opacity-90">
          Connect with top brands, streamline your ordering process, and grow your retail business with VitalLogistics.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button 
            size="lg" 
            className="bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl px-10 py-4 h-auto text-base font-bold shadow-xl hover:scale-105 transition-all duration-300 w-full sm:w-auto border-none"
          >
            View Products
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-emerald-900 rounded-xl px-10 py-4 h-auto text-base font-bold transition-all duration-300 w-full sm:w-auto"
          >
            Apply for Access
          </Button>
        </div>
      </div>
    </section>
  );
}
