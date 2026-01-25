interface Order {
  id: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  created_at: string;
}

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        <p className="text-xl mb-2">No orders yet</p>
        <p className="text-sm">Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order #{order.id.slice(-8)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100">
              {order.status}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {item.product_name} ֳ— {item.quantity}
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total:
              </span>
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
