import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addItemToCart } from '../redux/cartSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Product } from '../redux/productsSlice';
import { showToast } from '../components/Toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Get cart item
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find(i => i.product_id === id)
  );

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

  const handleQuantityChange = (newQty: number) => {
    if (!product) return;

    // Clamp between 1 and stock
    const clamped = Math.max(1, Math.min(product.stock, newQty));
    setQuantity(clamped);

    // Show warning if user tried to exceed stock
    if (newQty > product.stock) {
      showToast(`Only ${product.stock} available in stock`, 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input (user is typing)
    if (value === '') {
      setQuantity(1);
      return;
    }

    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      handleQuantityChange(num);
    }
  };

  const handleInputBlur = () => {
    // Ensure valid quantity on blur
    if (quantity < 1) {
      setQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated || !token) {
      showToast('Please login to add items to cart', 'error');
      navigate('/login');
      return;
    }

    if (!product) return;

    // Check if adding would exceed stock
    if (inCart + quantity > product.stock) {
      showToast(`Only ${availableToAdd} more can be added (${inCart} already in cart)`, 'error');
      return;
    }

    try {
      await dispatch(addItemToCart({
        token,
        product_id: product.id,
        quantity: quantity
      })).unwrap();

      showToast(`${quantity} × ${product.name} added to cart!`, 'success');
      setQuantity(1); // Reset quantity
    } catch (error) {
      showToast(typeof error === 'string' ? error : 'Failed to add to cart', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) return null;

  const inCart = cartItem?.quantity || 0;
  const exceedsStock = inCart > product.stock;
  const availableToAdd = Math.max(0, product.stock - inCart);

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
            src={product.image_url || 'https://placehold.co/600x600?text=No+Image'}
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
            <span className={`text-lg ${product.stock > 0 ? 'text-gray-600 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {isAuthenticated ? (
            <>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300 font-medium block">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Decrease quantity"
                  >
                    <span className="text-xl font-bold">−</span>
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="w-20 h-10 text-center text-xl font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />

                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock || product.stock === 0}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={product.stock === 0 ? "Out of stock" : quantity >= product.stock ? "Maximum stock" : "Increase quantity"}
                  >
                    <span className="text-xl font-bold">+</span>
                  </button>

                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    Max: {product.stock}
                  </span>
                </div>

                {cartItem && (
                  <p className={`text-sm ${exceedsStock ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}>
                    {exceedsStock
                      ? `⚠️ ${inCart} in cart exceeds stock (${product.stock} available)`
                      : `${inCart} already in cart • ${availableToAdd} more available`
                    }
                  </p>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Please login to add this product to your cart
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full btn-primary text-lg py-4"
              >
                Login to Buy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}