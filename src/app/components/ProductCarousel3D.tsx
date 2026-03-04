import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: number;
  name: string;
  category: string;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Premium CBD Oil',
    category: 'Tinctures',
    description: 'Full-spectrum hemp extract with natural terpenes',
    image: 'https://images.unsplash.com/photo-1610109790326-9a21dfe969b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwY2JkJTIwb2lsJTIwYm90dGxlJTIwZHJvcHBlciUyMHRpbmN0dXJlfGVufDF8fHx8MTc3MDk5ODcyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 2,
    name: 'Hemp Gummies',
    category: 'Edibles',
    description: 'Delicious fruit-flavored wellness gummies',
    image: 'https://images.unsplash.com/photo-1666402668168-72bdbd6f06d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZW1wJTIwY2JkJTIwZ3VtbWllcyUyMHBhY2thZ2UlMjBlZGlibGV8ZW58MXx8fHwxNzcwOTk4NzI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 3,
    name: 'Soothing Cream',
    category: 'Topicals',
    description: 'Nourishing topical relief with organic ingredients',
    image: 'https://images.unsplash.com/photo-1594813591867-02e797aa4581?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYmQlMjBjcmVhbSUyMGphciUyMHNraW5jYXJlJTIwdG9waWNhbHxlbnwxfHx8fDE3NzA5OTg3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 4,
    name: 'Artisan Flower',
    category: 'Flower',
    description: 'Hand-trimmed premium hemp flower',
    image: 'https://images.unsplash.com/photo-1677275856575-0565afb3b9b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZW1wJTIwZmxvd2VyJTIwY2FubmFiaXMlMjBidWQlMjBqYXJ8ZW58MXx8fHwxNzcwOTk4NzI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 5,
    name: 'Wellness Capsules',
    category: 'Capsules',
    description: 'Convenient daily hemp supplement capsules',
    image: 'https://images.unsplash.com/photo-1571170348153-61f5e9b185ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYmQlMjB3ZWxsbmVzcyUyMGNhcHN1bGVzJTIwYm90dGxlJTIwc3VwcGxlbWVudHxlbnwxfHx8fDE3NzA5OTg3MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
  {
    id: 6,
    name: 'Vape Cartridge',
    category: 'Vapes',
    description: 'Premium distillate vape cartridges',
    image: 'https://images.unsplash.com/photo-1605117913123-1f455435b384?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW5uYWJpcyUyMHZhcGUlMjBjYXJ0cmlkZ2UlMjBwZW58ZW58MXx8fHwxNzcwOTk4NzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  },
];

export function ProductCarousel3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoRotateRef = useRef<ReturnType<typeof setInterval>>();
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation
  useEffect(() => {
    if (!isPaused) {
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 5000);
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [isPaused]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const currentProduct = products[currentIndex];
  const nextProducts = [
    products[(currentIndex + 1) % products.length],
    products[(currentIndex + 2) % products.length],
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-b-2xl p-10 md:p-14 border border-stone-200 border-t-0 relative overflow-hidden">
      {/* Background depth effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-100/20 to-emerald-200/30 pointer-events-none" />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-8 right-8 text-emerald-600/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles size={48} />
      </motion.div>

      {/* Main Showcase */}
      <div className="relative z-10">
        {/* Featured Product */}
        <div className="relative mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Product Image */}
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-2xl group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-square bg-gradient-to-br from-stone-100 to-stone-50">
                    <ImageWithFallback
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-transparent" />
                    
                    {/* Shimmer effect on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 1.5 }}
                    />
                  </div>

                  {/* Featured badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full shadow-lg backdrop-blur-sm">
                    Featured
                  </div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-6"
                >
                  <div>
                    <motion.div 
                      className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-[0.15em] rounded-full mb-4"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {currentProduct.category}
                    </motion.div>
                    
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                      {currentProduct.name}
                    </h3>
                    
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {currentProduct.description}
                    </p>
                  </div>

                  {/* Product highlights */}
                  <motion.div
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
                      <div className="text-2xl font-bold text-emerald-700 mb-1">100%</div>
                      <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">Natural</div>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-sm">
                      <div className="text-2xl font-bold text-emerald-700 mb-1">Lab</div>
                      <div className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600">Tested</div>
                    </div>
                  </motion.div>

                  {/* View details button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-900/30 transition-all duration-200 text-sm uppercase tracking-[0.1em]"
                  >
                    View Details
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnail Navigation */}
        <div className="flex items-center gap-4 justify-center mt-12">
          <button
            onClick={handlePrevious}
            className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-900/30 transition-all hover:scale-110 active:scale-95 z-10"
            aria-label="Previous product"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Product thumbnails */}
          <div className="flex gap-3 overflow-hidden px-4">
            {products.map((product, index) => (
              <motion.button
                key={product.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 3000);
                }}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-4 ring-emerald-500 ring-offset-2 ring-offset-emerald-50 scale-110'
                    : 'opacity-60 hover:opacity-100'
                }`}
                whileHover={{ scale: index === currentIndex ? 1.1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-16 h-16 md:w-20 md:h-20">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {index === currentIndex && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 border-2 border-emerald-500 rounded-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-900/30 transition-all hover:scale-110 active:scale-95 z-10"
            aria-label="Next product"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {products.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-12 bg-emerald-600'
                  : 'w-8 bg-emerald-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}