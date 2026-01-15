import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EditProductModal from "../components/EditProductModal";
import DeleteProductModal from "../components/DeleteProductModal";
import { productAPI } from "../services/api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("published");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (product) => {
    const fd = new FormData();
    fd.append("published", !product.published);
    await productAPI.update(product._id, fd);
    fetchProducts();
  };

  const filteredProducts =
    activeTab === "published"
      ? products.filter((p) => p.published)
      : products.filter((p) => !p.published);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-8 mb-6 border-b">
          <button
            onClick={() => setActiveTab("published")}
            className={`pb-4 ${
              activeTab === "published"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Published
          </button>

          <button
            onClick={() => setActiveTab("unpublished")}
            className={`pb-4 ${
              activeTab === "unpublished"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600"
            }`}
          >
            Unpublished
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white border rounded-lg p-4">
                <img
                  src={product.image || "https://via.placeholder.com/300"}
                  className="w-full h-48 object-cover rounded mb-4"
                  alt={product.name}
                />

                <h3 className="font-bold mb-2">{product.name}</h3>
                <p className="text-sm">Stock: {product.stock}</p>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => togglePublish(product)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded"
                  >
                    {product.published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setEditOpen(true);
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setDeleteOpen(true);
                    }}
                    className="px-4 py-2 text-red-600 border rounded"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {editOpen && selectedProduct && (
          <EditProductModal
            product={selectedProduct}
            onClose={() => {
              setEditOpen(false);
              setSelectedProduct(null);
            }}
            onSuccess={() => {
              setEditOpen(false);
              setSelectedProduct(null);
              fetchProducts();
            }}
          />
        )}

        {deleteOpen && selectedProduct && (
          <DeleteProductModal
            product={selectedProduct}
            onClose={() => {
              setDeleteOpen(false);
              setSelectedProduct(null);
            }}
            onConfirm={async () => {
              await productAPI.delete(selectedProduct._id);
              setDeleteOpen(false);
              setSelectedProduct(null);
              fetchProducts();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
