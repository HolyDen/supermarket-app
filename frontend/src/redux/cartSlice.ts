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
  is_available: boolean;
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
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
      await axios.delete(`${API_URL}/api/cart/${product_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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

export const clearUserCart = createAsyncThunk(
  'cart/clearCart',
  async (token: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { items: [], total: 0 };
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
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.loading = false;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add item
    builder.addCase(addItemToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.loading = false;
    });
    builder.addCase(addItemToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update item
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    });

    // Remove item
    builder.addCase(removeCartItem.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    });

    // Clear cart
    builder.addCase(clearUserCart.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.total = action.payload.total;
    });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;