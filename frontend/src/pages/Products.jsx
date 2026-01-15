import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sort: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.sort) params.sort = filters.sort;

      const response = await productAPI.getAll(params);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto my-8 px-8">
      <div className="mb-8">
        <h1 className="text-gray-800 mb-4">All Products</h1>
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            name="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleFilterChange}
            className="flex-1 min-w-[200px] px-3 py-3 border border-gray-300 rounded text-base"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="px-3 py-3 border border-gray-300 rounded text-base bg-white cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
          </select>
          <select
            name="sort"
            value={filters.sort}
            onChange={handleFilterChange}
            className="px-3 py-3 border border-gray-300 rounded text-base bg-white cursor-pointer"
          >
            <option value="">Sort By</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl transition-all">
              <img
                src={product.image || 'https://via.placeholder.com/300x300'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="mb-2 text-gray-800">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{product.category}</p>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                <div className="flex gap-2 mb-4 text-sm text-gray-500">
                  <span>⭐ {product.rating}</span>
                  <span>({product.numReviews} reviews)</span>
                </div>
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
          <p className="col-span-full text-center py-12 text-gray-500 text-xl">No products found</p>
        )}
      </div>
    </div>
  );
};

export default Products;
