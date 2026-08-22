import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  variant_id: string;
  quantity: number;
  // Informational fields for UI rendering before hydration
  name: string;
  price: number;
  pack_size?: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variant_id: string) => void;
  updateQuantity: (variant_id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find(item => item.variant_id === newItem.variant_id);
        
        if (existingItem) {
          // Merge deterministically
          return {
            items: state.items.map(item => 
              item.variant_id === newItem.variant_id 
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            )
          };
        }
        
        return { items: [...state.items, newItem] };
      }),
      
      removeItem: (variant_id) => set((state) => ({
        items: state.items.filter(item => item.variant_id !== variant_id)
      })),
      
      updateQuantity: (variant_id, quantity) => set((state) => {
        if (quantity <= 0) {
          return { items: state.items.filter(item => item.variant_id !== variant_id) };
        }
        return {
          items: state.items.map(item => 
            item.variant_id === variant_id 
              ? { ...item, quantity }
              : item
          )
        };
      }),
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'vetkind-guest-cart', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
