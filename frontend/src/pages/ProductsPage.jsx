import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import DeleteProductModal from "../components/DeleteProductModal";
import { productAPI } from "../services/api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const res = await productAPI.getAll();
    setProducts(res.data);
    setLoading(false);
  };

  const togglePublish = async (product) => {
    console.log("PUBLISH CLICKED", product._id);

    const fd = new FormData();
    fd.append("published", !product.published);

    await productAPI.update(product._id, fd);
    loadProducts();
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto relative z-0">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            + Add Product
          </button>
        </div>

        {/* LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white border rounded-lg shadow p-4 relative z-10"
              >
                <img
                  src={p.image || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />

                <h3 className="font-bold mb-2">{p.name}</h3>
                <p className="text-sm">Stock: {p.stock}</p>
                <p className="text-sm">₹{p.sellingPrice}</p>

                {/* BUTTONS — FORCED CLICKABLE */}
                <div
                  className="flex gap-2 mt-4 relative"
                  style={{ zIndex: 9999 }}
                >
                  <button
                    onClick={() => togglePublish(p)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded"
                  >
                    {p.published ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => {
                      console.log("EDIT CLICKED", p._id);
                      setActiveProduct(p);
                      setEditOpen(true);
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      console.log("DELETE CLICKED", p._id);
                      setActiveProduct(p);
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

        {/* MODALS */}
        {addOpen && (
          <AddProductModal
            onClose={() => setAddOpen(false)}
            onSuccess={() => {
              setAddOpen(false);
              loadProducts();
            }}
          />
        )}

        {editOpen && activeProduct && (
          <EditProductModal
            product={activeProduct}
            onClose={() => {
              setEditOpen(false);
              setActiveProduct(null);
            }}
            onSuccess={() => {
              setEditOpen(false);
              setActiveProduct(null);
              loadProducts();
            }}
          />
        )}

        {deleteOpen && activeProduct && (
          <DeleteProductModal
            product={activeProduct}
            onClose={() => {
              setDeleteOpen(false);
              setActiveProduct(null);
            }}
            onConfirm={async () => {
              await productAPI.delete(activeProduct._id);
              setDeleteOpen(false);
              setActiveProduct(null);
              loadProducts();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;
