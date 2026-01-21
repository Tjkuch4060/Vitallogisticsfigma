import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'motion/react';
import { ArrowRight, Leaf, Box, Users, Clock, Building2, Package } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router';

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const spring = useSpring(0, { mass: 1, stiffness: 40, damping: 20 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString() + suffix);
  
    useEffect(() => {
      if (isInView) {
        spring.set(value);
      }
    }, [isInView, spring, value]);
  
    return <motion.span ref={ref}>{display}</motion.span>;
}

export function Hero() {
  const stats = [
    { label: 'Active Retailers', value: 500, suffix: '+', icon: Users },
    { label: 'Brand Partners', value: 50, suffix: '+', icon: Building2 },
    { label: 'Products', value: 1000, suffix: '+', icon: Package },
    { label: 'Avg. Fulfillment', value: 24, suffix: 'h', icon: Clock },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-32">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl relative"
          >
            {/* Headline Gradient Background */}
            <div className="absolute -inset-x-8 -inset-y-4 bg-gradient-to-r from-emerald-50/50 to-transparent -z-10 rounded-3xl" />
            
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 sm:bg-gradient-to-r sm:from-emerald-600 sm:to-teal-600 text-white text-sm font-bold mb-12 shadow-lg ring-2 ring-emerald-500 ring-offset-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Leaf size={18} className="text-emerald-100" />
              <span className="tracking-wide text-xs sm:text-sm">Licensed LPHE-R Wholesale Portal</span>
            </div>
            
            <h1 className="flex flex-col mb-6 tracking-tight text-slate-900 leading-[1.05]">
              <span className="text-[42px] md:text-[72px] font-extrabold">Premium Hemp.</span>
              <span className="text-[42px] md:text-[72px] font-semibold text-slate-800">Wholesale Pricing.</span>
              <span className="text-[42px] md:text-[72px] font-bold text-emerald-700">Zero Hassle.</span>
            </h1>
            
            <p className="text-lg md:text-xl font-semibold text-emerald-900 mb-6 italic tracking-tight">
              "No Bad Trips, Just Good Ships"
            </p>
            
            <p className="text-base md:text-lg text-slate-600 mb-12 leading-[1.8] max-w-lg">
              VitalLogistics connects licensed retailers with premium hemp brands. 
              Browse products, place orders, and manage your wholesale business all in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-5 h-auto text-base shadow-lg hover:shadow-emerald-900/20 hover:scale-105 transition-all duration-300 relative overflow-hidden group border-none"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <span className="relative z-10 flex items-center justify-center">
                    Browse Products <ArrowRight size={20} className="ml-2 hover:rotate-6 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl px-8 py-5 h-auto text-base transition-all duration-200"
                >
                  My Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right Content - Stats Card */}
          <motion.div
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="relative"
          >
            {/* Gradient top border container */}
            <div className="relative border-t-4 border-emerald-500 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/10">
                {/* Visual gradient for the border-t-4 effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600" />
                
                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-b-2xl p-10 md:p-14 border border-stone-200 border-t-0">
                    <div className="grid grid-cols-2 gap-y-16 gap-x-12">
                        {stats.map((stat, i) => (
                            <div key={i} className="flex flex-col items-start group">
                                <div className="mb-6 rounded-full bg-emerald-100 p-4 group-hover:bg-emerald-200 transition-colors">
                                    <stat.icon size={48} strokeWidth={1.5} className="text-emerald-600 group-hover:text-emerald-700 group-hover:rotate-6 transition-all" />
                                </div>
                                <dt className="text-[56px] font-bold text-emerald-700 mb-1 tabular-nums leading-none tracking-tight">
                                    <Counter value={stat.value} suffix={stat.suffix} />
                                </dt>
                                <dd className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.15em]">
                                    {stat.label}
                                </dd>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}