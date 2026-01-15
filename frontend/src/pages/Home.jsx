import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({ featured: 'true' });
      setFeaturedProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load featured products');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-[calc(100vh-80px)]">
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-16 px-8 text-center">
        <div>
          <h1 className="text-5xl mb-4">Welcome to Orufy</h1>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
          <Link to="/products" className="inline-block bg-white text-indigo-600 px-8 py-4 rounded font-bold hover:-translate-y-0.5 transition-transform">
            Shop Now
          </Link>
        </div>
      </section>

      {error && <div className="max-w-7xl mx-auto px-8"><ErrorMessage message={error} /></div>}

      <section className="max-w-7xl mx-auto my-16 px-8">
        <h2 className="text-center text-3xl mb-8 text-gray-800">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all">
                <img
                  src={product.image || 'https://via.placeholder.com/300x300'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="mb-2 text-gray-800">{product.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                    <Link
                      to={`/products/${product._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No featured products available</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
