import React, { useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router';
import { products } from '../data/mockData';
import { cn } from './ui/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from './ui/command';

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (productId: string) => {
    setOpen(false);
    navigate('/catalog');
    console.log(`Selected product: ${productId}`);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (stock < 50) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50' };
    return { label: 'In Stock', color: 'text-emerald-600 bg-emerald-50' };
  };

  return (
    <div className="relative w-full max-w-sm lg:max-w-xl z-50">
      <Command 
        className={cn(
            "rounded-xl border border-emerald-100/50 bg-emerald-50/30 overflow-visible",
            "focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500/50 transition-all shadow-sm"
        )}
        shouldFilter={true}
      >
        <div 
            className="flex items-center px-4" 
            onClick={() => setOpen(true)}
        >
          <Search className="w-5 h-5 text-emerald-500 shrink-0 mr-3" />
          <CommandPrimitive.Input
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 text-slate-700 font-medium"
            placeholder="Search products by Name, SKU, or Brand..."
            onFocus={() => setOpen(true)}
            onBlur={() => {
                setTimeout(() => setOpen(false), 200);
            }}
          />
        </div>

        {open && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg border border-slate-100 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <CommandList className="max-h-[400px] overflow-y-auto p-1">
              <CommandEmpty className="py-6 text-center text-sm text-slate-500">
                No products found.
              </CommandEmpty>
              <CommandGroup heading="Products">
                {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                        <CommandItem
                            key={product.id}
                            value={`${product.name} ${product.sku} ${product.brand}`}
                            onSelect={() => handleSelect(product.id)}
                            className="flex items-center gap-3 p-2 cursor-pointer aria-selected:bg-emerald-50 aria-selected:text-emerald-900 rounded-md group"
                        >
                            <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                                <span className="font-medium text-slate-900 group-aria-selected:text-emerald-950 truncate">{product.name}</span>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{product.sku}</span>
                                    <span>•</span>
                                    <span className="truncate max-w-[100px]">{product.brand}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="font-semibold text-emerald-700 text-sm whitespace-nowrap">
                                    ${product.price.toFixed(2)}
                                </div>
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${stockStatus.color}`}>
                                    {stockStatus.label} ({product.stock})
                                </span>
                            </div>
                        </CommandItem>
                    );
                })}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
