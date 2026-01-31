import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState, AppDispatch } from '../redux/store';
import { updateCartItem, removeCartItem, clearSyncMessages } from '../redux/cartSlice';
import { useState, useEffect } from 'react';
import ConfirmModal from './ConfirmModal';
import { showToast } from './Toast';

export default function Cart() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total, syncMessages } = useSelector((state: RootState) => state.cart);
  const token = useSelector((state: RootState) => state.auth.token);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [hasShownSyncMessages, setHasShownSyncMessages] = useState(false);

  // Show sync messages only on initial load (not on every update)
  useEffect(() => {
    if (syncMessages && syncMessages.length > 0 && !hasShownSyncMessages) {
      syncMessages.forEach(msg => {
        if (msg.type === 'price_changed') {
          showToast(
            `Price updated for ${msg.product_name}: $${msg.old_price?.toFixed(2)} → $${msg.new_price?.toFixed(2)}`,
            'info'
          );
        } else if (msg.type === 'name_changed') {
          showToast(
            `Product renamed: "${msg.old_name}" → "${msg.new_name}"`,
            'info'
          );
        } else if (msg.type === 'product_deleted') {
          showToast(
            `"${msg.product_name}" is no longer available`,
            'error'
          );
        }
      });

      // Mark as shown and clear messages
      setHasShownSyncMessages(true);
      dispatch(clearSyncMessages());
    }
  }, [syncMessages, hasShownSyncMessages, dispatch]);

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1 || !token) return;

    try {
      await dispatch(updateCartItem({
        token,
        product_id: productId,
        quantity: newQuantity
      })).unwrap();
    } catch (error) {
      showToast(typeof error === 'string' ? error : 'Failed to update quantity', 'error');
    }
  };

  const handleRemove = (productId: string) => {
    setItemToRemove(productId);
  };

  const confirmRemove = async () => {
    if (itemToRemove && token) {
      try {
        await dispatch(removeCartItem({
          token,
          product_id: itemToRemove
        })).unwrap();
        showToast('Item removed from cart', 'success');
      } catch (error) {
        showToast('Failed to remove item', 'error');
      }
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

  const hasUnavailableItems = items.some(item => !item.is_available);
  const hasStockIssues = items.some(item => item.has_stock_issue);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.product_id}
          className={`flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow ${!item.is_available ? 'opacity-60 border-2 border-red-500' :
              item.has_stock_issue ? 'border-2 border-yellow-500' : ''
            }`}
        >
          <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
            <img
              src={item.image_url || 'https://placehold.co/80x80?text=No+Image'}
              alt={item.product_name}
              className="w-20 h-20 object-cover rounded"
            />
          </Link>

          <div className="flex-1">
            <Link to={`/product/${item.product_id}`}>
              <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                {item.product_name}
              </h3>
            </Link>

            {item.is_available ? (
              <>
                <p className="text-primary-600 dark:text-primary-400 font-bold">
                  ${item.price.toFixed(2)}
                </p>

                {/* Stock warning */}
                {item.has_stock_issue && (
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm font-semibold mt-1">
                    ⚠️ Only {item.stock} left in stock
                  </p>
                )}
                {item.stock === 0 && (
                  <p className="text-red-600 dark:text-red-400 text-sm font-semibold mt-1">
                    ⚠️ Out of stock
                  </p>
                )}
                {!item.has_stock_issue && item.stock > 0 && item.stock < 10 && (
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    {item.stock} in stock
                  </p>
                )}
              </>
            ) : (
              <div>
                <p className="text-red-500 text-sm font-semibold">
                  ⚠️ Product no longer available
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  This item has been removed from our catalog
                </p>
              </div>
            )}
          </div>

          {item.is_available && (
            <>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock || item.stock === 0}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={item.stock === 0 ? "Out of stock" : item.quantity >= item.stock ? "Maximum stock reached" : "Increase quantity"}
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <p className="font-bold text-lg text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </>
          )}

          <button
            onClick={() => handleRemove(item.product_id)}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            title="Remove from cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}

      {/* Warning banners */}
      {hasUnavailableItems && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300 font-semibold">
            ⚠️ Some items in your cart are no longer available. Please remove them before checkout.
          </p>
        </div>
      )}

      {hasStockIssues && !hasUnavailableItems && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-300 font-semibold">
            ⚠️ Some items have limited stock. Please adjust quantities before checkout.
          </p>
        </div>
      )}

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