import React, { useState, useMemo, useEffect } from 'react';
import { products, Product } from '../data/mockData';
import { Card, CardContent, CardFooter, CardHeader } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Star, ShoppingCart, Filter, SlidersHorizontal, Eye, FileText, ShieldCheck, LayoutGrid, List } from 'lucide-react';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import { ProductFilters, FilterState } from '../components/catalog/ProductFilters';
import { ProductQuickView } from '../components/catalog/ProductQuickView';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group';
import { useCart } from '../context/CartContext';
import { Skeleton } from '../components/ui/skeleton';

export function Catalog() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

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

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
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
  }, [filters]);

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
    <div className="container mx-auto px-4 md:px-8 py-8">
      <AppBreadcrumb />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Wholesale Catalog</h1>
          <p className="text-slate-500 mt-1">Browse premium hemp products available for licensed retailers.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200 mr-2">
                <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as 'grid' | 'list')}>
                    <ToggleGroupItem value="grid" aria-label="Grid View" className="h-8 w-8 p-0 data-[state=on]:bg-white data-[state=on]:shadow-sm">
                        <LayoutGrid className="w-4 h-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List View" className="h-8 w-8 p-0 data-[state=on]:bg-white data-[state=on]:shadow-sm">
                        <List className="w-4 h-4" />
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" className="md:hidden flex-1 gap-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <ProductFilters 
                            filters={filters} 
                            onFilterChange={setFilters}
                            availableCategories={categories}
                            availableBrands={brands}
                            priceBounds={priceBounds}
                            thcBounds={thcBounds}
                        />
                    </div>
                </SheetContent>
            </Sheet>

            <Button className="flex-1 md:flex-none">
                <ShoppingCart className="w-4 h-4 mr-2" /> Cart (0)
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
            <div className="mb-4 text-sm text-slate-500">
                {loading ? <Skeleton className="h-4 w-32" /> : `Showing ${filteredProducts.length} results`}
            </div>

            {loading ? (
                <ProductGridSkeleton />
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-100">
                    <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No products found</h3>
                    <p className="text-slate-500">Try adjusting your filters to see more results.</p>
                    <Button 
                        variant="link" 
                        onClick={() => setFilters({
                            categories: [],
                            brands: [],
                            priceRange: priceBounds,
                            thcRange: thcBounds,
                            inStockOnly: false
                        })}
                        className="mt-2 text-emerald-600"
                    >
                        Clear all filters
                    </Button>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200 h-full flex flex-col group">
                        <div className="relative aspect-square bg-slate-100">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                                <Badge className="bg-white/90 text-emerald-800 hover:bg-white/90 backdrop-blur-sm shadow-sm w-fit">
                                    {product.category}
                                </Badge>
                                {getStockBadge(product.stock)}
                            </div>
                            
                            {/* Quick View Overlay Button */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Button 
                                    onClick={() => setQuickViewProduct(product)}
                                    className="bg-white text-slate-900 hover:bg-slate-100 font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Quick View
                                </Button>
                            </div>
                        </div>
                        
                        <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div>
                            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">{product.brand}</p>
                            <h3 className="font-bold text-base text-slate-900 leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                            </div>
                        </div>
                        </CardHeader>
                        
                        <CardContent className="pb-4 flex-grow">
                            <div className="flex items-center gap-1 mb-3">
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                                <span className="text-xs text-slate-400 ml-1">(24)</span>
                            </div>
                            
                            <div className="space-y-1">
                                {product.thc !== undefined && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">THC Content</span>
                                        <span className="font-medium text-slate-700">{product.thc}mg</span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5" title="Verified Lab Results">
                                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Pass</span>
                                </div>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-7 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(product.coaLink || '#', '_blank');
                                    }}
                                >
                                    <FileText className="w-3 h-3 mr-1.5" />
                                    View CoA
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-0 mt-auto block border-t border-slate-50 p-4 bg-slate-50/50">
                             <div className="flex justify-between items-end mb-3">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">Wholesale</p>
                                    <p className="text-xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 uppercase font-medium">MSRP</p>
                                    <p className="text-sm font-medium text-slate-400 line-through decoration-slate-300">${(product.price * 2).toFixed(2)}</p>
                                </div>
                            </div>
                            <Button 
                                className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-sm shadow-emerald-200" 
                                disabled={product.stock <= 0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addItem(product);
                                }}
                            >
                                {product.stock > 0 ? 'Add to Order' : 'Notify When Available'}
                            </Button>
                        </CardFooter>
                    </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow duration-200">
                            {/* Image */}
                            <div className="w-full md:w-24 md:h-24 shrink-0 relative bg-slate-100 rounded-md overflow-hidden group cursor-pointer" onClick={() => setQuickViewProduct(product)}>
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                     <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                                </div>
                            </div>

                            {/* Details */}
                            <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-4 w-full items-center">
                                {/* Info */}
                                <div className="md:col-span-4">
                                    <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">{product.brand}</div>
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1 cursor-pointer hover:text-emerald-700" onClick={() => setQuickViewProduct(product)}>
                                        {product.name}
                                    </h3>
                                    <div className="text-xs text-slate-500 font-mono">SKU: {product.sku}</div>
                                </div>

                                {/* Specs & Status */}
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

                                {/* Price */}
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

                                {/* Actions */}
                                <div className="md:col-span-2 flex flex-col gap-2">
                                    <Button 
                                        className="w-full bg-emerald-700 hover:bg-emerald-800 shadow-sm shadow-emerald-200 h-9 text-sm" 
                                        disabled={product.stock <= 0}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addItem(product);
                                        }}
                                    >
                                        {product.stock > 0 ? 'Add' : 'Notify'}
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-7 text-xs text-slate-500 hover:text-emerald-700"
                                        onClick={() => setQuickViewProduct(product)}
                                    >
                                        Quick View
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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