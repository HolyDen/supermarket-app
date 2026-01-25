import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../redux/store';
import { setProducts, setCategories, setLoading, setError, setCurrentCategory } from '../redux/productsSlice';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const dispatch = useDispatch();
  const { items, categories, loading, currentCategory, searchQuery } = useSelector(
    (state: RootState) => state.products
  );
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [currentCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/categories`);
      dispatch(setCategories(response.data.categories));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    dispatch(setLoading(true));
    try {
      const params: any = {};
      if (currentCategory) params.category = currentCategory;
      if (searchQuery) params.search = searchQuery;

      const response = await axios.get(`${API_URL}/api/products`, { params });
      dispatch(setProducts(response.data.products));
    } catch (error: any) {
      dispatch(setError(error.response?.data?.error || 'Failed to fetch products'));
    }
  };

  const handleSearch = (query: string) => {
    setLocalSearch(query);
    const timer = setTimeout(() => {
      dispatch(setProducts(
        items.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
        )
      ));
    }, 300);
    return () => clearTimeout(timer);
  };

  const handleCategorySelect = (category: string | null) => {
    dispatch(setCurrentCategory(category));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Our Supermarket
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Fresh products, great prices, delivered to your door
        </p>
        
        <div className="flex justify-center mb-6">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={currentCategory}
        onSelectCategory={handleCategorySelect}
      />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}
