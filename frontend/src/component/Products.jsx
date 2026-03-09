import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../api/client";

const initialForm = {
  name: "",
  sku: "",
  category: "",
  supplier: "",
  price: "",
  stock: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthError = useCallback((e) => {
    if (e?.response?.status === 401) {
      logout();
      navigate("/login");
      return true;
    }
    return false;
  }, [logout, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [productsRes, categoriesRes, suppliersRes] = await Promise.allSettled([
        api.get("/product"),
        api.get("/category"),
        api.get("/supplier"),
      ]);

      const hasAuthFailure = [productsRes, categoriesRes, suppliersRes].some(
        (result) => result.status === "rejected" && result.reason?.response?.status === 401
      );
      if (hasAuthFailure) {
        logout();
        navigate("/login");
        return;
      }

      if (productsRes.status === "fulfilled") {
        setProducts(productsRes.value.data.products || []);
      } else {
        setProducts([]);
      }

      if (categoriesRes.status === "fulfilled") {
        setCategories(categoriesRes.value.data.categories || []);
      } else {
        setCategories([]);
      }

      if (suppliersRes.status === "fulfilled") {
        setSuppliers(suppliersRes.value.data.suppliers || []);
      } else {
        setSuppliers([]);
      }

      const failedCalls = [];
      if (productsRes.status === "rejected") failedCalls.push("products");
      if (categoriesRes.status === "rejected") failedCalls.push("categories");
      if (suppliersRes.status === "rejected") failedCalls.push("suppliers");
      if (failedCalls.length > 0) {
        setError(`Could not load: ${failedCalls.join(", ")}`);
      }
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not load product data");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, logout, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/product/${editingId}`, formData);
      } else {
        await api.post("/product/add", formData);
      }
      setFormData(initialForm);
      setEditingId(null);
      await fetchData();
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not save product");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category?._id || "",
      supplier: item.supplier?._id || "",
      price: item.price,
      stock: item.stock,
    });
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/product/${id}`);
      await fetchData();
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not delete product");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-4 lg:col-span-1">
          <h2 className="text-lg font-semibold mb-3">{editingId ? "Edit Product" : "Add Product"}</h2>
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              className="w-full border rounded p-2"
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              className="w-full border rounded p-2"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
            />
            <select
              className="w-full border rounded p-2"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {categories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.categoryName}
                </option>
              ))}
            </select>
            <select
              className="w-full border rounded p-2"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              className="w-full border rounded p-2"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <input
              type="number"
              min="0"
              className="w-full border rounded p-2"
              placeholder="Stock"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <button className="w-full bg-green-300 rounded p-2 font-bold">
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                className="w-full bg-red-300 rounded p-2 font-bold"
                onClick={() => {
                  setEditingId(null);
                  setFormData(initialForm);
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-4 lg:col-span-2 overflow-x-auto">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border p-2">S.No</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">SKU</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2">Supplier</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Stock</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item, index) => (
                  <tr key={item._id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.sku}</td>
                    <td className="border p-2">{item.category?.categoryName || "-"}</td>
                    <td className="border p-2">{item.supplier?.name || "-"}</td>
                    <td className="border p-2">{item.price}</td>
                    <td className="border p-2">{item.stock}</td>
                    <td className="border p-2 flex gap-2 justify-center">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleDelete(item._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
