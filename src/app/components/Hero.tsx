import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'motion/react';
import { ArrowRight, Leaf, Box, Users, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });
    const spring = useSpring(0, { mass: 1, stiffness: 50, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current) + suffix);
  
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
    { label: 'Brand Partners', value: 50, suffix: '+', icon: Leaf },
    { label: 'Products', value: 1000, suffix: '+', icon: Box },
    { label: 'Avg. Fulfillment', value: 24, suffix: 'h', icon: Clock },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-50/50">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-sm font-medium mb-8">
              <Leaf className="w-4 h-4" />
              <span>Licensed LPHE-R Wholesale Portal</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl/tight font-bold text-slate-900 mb-6 tracking-tight">
              Premium Hemp. <br />
              Wholesale Pricing. <br />
              <span className="text-emerald-700">Zero Hassle.</span>
            </h1>
            
            <p className="text-xl font-medium text-emerald-800 mb-4 italic">
              "No Bad Trips, Just Good Ships"
            </p>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              VitalLogistics connects licensed retailers with premium hemp brands. 
              Browse products, place orders, and manage your wholesale business all in one place.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog">
                <Button size="lg" className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg px-8 h-12 text-base">
                    Browse Products <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg px-8 h-12 text-base">
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
             {/* Decorative element behind card */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-emerald-200/20 rounded-2xl -z-10 transform translate-x-4 translate-y-4" />
            
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl shadow-emerald-900/5 rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col">
                            <dt className="text-4xl font-bold text-emerald-900 mb-1 tabular-nums">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </dt>
                            <dd className="text-slate-500 font-medium text-sm flex items-center gap-2">
                                {stat.label}
                            </dd>
                        </div>
                    ))}
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}