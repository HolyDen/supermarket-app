import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { Product } from '../redux/productsSlice';
import { showToast } from '../components/Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      showToast('Product not found', 'error');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'error');
      navigate('/login');
      return;
    }

    if (!product) return;

    dispatch(addToCart({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: product.image_url,
      stock: product.stock,
    }));

    showToast(`${quantity} × ${product.name} added to cart!`, 'success');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-primary-600 dark:text-primary-400 hover:underline flex items-center"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to products
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
          <img
            src={product.image_url || 'https://via.placeholder.com/600'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{product.category}</p>
          </div>

          <p className="text-gray-700 dark:text-gray-300 text-lg">
            {product.description}
          </p>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300 font-medium">
              Quantity:
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                -
              </button>
              <span className="w-16 text-center font-semibold text-xl text-gray-900 dark:text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
                className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full btn-primary text-lg py-4 disabled:opacity-50"
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
