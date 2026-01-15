import React, { useState } from "react";
import { productAPI } from "../services/api";

const AddProductModal = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
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
      data.append("published", false);

      images.forEach((img) => data.append("images", img));

      await productAPI.create(data);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create product:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-xl">
      
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Add Product</h2>
        </div>

       
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <input
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />

          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Foods">Foods</option>
            <option value="Clothes">Clothes</option>
            <option value="Beauty Products">Beauty Products</option>
            <option value="Others">Others</option>
          </select>

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            value={formData.mrp}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            type="number"
            name="sellingPrice"
            placeholder="Selling Price"
            value={formData.sellingPrice}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />

          <input
            name="brand"
            placeholder="Brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="exchangeEligible"
            value={formData.exchangeEligible}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Yes">Exchange Eligible</option>
            <option value="No">No Exchange</option>
          </select>

        
          <div className="border-2 border-dashed rounded-lg p-5 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mx-auto"
            />
            <p className="text-sm text-gray-500 mt-2">
              Upload product images (max 5)
            </p>

           
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="h-16 w-full object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

    
        <div className="px-6 py-4 border-t flex justify-end gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
