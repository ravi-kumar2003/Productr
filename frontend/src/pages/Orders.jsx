import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Orders = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll({ user: user?.id });
      setOrders(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto my-8 px-8">
      <h1 className="text-gray-800 mb-8">My Orders</h1>
      {error && <ErrorMessage message={error} />}
      {orders.length === 0 ? (
        <p className="text-center py-12 text-gray-500 text-xl">No orders found</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="mb-2 text-gray-800">Order #{order._id.slice(-8)}</h3>
                  <p className="text-gray-500 text-sm">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`${getStatusColor(order.orderStatus)} text-white px-4 py-2 rounded text-sm font-bold capitalize`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <h4 className="mb-1 text-gray-800">{item.product?.name || 'Product'}</h4>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-green-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-xl text-gray-800">
                  <strong>Total: ${order.totalAmount.toFixed(2)}</strong>
                </div>
                <div className="flex gap-4 text-gray-500 text-sm">
                  <span>Payment: {order.paymentStatus}</span>
                  <span>Method: {order.paymentMethod}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
