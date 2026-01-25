import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { RootState } from '../redux/store';
import { Product } from '../redux/productsSlice';
import { showToast } from './Toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'error');
      return;
    }

    if (product.stock === 0) {
      showToast('Product out of stock', 'error');
      return;
    }

    dispatch(addToCart({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      stock: product.stock,
    }));
    
    showToast(`${product.name} added to cart!`, 'success');
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div className="card group hover:scale-105 transition-transform duration-200">
        <div className="relative overflow-hidden rounded-lg mb-4 h-48 bg-gray-100 dark:bg-gray-700">
          <img
            src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
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
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`px-4 py-2 rounded-lg transition-all ${
                product.stock === 0
                  ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {product.stock > 0 ? `${product.stock} in stock` : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}
