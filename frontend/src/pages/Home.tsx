import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../redux/store';
import { setProducts, setCategories, setLoading, setError, setCurrentCategory, Product } from '../redux/productsSlice';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Home() {
  const dispatch = useDispatch();
  const { categories, loading, currentCategory } = useSelector(
    (state: RootState) => state.products
  );

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Fetch data only once on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []); // Empty dependency array = run once

  // Filter products when search or category changes
  useEffect(() => {
    let filtered = allProducts;

    // Filter by category first
    if (currentCategory) {
      filtered = filtered.filter(p => p.category === currentCategory);
    }

    // Then filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(query);
        const descMatch = query.length >= 3 && p.description.toLowerCase().includes(query);
        return nameMatch || descMatch;
      });
    }

    setDisplayProducts(filtered);
    setPage(1); // Reset to first page on filter change
  }, [searchQuery, currentCategory, allProducts]);

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
      // Fetch ALL products without category filter
      // Set per_page to a large number to get all products
      const response = await axios.get(`${API_URL}/api/products`, {
        params: { per_page: 1000 } // Large number to get all products
      });
      const products = response.data.products;

      setAllProducts(products);
      setDisplayProducts(products);
      dispatch(setProducts(products));
    } catch (error: any) {
      dispatch(setError(error.response?.data?.error || 'Failed to fetch products'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Use useCallback to create a stable function reference
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleCategorySelect = (category: string | null) => {
    dispatch(setCurrentCategory(category));
    setSearchQuery(''); // Clear search when changing category
  };

  // Pagination
  const totalPages = Math.ceil(displayProducts.length / PER_PAGE);
  const paginatedProducts = displayProducts.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

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
        <>
          <ProductGrid products={paginatedProducts} />

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-gray-700 dark:text-gray-300">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}