import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '../ui/sheet';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Lock, Trash2, Plus, Minus, ShoppingCart, ArrowRight, PackageOpen } from 'lucide-react';
import { Separator } from '../ui/separator';
import { DeliveryCalculator } from './DeliveryCalculator';
import { useNavigate } from 'react-router-dom';

export function CartSheet() {
  const { items, removeItem, updateQuantity, total, isOpen, setIsOpen } = useCart();
  const [shippingFee, setShippingFee] = useState<number>(0);
  const navigate = useNavigate();

  const formatTime = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(new Date(timestamp));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Order ({items.length})
          </SheetTitle>
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
                  setIsOpen(false);
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
                setIsOpen(false);
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