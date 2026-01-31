import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url?: string;
  stock: number;
  category?: string;
  is_available: boolean;
  has_stock_issue?: boolean;
  price_changed?: boolean;
  name_changed?: boolean;
}

export interface SyncMessage {
  type: 'price_changed' | 'name_changed' | 'product_deleted';
  product_name: string;
  old_price?: number;
  new_price?: number;
  old_name?: string;
  new_name?: string;
  product_id?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
  syncMessages: SyncMessage[];
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
  syncMessages: [],
};

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch cart');
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ token, product_id, quantity }: { token: string; product_id: string; quantity: number }, { rejectWithValue }) => {
    try {
      await axios.post(
        `${API_URL}/api/cart`,
        { product_id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch updated cart
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add item');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ token, product_id, quantity }: { token: string; product_id: string; quantity: number }, { rejectWithValue }) => {
    try {
      await axios.patch(
        `${API_URL}/api/cart/${product_id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch updated cart
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update item');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async ({ token, product_id }: { token: string; product_id: string }, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/api/cart/${product_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch updated cart
      const response = await axios.get(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (token: string, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${API_URL}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { items: [], total: 0, sync_messages: [] };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.total = 0;
      state.syncMessages = [];
      state.error = null;
    },
    clearSyncMessages: (state) => {
      state.syncMessages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.syncMessages = action.payload.sync_messages || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add item
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.syncMessages = action.payload.sync_messages || [];
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.syncMessages = action.payload.sync_messages || [];
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.syncMessages = action.payload.sync_messages || [];
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.syncMessages = [];
        state.loading = false;
      });
  }
});

export const { resetCart, clearSyncMessages } = cartSlice.actions;
export default cartSlice.reducer;