import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

interface ProductsState {
  items: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  currentCategory: string | null;
  searchQuery: string;
}

const initialState: ProductsState = {
  items: [],
  categories: [],
  loading: false,
  error: null,
  currentCategory: null,
  searchQuery: '',
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    setCurrentCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload;
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setProducts,
  setCategories,
  setLoading,
  setError,
  setCurrentCategory,
  setSearchQuery,
} = productsSlice.actions;

export default productsSlice.reducer;
