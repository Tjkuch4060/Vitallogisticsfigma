import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/mockData';
import { toast } from 'sonner';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number; // Timestamp for Price Lock
  lockedPrice: number; // The price at the time of adding
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  addItems: (items: { product: Product; quantity: number }[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product) => {
    if (product.stock === 0) {
      toast.error(`Sorry, ${product.name} is out of stock.`);
      return;
    }

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error(`Only ${product.stock} units available for ${product.name}`);
          return prev;
        }

        toast.success(`Updated quantity for ${product.name}`);
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`Added ${product.name} to cart`);
      return [...prev, { 
        product, 
        quantity: 1, 
        addedAt: Date.now(),
        lockedPrice: product.price 
      }];
    });
    setIsOpen(true);
  };

  const addItems = (newItems: { product: Product; quantity: number }[]) => {
    let addedCount = 0;
    let outOfStockCount = 0;
    let partialStockCount = 0;

    setItems((prev) => {
      let currentItems = [...prev];

      newItems.forEach(({ product, quantity }) => {
        // Skip if requested quantity is 0
        if (quantity <= 0) return;

        // Check availability
        if (product.stock === 0) {
            outOfStockCount++;
            return;
        }

        const existingIndex = currentItems.findIndex((item) => item.product.id === product.id);
        
        if (existingIndex >= 0) {
            // Update existing
            const currentQty = currentItems[existingIndex].quantity;
            const availableStock = product.stock - currentQty;
            
            if (availableStock <= 0) {
                outOfStockCount++; // Already at max in cart
                return;
            }

            const quantityToAdd = Math.min(quantity, availableStock);
            if (quantityToAdd < quantity) {
                partialStockCount++;
            } else {
                addedCount++;
            }

            currentItems[existingIndex] = {
                ...currentItems[existingIndex],
                quantity: currentQty + quantityToAdd
            };
        } else {
            // Add new
            const quantityToAdd = Math.min(quantity, product.stock);
            if (quantityToAdd < quantity) {
                partialStockCount++;
            } else {
                addedCount++;
            }

            currentItems.push({
                product,
                quantity: quantityToAdd,
                addedAt: Date.now(),
                lockedPrice: product.price
            });
        }
      });

      return currentItems;
    });

    if (addedCount > 0 || partialStockCount > 0) {
        const msg = partialStockCount > 0 
            ? `Added items to cart (some quantities adjusted due to stock)`
            : `Successfully added ${addedCount} items to cart`;
        toast.success(msg);
        setIsOpen(true);
    }

    if (outOfStockCount > 0) {
        toast.error(`${outOfStockCount} items were out of stock or at limit`);
    }
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => {
      const item = prev.find((item) => item.product.id === productId);
      if (!item) return prev;

      if (quantity > item.product.stock) {
        toast.error(`Only ${item.product.stock} units available for ${item.product.name}`);
        return prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: item.product.stock } : i
        );
      }

      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i
      );
    });
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.lockedPrice * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, addItems, removeItem, updateQuantity, clearCart, isOpen, setIsOpen, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
