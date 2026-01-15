import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setOrderLoading(true);
      await orderAPI.create({
        user: user.id,
        items: [
          {
            product: id,
            quantity: quantity,
          },
        ],
        shippingAddress: {
          street: user.address || '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        paymentMethod: 'credit_card',
      });
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <div className="max-w-7xl mx-auto my-8 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-md">
        <div>
          <img
            src={product.image || 'https://via.placeholder.com/500x500'}
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
        <div>
          <h1 className="text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-4">{product.category}</p>
          <div className="flex gap-2 mb-4 text-gray-500">
            <span>⭐ {product.rating}</span>
            <span>({product.numReviews} reviews)</span>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-4">${product.price}</p>
          <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="text-green-600 font-bold">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-500 font-bold">Out of Stock</span>
            )}
          </div>
          {product.stock > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center gap-4 mb-4">
                <label className="font-bold text-gray-800">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-20 px-2 py-2 border border-gray-300 rounded text-base"
                />
              </div>
              <button
                onClick={handleOrder}
                disabled={orderLoading}
                className="w-full bg-blue-500 text-white px-4 py-4 rounded text-lg font-bold hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {orderLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          )}
          {error && <ErrorMessage message={error} />}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
