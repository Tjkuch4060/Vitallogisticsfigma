import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingCart, Eye, FileText, ShieldCheck, Heart, Scale } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Product } from '@/app/data/mockData';
import { useCartStore } from '@/app/store/cartStore';
import { useCompareStore } from '@/app/store/compareStore';
import { toast } from 'sonner';
import { triggerAddToCartAnimation } from '@/app/utils/cartAnimations';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  viewMode: 'grid' | 'list';
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  ({ product, onQuickView, viewMode }, ref) => {
    const addItem = useCartStore((state) => state.addItem);
    const favorites = useCartStore((state) => state.favorites);
    const toggleFavorite = useCartStore((state) => state.toggleFavorite);
    const { compareList, addToCompare } = useCompareStore();
    const [isAdded, setIsAdded] = useState(false);
    
    const isFavorite = favorites.includes(product.id);
    const isInCompare = compareList.some(p => p.id === product.id);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      addItem(product);
      setIsAdded(true);
      triggerAddToCartAnimation(e);
      setTimeout(() => setIsAdded(false), 2000);
    };

    const getStockBadge = (stock: number) => {
      if (stock <= 0) {
        return (
          <Badge variant="destructive" className="shadow-sm">
            Out of Stock
          </Badge>
        );
      }
      if (stock < 20) {
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200 shadow-sm">
            Low Stock ({stock})
          </Badge>
        );
      }
      return (
        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200 shadow-sm">
          In Stock ({stock})
        </Badge>
      );
    };

    if (viewMode === 'list') {
      return (
        <motion.div
          ref={ref}
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          whileHover={{ y: -2 }}
          className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
        >
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

          {/* Image */}
          <div 
            className="w-full md:w-24 md:h-24 shrink-0 relative bg-slate-100 rounded-md overflow-hidden group/img cursor-pointer" 
            onClick={() => onQuickView(product)}
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover [filter:saturate(1.1)] group-hover/img:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center">
              <Eye className="w-6 h-6 text-white opacity-0 group-hover/img:opacity-100 drop-shadow-md" />
            </div>
          </div>

          {/* Details */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 w-full items-center">
            <div className="md:col-span-4">
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">{product.brand}</div>
              <h3 
                className="font-bold text-lg text-slate-900 leading-tight mb-1 cursor-pointer hover:text-emerald-700 transition-colors"
                onClick={() => onQuickView(product)}
              >
                {product.name}
              </h3>
              <div className="text-xs text-slate-500 font-mono">SKU: {product.sku}</div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <div className="flex items-center justify-between md:justify-start md:gap-4">
                <div className="text-sm text-slate-600">
                  <span className="text-slate-400 text-xs uppercase mr-2">THC</span>
                  <span className="font-medium">{product.thc}mg</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStockBadge(product.stock)}
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="flex items-center gap-4 md:block">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-medium">Wholesale</p>
                  <p className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
                </div>
                <div className="md:mt-1">
                  <p className="text-[10px] text-slate-500 uppercase font-medium">MSRP</p>
                  <p className="text-sm font-medium text-slate-400 line-through decoration-slate-300">${(product.price * 2).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col gap-2">
              <Button 
                className={`w-full font-bold shadow-sm h-9 text-sm transition-all duration-300 ${
                  isAdded 
                  ? 'bg-emerald-500 hover:bg-emerald-500' 
                  : 'bg-emerald-700 hover:bg-emerald-600 shadow-emerald-200'
                }`} 
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                    >
                      {product.stock > 0 ? 'Add' : 'Notify'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-slate-500 hover:text-emerald-700 transition-colors"
                onClick={() => onQuickView(product)}
              >
                Quick View
              </Button>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full"
      >
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-slate-200 h-full flex flex-col group relative">
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none z-20" />
          
          <div className="relative aspect-square bg-slate-100 overflow-hidden">
            <motion.img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover [filter:saturate(1.1)]"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-30">
              <Badge className="bg-white/90 text-emerald-800 hover:bg-white/90 backdrop-blur-md shadow-md w-fit border-none font-bold">
                {product.category}
              </Badge>
              {getStockBadge(product.stock)}
            </div>

            {/* Favorite Button */}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleFavorite(product.id);
              }}
              className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-all duration-300 shadow-md z-30 group/fav"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <motion.div
                animate={isFavorite ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? "fill-red-500 text-red-500" : "group-hover/fav:scale-110 transition-transform"} 
                />
              </motion.div>
            </button>

            {/* Compare Button */}
            {!isInCompare && compareList.length < 4 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCompare(product);
                  toast.success(`Added ${product.name} to comparison`);
                }}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all duration-300 shadow-md z-30 group/compare"
                aria-label="Add to comparison"
              >
                <Scale size={18} className="group-hover/compare:scale-110 transition-transform" />
              </button>
            )}
            
            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
              <Button 
                onClick={() => onQuickView(product)}
                className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold shadow-xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 rounded-xl px-6"
              >
                <Eye size={20} className="mr-2" />
                Quick View
              </Button>
            </div>
          </div>
          
          <CardHeader className="pb-2">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">{product.brand}</p>
            <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
          </CardHeader>
          
          <CardContent className="pb-4 flex-grow">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={`${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} transition-colors`} 
                />
              ))}
              <span className="text-xs font-bold text-slate-500 ml-1">{product.rating}</span>
            </div>
            
            <div className="space-y-1">
              {product.thc !== undefined && (
                <div className="flex justify-between text-xs items-center p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
                  <span className="text-slate-500 font-medium">THC Content</span>
                  <span className="font-bold text-emerald-700">{product.thc}mg</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded-md">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-[9px] uppercase font-black text-emerald-700 tracking-tighter">Lab Verified</span>
              </div>
              <button 
                className="text-[10px] uppercase font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(product.coaLink || '#', '_blank');
                }}
              >
                <FileText size={14} />
                CoA
              </button>
            </div>
          </CardContent>

          <CardFooter className="pt-0 mt-auto block border-t border-slate-50 p-4 bg-slate-50/50 group-hover:bg-white transition-colors duration-500">
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Wholesale</p>
                <p className="text-2xl font-black text-slate-900 leading-none">${product.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">MSRP</p>
                <p className="text-sm font-bold text-slate-400 line-through decoration-emerald-500/30 decoration-2 leading-none">${(product.price * 2).toFixed(2)}</p>
              </div>
            </div>
            
            <Button 
              className={`w-full font-black text-xs uppercase tracking-widest h-11 rounded-xl transition-all duration-500 ${
                isAdded 
                ? 'bg-emerald-500 hover:bg-emerald-500 scale-95' 
                : 'bg-emerald-900 hover:bg-emerald-800 shadow-lg shadow-emerald-900/10'
              }`} 
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> Added to Order
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2"
                  >
                    {product.stock > 0 ? (
                      <>
                        <ShoppingCart size={18} />
                        Add to Order
                      </>
                    ) : 'Notify When Available'}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
