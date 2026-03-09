import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../api/client";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ product: "", quantity: 1, status: "pending" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
      const [ordersRes, productsRes] = await Promise.all([api.get("/order"), api.get("/product")]);
      setOrders(ordersRes.data.orders || []);
      setProducts(productsRes.data.products || []);
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/order/add", formData);
      setFormData({ product: "", quantity: 1, status: "pending" });
      await fetchData();
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not create order");
    }
  };

  const updateStatus = async (id, status) => {
    setError("");
    try {
      await api.put(`/order/${id}`, { status });
      await fetchData();
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not update order");
    }
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/order/${id}`);
      await fetchData();
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not delete order");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="font-semibold mb-3">Create Order</h2>
        <form className="grid md:grid-cols-4 gap-3" onSubmit={handleSubmit}>
          <select
            className="border rounded p-2"
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            required
          >
            <option value="">Select Product</option>
            {products.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} (Stock: {item.stock})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            className="border rounded p-2"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            required
          />
          <select
            className="border rounded p-2"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="bg-green-300 rounded p-2 font-bold">Create</button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Order #</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item) => (
                <tr key={item._id}>
                  <td className="border p-2">{item.orderNumber}</td>
                  <td className="border p-2">{item.product?.name || "-"}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">
                    <select
                      className="border rounded p-1"
                      value={item.status}
                      onChange={(e) => updateStatus(item._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="border p-2">
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
  );
}
