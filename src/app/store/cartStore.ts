import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/mockData';
import { toast } from 'sonner';

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: number; // Timestamp for Price Lock
  lockedPrice: number; // The price at the time of adding
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  favorites: string[]; // product IDs
  addItem: (product: Product, quantity?: number) => void;
  addItems: (items: { product: Product; quantity: number }[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleFavorite: (productId: string) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      favorites: [],

      addItem: (product: Product, quantity: number = 1) => {
        if (product.stock === 0) {
          toast.error(`Sorry, ${product.name} is out of stock.`);
          return;
        }

        const existing = get().items.find((item) => item.product.id === product.id);
        
        if (existing) {
          if (existing.quantity >= product.stock) {
            toast.error(`Only ${product.stock} units available for ${product.name}`);
            return;
          }

          set((state) => ({
            items: state.items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }));
          toast.success(`Updated quantity for ${product.name}`);
        } else {
          set((state) => ({
            items: [...state.items, {
              product,
              quantity,
              addedAt: Date.now(),
              lockedPrice: product.price
            }]
          }));
          toast.success(`Added ${product.name} to cart`);
        }
        
        // Auto-open cart when item is added
        set({ isOpen: true });
      },

      addItems: (newItems: { product: Product; quantity: number }[]) => {
        let addedCount = 0;
        let outOfStockCount = 0;
        let partialStockCount = 0;

        set((state) => {
          const currentItems = [...state.items];

          newItems.forEach(({ product, quantity }) => {
            if (quantity <= 0) return;

            if (product.stock === 0) {
              outOfStockCount++;
              return;
            }

            const existingItem = currentItems.find((item) => item.product.id === product.id);
            
            if (existingItem) {
              const currentQty = existingItem.quantity;
              const availableStock = product.stock - currentQty;
              
              if (availableStock <= 0) {
                outOfStockCount++;
                return;
              }

              const quantityToAdd = Math.min(quantity, availableStock);
              if (quantityToAdd < quantity) {
                partialStockCount++;
              } else {
                addedCount++;
              }

              existingItem.quantity += quantityToAdd;
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

          return { items: currentItems };
        });

        if (addedCount > 0 || partialStockCount > 0) {
          const msg = partialStockCount > 0 
            ? `Added items to cart (some quantities adjusted due to stock)`
            : `Successfully added ${addedCount} items to cart`;
          toast.success(msg);
          set({ isOpen: true });
        }

        if (outOfStockCount > 0) {
          toast.error(`${outOfStockCount} items were out of stock or at limit`);
        }
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId)
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => {
          const item = state.items.find((item) => item.product.id === productId);
          if (!item) return state;

          if (quantity > item.product.stock) {
            toast.error(`Only ${item.product.stock} units available for ${item.product.name}`);
            return {
              items: state.items.map((i) =>
                i.product.id === productId ? { ...i, quantity: item.product.stock } : i
              )
            };
          }

          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i
            )
          };
        });
      },

      clearCart: () => set({ items: [] }),

      setIsOpen: (isOpen: boolean) => set({ isOpen }),

      toggleFavorite: (productId: string) => {
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter(id => id !== productId)
            : [...state.favorites, productId]
        }));
      },
    }),
    {
      name: 'vital-cart-storage', // localStorage key
      partialize: (state) => ({ items: state.items, favorites: state.favorites }), // Persist items and favorites, not isOpen
    }
  )
);
