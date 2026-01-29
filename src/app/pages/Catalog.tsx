import { useState, useMemo, useEffect } from 'react';
import { products, Product } from '../data/mockData';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ShoppingCart, Filter, SlidersHorizontal, LayoutGrid, List, Search, X } from 'lucide-react';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import { ProductFilters, FilterState } from '../components/catalog/ProductFilters';
import { ProductQuickView } from '../components/catalog/ProductQuickView';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { Skeleton } from '../components/ui/skeleton';
import { ProductCard } from '../components/catalog/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { useProductSearch } from '../hooks/useProductSearch';
import { useDebounce } from '../hooks/useDebounce';

export function Catalog() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  
  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);
  
  // Search products using Fuse.js
  const searchedProducts = useProductSearch(products, debouncedSearch);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Extract available options and bounds from data
  const { categories, brands, priceBounds, thcBounds } = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category))).sort();
    const brs = Array.from(new Set(products.map(p => p.brand))).sort();
    const prices = products.map(p => p.price);
    const thcs = products.map(p => p.thc || 0);

    return {
        categories: cats,
        brands: brs,
        priceBounds: [Math.min(...prices, 0), Math.max(...prices, 100)] as [number, number],
        thcBounds: [Math.min(...thcs, 0), Math.max(...thcs, 100)] as [number, number]
    };
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: priceBounds,
    thcRange: thcBounds,
    inStockOnly: false
  });

  // Filter products (apply filters on searched products)
  const filteredProducts = useMemo(() => {
    return searchedProducts.filter(product => {
        // Category filter
        if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
            return false;
        }
        
        // Brand filter
        if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
            return false;
        }

        // Price filter
        if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
            return false;
        }

        // THC filter
        const productThc = product.thc || 0;
        if (productThc < filters.thcRange[0] || productThc > filters.thcRange[1]) {
            return false;
        }

        // In Stock filter
        if (filters.inStockOnly && product.stock <= 0) {
            return false;
        }

        return true;
    });
  }, [filters, searchedProducts]);

  const ProductGridSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden border-slate-200 h-full flex flex-col">
           <Skeleton className="aspect-square w-full" />
           <CardHeader className="pb-2 space-y-2">
             <Skeleton className="h-3 w-1/3" />
             <Skeleton className="h-5 w-3/4" />
           </CardHeader>
           <CardContent className="pb-4 flex-grow space-y-3">
             <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-8" />
                <Skeleton className="h-3 w-8" />
             </div>
             <Skeleton className="h-3 w-full" />
             <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-20" />
             </div>
           </CardContent>
           <CardFooter className="pt-0 mt-auto block border-t border-slate-50 p-4 bg-slate-50/50">
             <Skeleton className="h-10 w-full" />
           </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
      <AppBreadcrumb />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 mt-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-3">
            <Filter className="w-3.5 h-3.5" />
            Wholesale Network
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Product Catalog</h1>
          <p className="text-slate-600 mt-3 text-lg max-w-xl">Browse premium hemp products available for licensed retailers with real-time stock status.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden md:flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 mr-2">
                <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')}>
                    <ToggleGroupItem value="grid" aria-label="Grid View" className="h-9 w-10 p-0 data-[state=on]:bg-white data-[state=on]:shadow-md data-[state=on]:text-emerald-700 rounded-lg">
                        <LayoutGrid size={20} className="hover:rotate-6 transition-transform" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List View" className="h-9 w-10 p-0 data-[state=on]:bg-white data-[state=on]:shadow-md data-[state=on]:text-emerald-700 rounded-lg">
                        <List size={20} className="hover:rotate-6 transition-transform" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden flex-1 gap-2 h-11 rounded-xl border-slate-200 font-bold">
                        <SlidersHorizontal size={20} className="hover:rotate-6 transition-transform" />
                        Filters
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto rounded-r-3xl">
                    <SheetHeader className="mb-8">
                        <SheetTitle className="text-2xl font-bold">Refine Catalog</SheetTitle>
                    </SheetHeader>
                    <ProductFilters 
                        filters={filters} 
                        onFilterChange={setFilters}
                        availableCategories={categories}
                        availableBrands={brands}
                        priceBounds={priceBounds}
                        thcBounds={thcBounds}
                    />
                </SheetContent>
            </Sheet>

            <Button className="flex-1 md:flex-none h-11 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 font-bold shadow-lg shadow-emerald-900/10 border-none transition-all hover:scale-105">
                <ShoppingCart size={20} className="mr-2 hover:rotate-6 transition-transform" /> Cart (0)
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Desktop Sidebar */}
        <div className="hidden md:block col-span-1">
            <div className="sticky top-24">
                <ProductFilters 
                    filters={filters} 
                    onFilterChange={setFilters}
                    availableCategories={categories}
                    availableBrands={brands}
                    priceBounds={priceBounds}
                    thcBounds={thcBounds}
                />
            </div>
        </div>

        {/* Product Grid */}
        <div className="col-span-1 md:col-span-3">
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search products by name, brand, category, or description..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="mb-4 text-sm text-slate-500">
                {loading ? <Skeleton className="h-4 w-32" /> : `Showing ${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''}${searchInput ? ` for "${searchInput}"` : ''}`}
            </div>

            {loading ? (
                <ProductGridSkeleton />
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter size={48} className="text-emerald-600 hover:rotate-6 transition-transform" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                    <p className="text-slate-500">
                      {searchInput 
                        ? `No products match "${searchInput}". Try adjusting your search or filters.`
                        : 'Try adjusting your filters to see more results.'}
                    </p>
                    <div className="flex gap-2 justify-center mt-4">
                      {searchInput && (
                        <Button 
                          variant="outline" 
                          onClick={() => setSearchInput('')}
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        >
                          Clear search
                        </Button>
                      )}
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setFilters({
                            categories: [],
                            brands: [],
                            priceRange: priceBounds,
                            thcRange: thcBounds,
                            inStockOnly: false
                          });
                          setSearchInput('');
                        }}
                        className="text-emerald-600"
                      >
                        Clear all filters
                      </Button>
                    </div>
                </div>
            ) : (
                <motion.div 
                    layout
                    className={viewMode === 'grid' 
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                        : "flex flex-col gap-4"
                    }
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onQuickView={setQuickViewProduct} 
                                viewMode={viewMode} 
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
      </div>
      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView 
            product={quickViewProduct} 
            isOpen={!!quickViewProduct} 
            onClose={() => setQuickViewProduct(null)} 
        />
      )}
    </div>
  );
}