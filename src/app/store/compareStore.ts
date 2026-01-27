import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/mockData';

interface CompareStore {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      compareList: [],

      addToCompare: (product: Product) => {
        const currentList = get().compareList;
        if (currentList.length >= 4) {
          // Limit to 4 products for comparison
          return;
        }
        if (currentList.find(p => p.id === product.id)) {
          // Already in compare list
          return;
        }
        set((state) => ({
          compareList: [...state.compareList, product]
        }));
      },

      removeFromCompare: (productId: string) => {
        set((state) => ({
          compareList: state.compareList.filter(p => p.id !== productId)
        }));
      },

      clearCompare: () => set({ compareList: [] }),
    }),
    {
      name: 'vital-compare-storage',
    }
  )
);
