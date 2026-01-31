import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { clearCart, fetchCart } from '../redux/cartSlice';
import Cart from '../components/Cart';
import EmptyState from '../components/EmptyState';
import { showToast } from '../components/Toast';
import axios from 'axios';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.auth.token);
  const [loading, setLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const hasUnavailableItems = items.some(item => !item.is_available);
  const hasStockIssues = items.some(item => item.has_stock_issue || item.stock === 0);
  const canCheckout = !hasUnavailableItems && !hasStockIssues && items.length > 0;

  const handleCheckout = async () => {
    if (!token || !canCheckout) return;

    setLoading(true);
    try {
      const orderItems = items
        .filter(item => item.is_available && !item.has_stock_issue && item.stock > 0)
        .map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }));

      if (orderItems.length === 0) {
        showToast('No items available for checkout', 'error');
        return;
      }

      await axios.post(
        `${API_URL}/api/orders`,
        { items: orderItems },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast('Order placed successfully!', 'success');

      // Refresh cart (should be empty now)
      await dispatch(fetchCart(token));

      navigate('/orders');
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    if (!token) return;

    try {
      await dispatch(clearCart(token)).unwrap();
      showToast('Cart cleared', 'success');
      setShowClearConfirm(false);
    } catch (error) {
      showToast('Failed to clear cart', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
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

  const getCheckoutButtonText = () => {
    if (loading) return 'Processing...';
    if (hasUnavailableItems) return 'Remove unavailable items';
    if (hasStockIssues) return 'Adjust quantities';
    return 'Proceed to Checkout';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Shopping Cart
        </h1>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="btn-secondary"
        >
          Clear Cart
        </button>
      </div>

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
                <span>Subtotal ({items.filter(i => i.is_available).length} items)</span>
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

            {/* Warning message if checkout is disabled */}
            {!canCheckout && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded text-sm">
                <p className="text-yellow-800 dark:text-yellow-300">
                  {hasUnavailableItems && '⚠️ Remove unavailable items to checkout'}
                  {!hasUnavailableItems && hasStockIssues && '⚠️ Adjust quantities to match stock'}
                </p>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || !canCheckout}
              className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getCheckoutButtonText()}
            </button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              This is a demo checkout. No real payment will be processed.
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        confirmText="Clear Cart"
        cancelText="Cancel"
        onConfirm={handleClearCart}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}