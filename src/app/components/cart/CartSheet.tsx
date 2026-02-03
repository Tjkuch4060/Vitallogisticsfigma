import { useState, useEffect, useRef, startTransition } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useOrderTemplatesStore } from '../../store/orderTemplatesStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Lock, Trash2, Plus, Minus, ShoppingCart, ArrowRight, PackageOpen, Save, FileText, X } from 'lucide-react';
import { Separator } from '../ui/separator';
import { DeliveryCalculator } from './DeliveryCalculator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';

export function CartSheet() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const addItems = useCartStore((state) => state.addItems);
  const total = useCartStore((state) => 
    state.items.reduce((sum, item) => sum + (item.lockedPrice * item.quantity), 0)
  );
  const isOpen = useCartStore((state) => state.isOpen);
  const setIsOpen = useCartStore((state) => state.setIsOpen);
  const { templates, saveTemplate, deleteTemplate, getTemplate } = useOrderTemplatesStore();
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [templateName, setTemplateName] = useState('');
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const navigate = useNavigate();
  const cartRef = useRef<HTMLDivElement>(null);

  // Focus management: When cart opens, focus first interactive element
  useEffect(() => {
    if (isOpen && cartRef.current) {
      // Small delay to ensure the sheet is fully rendered
      setTimeout(() => {
        const firstButton = cartRef.current?.querySelector('button');
        firstButton?.focus();
      }, 100);
    }
  }, [isOpen]);

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date(timestamp));
  };

  // Optimized handler for Sheet open/close - uses startTransition when closing
  const handleSheetOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true);
    } else {
      startTransition(() => {
        setIsOpen(false);
      });
    }
  };

  // Optimized handler for Dialog open/close - uses startTransition when closing
  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setIsSaveDialogOpen(true);
    } else {
      startTransition(() => {
        setIsSaveDialogOpen(false);
      });
    }
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) {
      toast.error('Please enter a template name');
      return;
    }
    if (items.length === 0) {
      toast.error('Cart is empty. Add items before saving as template.');
      return;
    }
    saveTemplate(templateName.trim(), items);
    toast.success(`Template "${templateName.trim()}" saved successfully`);
    setTemplateName('');
    setIsSaveDialogOpen(false);
  };

  // Optimized handler - defers heavy cart operations
  const handleLoadTemplate = (templateId: string) => {
    const template = getTemplate(templateId);
    if (!template) return;
    
    startTransition(() => {
      clearCart();
      const itemsToAdd = template.items.map(item => ({
        product: item.product,
        quantity: item.quantity
      }));
      addItems(itemsToAdd);
      toast.success(`Template "${template.name}" loaded`);
      setIsOpen(false);
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col" ref={cartRef}>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Order ({items.length})
            </SheetTitle>
            {items.length > 0 && (
              <Dialog open={isSaveDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
                    <Save className="w-4 h-4" />
                    Save Template
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Order Template</DialogTitle>
                    <DialogDescription>
                      Save this cart as a reusable template for future orders.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Template name (e.g., Weekly Order)"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveTemplate();
                        }
                      }}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => handleDialogOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveTemplate}>
                      Save Template
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </SheetHeader>
        
        <ScrollArea className="flex-1 -mx-6 px-6 my-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center px-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <PackageOpen className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Your cart is empty</h3>
              <p className="text-slate-500 mb-8 max-w-[200px]">
                Looks like you haven't added any products to your order yet.
              </p>
              <Button 
                variant="outline" 
                className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={() => {
                  handleSheetOpenChange(false);
                  navigate('/catalog');
                }}
              >
                Browse Products <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                      <div className="flex flex-col gap-1 mt-1">
                        <span className="text-xs text-slate-500">{item.product.brand}</span>
                        {/* Price Lock Indicator */}
                        <div className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 w-fit">
                            <Lock className="w-3 h-3" />
                            <span>Price Locked @ {formatTime(item.addedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                       <div className="font-bold text-slate-900">${item.lockedPrice.toFixed(2)}</div>
                       <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                           <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="w-3 h-3" />
                          </Button>
                       </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500" onClick={() => removeItem(item.product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
            {/* Order Templates Section */}
            {templates.length > 0 && (
              <div className="mb-4 pb-4 border-b border-slate-100">
                <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Order Templates
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{template.name}</p>
                        <p className="text-xs text-slate-500">
                          {template.items.length} item{template.items.length !== 1 ? 's' : ''} • {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadTemplate(template.id)}
                          className="h-7 px-2 text-emerald-600 hover:text-emerald-700"
                        >
                          Load
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            deleteTemplate(template.id);
                            toast.success('Template deleted');
                          }}
                          className="h-7 w-7 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <DeliveryCalculator onCalculate={(info) => setShippingFee(info ? info.fee : 0)} />
            
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping Estimate</span>
                <span className={`font-medium ${shippingFee === 0 ? 'text-slate-400' : 'text-slate-900'}`}>
                    {shippingFee === 0 ? '--' : `$${shippingFee.toFixed(2)}`}
                </span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold text-slate-900">
                <span>Total</span>
                <span>${(total + shippingFee).toFixed(2)}</span>
                </div>
            </div>
            <Button 
                className="w-full bg-emerald-700 hover:bg-emerald-800" 
                disabled={items.length === 0}
                onClick={() => {
                handleSheetOpenChange(false);
                navigate('/checkout');
                }}
            >
                Proceed to Checkout
            </Button>
            </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
