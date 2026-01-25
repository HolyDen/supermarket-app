import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../redux/store';
import OrderHistory from '../components/OrderHistory';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function OrdersPage() {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Order History
      </h1>

      {orders.length === 0 ? (
        <EmptyState
          icon="נ“¦"
          title="No orders yet"
          description="You haven't placed any orders yet. Start shopping to see your order history here!"
          action={
            <button onClick={() => navigate('/')} className="btn-primary">
              Start Shopping
            </button>
          }
        />
      ) : (
        <OrderHistory orders={orders} />
      )}
    </div>
  );
}
