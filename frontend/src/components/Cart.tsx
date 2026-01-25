import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { updateQuantity, removeFromCart } from '../redux/cartSlice';
import { useState } from 'react';
import ConfirmModal from './ConfirmModal';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ product_id: productId, quantity: newQuantity }));
    }
  };

  const handleRemove = (productId: string) => {
    setItemToRemove(productId);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      dispatch(removeFromCart(itemToRemove));
      setItemToRemove(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        <p className="text-xl mb-2">Your cart is empty</p>
        <p className="text-sm">Start adding some products!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.product_id}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
        >
          <img
            src={item.image_url || 'https://via.placeholder.com/80'}
            alt={item.product_name}
            className="w-20 h-20 object-cover rounded"
          />

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {item.product_name}
            </h3>
            <p className="text-primary-600 dark:text-primary-400 font-bold">
              ${item.price.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              -
            </button>
            <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
              disabled={item.quantity >= item.stock}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="font-bold text-lg text-gray-900 dark:text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>

          <button
            onClick={() => handleRemove(item.product_id)}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex justify-between items-center text-xl font-bold">
          <span className="text-gray-900 dark:text-white">Total:</span>
          <span className="text-primary-600 dark:text-primary-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <ConfirmModal
        isOpen={itemToRemove !== null}
        title="Remove Item"
        message="Are you sure you want to remove this item from your cart?"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
