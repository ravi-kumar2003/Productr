import React, { useState, useEffect } from "react";
import { productAPI } from "../services/api";

const EditProductModal = ({ product, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    stock: "",
    mrp: "",
    sellingPrice: "",
    brand: "",
    exchangeEligible: "Yes",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        stock: product.stock || "",
        mrp: product.mrp || product.price || "",
        sellingPrice: product.sellingPrice || product.price || "",
        brand: product.brand || "",
        exchangeEligible: product.exchangeEligible ? "Yes" : "No",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ SEND AS FORMDATA
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("category", formData.category);
      data.append("stock", Number(formData.stock));
      data.append("price", Number(formData.sellingPrice));
      data.append("mrp", Number(formData.mrp));
      data.append("sellingPrice", Number(formData.sellingPrice));
      data.append("brand", formData.brand);
      data.append("exchangeEligible", formData.exchangeEligible === "Yes");

      await productAPI.update(product._id, data);

      onSuccess(); // refresh list
      onClose(); // ✅ CLOSE MODAL
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">
              Product Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            >
              <option value="Foods">Foods</option>
              <option value="Electronics">Electronics</option>
              <option value="Clothes">Clothes</option>
              <option value="Beauty Products">Beauty Products</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">MRP</label>
            <input
              type="number"
              name="mrp"
              value={formData.mrp}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Selling Price
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Brand</label>
            <input
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Exchange / Return
            </label>
            <select
              name="exchangeEligible"
              value={formData.exchangeEligible}
              onChange={handleChange}
              className="w-full border rounded px-4 py-2"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
