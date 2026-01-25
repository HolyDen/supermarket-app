import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { clearCart } from '../redux/cartSlice';
import Cart from '../components/Cart';
import EmptyState from '../components/EmptyState';
import { showToast } from '../components/Toast';
import axios from 'axios';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      await axios.post(
        `${API_URL}/api/orders`,
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(clearCart());
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon="נ›’"
        title="Your cart is empty"
        description="Start shopping and add some products to your cart!"
        action={
          <button onClick={() => navigate('/')} className="btn-primary">
            Browse Products
          </button>
        }
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Cart />
        </div>

        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Subtotal ({items.length} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-primary-600 dark:text-primary-400">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              This is a demo checkout. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
