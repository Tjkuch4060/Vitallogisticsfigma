import { useState, useEffect } from 'react';
import { Product } from '../../data/mockData';
import { Dialog, DialogContent, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, Truck, FileText, Calculator, Info } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { addDays, format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ProductQuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductQuickView({ product, isOpen, onClose }: ProductQuickViewProps) {
  const [msrp, setMsrp] = useState<number>(product.price * 2);
  
  // Calculate margin
  const margin = msrp - product.price;
  const marginPercent = msrp > 0 ? ((margin / msrp) * 100).toFixed(1) : '0.0';

  // Delivery Estimates (Simulated based on Zone 1 default)
  const deliveryDate = addDays(new Date(), 2); // Zone 1 = +2 days roughly

  // Focus management: When dialog opens, focus first interactive element
  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the dialog is fully rendered
      setTimeout(() => {
        const dialog = document.querySelector('[role="dialog"]');
        const firstButton = dialog?.querySelector('button') as HTMLButtonElement;
        firstButton?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column: Image & Basic Info */}
          <div className="space-y-4">
             <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
                <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-white/90 text-slate-800 hover:bg-white/90 backdrop-blur-sm">
                    {product.category}
                </Badge>
             </div>
             
             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                 <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Documentation
                 </h4>
                 <div className="grid grid-cols-2 gap-2 text-xs">
                     <div>
                         <span className="text-slate-500 block">Batch Number</span>
                         <span className="font-mono text-slate-700">{product.batchNumber || 'N/A'}</span>
                     </div>
                     <div>
                         <span className="text-slate-500 block">CoA Status</span>
                         <a href="#" className="text-emerald-600 hover:underline flex items-center gap-1">
                            Download PDF
                         </a>
                     </div>
                 </div>
             </div>
          </div>

          {/* Right Column: Details & Calculator */}
          <div className="space-y-6">
             <div>
                 <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{product.name}</h2>
                        <p className="text-emerald-600 font-medium">{product.brand}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded text-amber-700 text-xs font-medium">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {product.rating}
                    </div>
                 </div>
                 
                 <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                    {product.description || "No description available."}
                 </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">THC Content</div>
                    <div className="font-semibold text-slate-900">{product.thc}mg <span className="text-xs font-normal text-slate-500">per unit</span></div>
                 </div>
                 <div className="p-3 bg-slate-50 rounded border border-slate-100">
                    <div className="text-xs text-slate-500 mb-1">Available Quantity</div>
                    <div className={`${product.stock > 0 ? 'text-emerald-700' : 'text-red-600'} font-semibold`}>
                        {product.stock > 0 ? `${product.stock} units` : 'Out of Stock'}
                    </div>
                 </div>
             </div>

             <Separator />

             {/* Margin Calculator */}
             <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-emerald-600" />
                        Margin Calculator
                    </h4>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <Info className="w-3.5 h-3.5 text-slate-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-xs w-48">Estimate your profit based on your custom retail pricing.</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                
                <div className="grid grid-cols-3 gap-3 items-end">
                    <div>
                        <Label className="text-xs text-slate-500">Wholesale Cost</Label>
                        <div className="h-9 flex items-center px-3 bg-slate-100 rounded text-sm font-medium text-slate-600">
                            ${product.price.toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="msrp-input" className="text-xs text-slate-500">Retail Price</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                            <Input 
                                id="msrp-input" 
                                type="number" 
                                value={msrp} 
                                onChange={(e) => setMsrp(Number(e.target.value))}
                                className="pl-6 h-9" 
                            />
                        </div>
                    </div>
                    <div>
                         <Label className="text-xs text-slate-500">Est. Profit</Label>
                         <div className={`h-9 flex items-center justify-between px-3 rounded text-sm font-bold ${margin >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                            <span>${margin.toFixed(2)}</span>
                            <span className="text-xs opacity-80">{marginPercent}%</span>
                         </div>
                    </div>
                </div>
             </div>

             <Separator />

             {/* Delivery Estimate */}
             <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-start gap-3">
                 <Truck className="w-5 h-5 text-blue-600 mt-0.5" />
                 <div>
                     <div className="text-sm font-medium text-blue-900">Estimated Delivery: {format(deliveryDate, 'MMM dd, yyyy')}</div>
                     <div className="text-xs text-blue-700 mt-0.5">
                         Based on Zone 1 delivery schedule (1-2 business days).
                     </div>
                 </div>
             </div>

             <DialogFooter className="mt-4">
                 <Button variant="outline" onClick={onClose}>Close</Button>
                 <Button className="bg-emerald-700 hover:bg-emerald-800 w-full sm:w-auto" disabled={product.stock <= 0}>
                    {product.stock > 0 ? 'Add to Order' : 'Notify When Available'}
                 </Button>
             </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
