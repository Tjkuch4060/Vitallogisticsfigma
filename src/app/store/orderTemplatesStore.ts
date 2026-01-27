import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

export interface OrderTemplate {
  id: string;
  name: string;
  items: CartItem[];
  createdAt: number;
}

interface OrderTemplatesStore {
  templates: OrderTemplate[];
  saveTemplate: (name: string, items: CartItem[]) => void;
  deleteTemplate: (templateId: string) => void;
  getTemplate: (templateId: string) => OrderTemplate | undefined;
}

export const useOrderTemplatesStore = create<OrderTemplatesStore>()(
  persist(
    (set, get) => ({
      templates: [],

      saveTemplate: (name: string, items: CartItem[]) => {
        const template: OrderTemplate = {
          id: crypto.randomUUID(),
          name,
          items,
          createdAt: Date.now()
        };

        set((state) => ({
          templates: [...state.templates, template]
        }));
      },

      deleteTemplate: (templateId: string) => {
        set((state) => ({
          templates: state.templates.filter(t => t.id !== templateId)
        }));
      },

      getTemplate: (templateId: string) => {
        return get().templates.find(t => t.id === templateId);
      },
    }),
    {
      name: 'vital-order-templates-storage',
    }
  )
);
