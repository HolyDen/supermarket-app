import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const loadCart = (): CartItem[] => {
  const saved = localStorage.getItem('cart');
  return saved ? JSON.parse(saved) : [];
};

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const initialState: CartState = {
  items: loadCart(),
  total: 0,
};

initialState.total = calculateTotal(initialState.items);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(item => item.product_id === action.payload.product_id);

      if (existing) {
        const newQuantity = existing.quantity + (action.payload.quantity || 1);
        if (newQuantity <= existing.stock) {
          existing.quantity = newQuantity;
        } else {
          existing.quantity = existing.stock; // Cap at stock limit
        }
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1
        });
      }

      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    updateQuantity: (state, action: PayloadAction<{ product_id: string; quantity: number }>) => {
      const item = state.items.find(i => i.product_id === action.payload.product_id);

      if (item) {
        item.quantity = Math.min(action.payload.quantity, item.stock);
      }

      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product_id !== action.payload);
      state.total = calculateTotal(state.items);
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
