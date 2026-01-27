import React from 'react';
import { useCompareStore } from '../store/compareStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { AppBreadcrumb } from '../components/AppBreadcrumb';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';

export function CompareProducts() {
  const { compareList, removeFromCompare, clearCompare } = useCompareStore();
  const addItem = useCartStore((state) => state.addItem);

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
        <AppBreadcrumb />
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No products to compare</h2>
          <p className="text-slate-500 mb-8">Add products to your comparison list to see side-by-side details.</p>
        </div>
      </div>
    );
  }

  const features = [
    { label: 'Price', getValue: (p: typeof compareList[0]) => `$${p.price.toFixed(2)}` },
    { label: 'Brand', getValue: (p: typeof compareList[0]) => p.brand },
    { label: 'Category', getValue: (p: typeof compareList[0]) => p.category },
    { label: 'THC Content', getValue: (p: typeof compareList[0]) => `${p.thc}mg` },
    { label: 'Stock', getValue: (p: typeof compareList[0]) => p.stock > 0 ? `${p.stock} units` : 'Out of Stock' },
    { label: 'Rating', getValue: (p: typeof compareList[0]) => `${p.rating}/5.0` },
    { label: 'SKU', getValue: (p: typeof compareList[0]) => p.sku },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-20">
      <AppBreadcrumb />
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 mt-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Compare Products</h1>
          <p className="text-slate-600 mt-3">Side-by-side comparison of selected products</p>
        </div>
        <Button 
          variant="outline" 
          onClick={clearCompare}
          className="rounded-xl border-slate-200 font-bold text-slate-600 h-10 px-5"
        >
          Clear All
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] sticky left-0 bg-white z-10">Feature</TableHead>
                  {compareList.map(product => (
                    <TableHead key={product.id} className="min-w-[250px]">
                      <div className="flex flex-col gap-2">
                        <div className="relative">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                            aria-label="Remove from comparison"
                          >
                            <X className="w-4 h-4 text-slate-600" />
                          </button>
                        </div>
                        <h3 className="font-bold text-slate-900">{product.name}</h3>
                        <Button
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => {
                            addItem(product);
                            toast.success(`Added ${product.name} to cart`);
                          }}
                          disabled={product.stock <= 0}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-semibold sticky left-0 bg-white z-10">
                      {feature.label}
                    </TableCell>
                    {compareList.map(product => (
                      <TableCell key={product.id}>
                        {feature.label === 'Stock' ? (
                          <Badge 
                            variant={product.stock <= 0 ? 'destructive' : product.stock < 20 ? 'default' : 'default'}
                            className={product.stock > 0 && product.stock >= 20 ? 'bg-emerald-100 text-emerald-800' : ''}
                          >
                            {feature.getValue(product)}
                          </Badge>
                        ) : (
                          feature.getValue(product)
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-semibold sticky left-0 bg-white z-10">Description</TableCell>
                  {compareList.map(product => (
                    <TableCell key={product.id} className="max-w-[300px]">
                      <p className="text-sm text-slate-600 line-clamp-3">
                        {product.description || 'No description available'}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
