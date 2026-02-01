import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../redux/cartSlice';
import { RootState, AppDispatch } from '../redux/store';
import { Product } from '../redux/productsSlice';
import { showToast } from './Toast';
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  // Optimized selector - only re-render if THIS product's cart quantity changes
  const cartItem = useSelector(
    (state: RootState) => state.cart.items.find(i => i.product_id === product.id),
    (prev, next) => prev?.quantity === next?.quantity // Custom equality check
  );

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !token) {
      showToast('Please login to add items to cart', 'error');
      return;
    }

    if (product.stock === 0) {
      showToast('Product out of stock', 'error');
      return;
    }

    // Check if adding would exceed stock
    if (cartItem && cartItem.quantity >= product.stock) {
      showToast(`Maximum stock (${product.stock}) already in cart`, 'error');
      return;
    }

    try {
      await dispatch(addItemToCart({
        token,
        product_id: product.id,
        quantity: 1
      })).unwrap();

      showToast(`${product.name} added to cart!`, 'success');
    } catch (error: any) {
      showToast(error || 'Failed to add to cart', 'error');
    }
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/login');
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="card group hover:scale-105 transition-transform duration-200 will-change-transform transform-gpu">
        <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-gray-100 dark:bg-gray-700">
          <img
            src={product.image_url || 'https://placehold.co/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              ${product.price.toFixed(2)}
            </span>

            {isAuthenticated ? (
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`px-4 py-2 rounded-lg transition-all ${product.stock === 0
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg'
                  }`}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                Login to Buy
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {product.stock > 0 ? `${product.stock} in stock` : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}

// Memoize the component - only re-render when product prop changes
export default memo(ProductCard, (prevProps, nextProps) => {
  // Only re-render if product data actually changed
  return (
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.price === nextProps.product.price
  );
});