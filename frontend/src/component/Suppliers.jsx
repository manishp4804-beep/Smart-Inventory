import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../api/client";

export default function Suppliers() {
  const [addEditModal, setAddEditModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const isEditing = Boolean(editSupplierId);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase()) ||
    supplier.email.toLowerCase().includes(search.toLowerCase()) ||
    supplier.phone.includes(search) ||
    supplier.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleAuthError = useCallback((e) => {
    if (e?.response?.status === 401) {
      logout();
      navigate("/login");
      return true;
    }
    return false;
  }, [logout, navigate]);

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", address: "" });
    setEditSupplierId(null);
    setAddEditModal(false);
  };

  const fetchSupplier = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/supplier");
      setSuppliers(response.data.suppliers || []);
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Error fetching suppliers");
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    fetchSupplier();
  }, [fetchSupplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isEditing) {
        await api.put(`/supplier/${editSupplierId}`, formData);
      } else {
        await api.post("/supplier/add", formData);
      }
      await fetchSupplier();
      resetForm();
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not save supplier");
    }
  };

  const handleEdit = (supplier) => {
    setEditSupplierId(supplier._id);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
    });
    setAddEditModal(true);
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      await api.delete(`/supplier/${id}`);
      await fetchSupplier();
    } catch (e) {
      if (handleAuthError(e)) return;
      setError(e?.response?.data?.message || "Could not delete supplier");
    }
  };

  return (
    <div className="p-4 gap-4 flex w-full h-full flex-col">
      <h1 className="text-2xl font-bold">Supplier Management</h1>
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          className="border p-1 bg-white rounded px-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="border rounded-md bg-green-300 font-bold p-2 cursor-pointer"
          onClick={() => setAddEditModal(true)}
        >
          Add Supplier
        </button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="lg:w-full">
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-200 p-2">S.No</th>
                  <th className="border border-gray-200 p-2">Name</th>
                  <th className="border border-gray-200 p-2">Email</th>
                  <th className="border border-gray-200 p-2">Phone</th>
                  <th className="border border-gray-200 p-2">Address</th>
                  <th className="border border-gray-200 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier, index) => (
                  <tr key={supplier._id}>
                    <td className="border border-gray-200 p-2">{index + 1}</td>
                    <td className="border border-gray-200 p-2">{supplier.name}</td>
                    <td className="border border-gray-200 p-2">{supplier.email}</td>
                    <td className="border border-gray-200 p-2">{supplier.phone}</td>
                    <td className="border border-gray-200 p-2">{supplier.address}</td>
                    <td className="flex border justify-around border-gray-200 p-2">
                      <button
                        className="border border-gray-200 rounded-md bg-blue-500 p-2 text-white hover:bg-blue-400"
                        onClick={() => handleEdit(supplier)}
                      >
                        Edit
                      </button>
                      <button
                        className="border border-gray-200 rounded-md bg-red-500 p-2 text-white hover:bg-red-400"
                        onClick={() => handleDelete(supplier._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredSuppliers.length === 0 && <div>No data found...</div>}
          </div>
        </div>
      )}

      {addEditModal && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50">
          <div className="bg-white p-4 border rounded-md w-full max-w-lg relative mx-4">
            <h1 className="text-2xl font-bold">{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <button
                type="button"
                className="font-bold absolute top-4 right-4 text-red-600 text-2xl cursor-pointer"
                onClick={resetForm}
              >
                X
              </button>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                name="name"
                placeholder="Supplier Name"
                className="border rounded-md p-1 bg-white"
                required
              />
              <input
                type="email"
                value={formData.email}
                onChange={handleChange}
                name="email"
                placeholder="Supplier Email"
                className="border rounded-md p-1 bg-white"
                required
              />
              <input
                type="text"
                value={formData.phone}
                onChange={handleChange}
                name="phone"
                placeholder="Supplier Phone Number"
                className="border rounded-md p-1 bg-white"
                required
              />
              <input
                type="text"
                value={formData.address}
                onChange={handleChange}
                name="address"
                placeholder="Supplier Address"
                className="border rounded-md p-1 bg-white"
                required
              />
              <button className="border rounded-md font-bold p-2 bg-green-300 cursor-pointer">
                {isEditing ? "Update Supplier" : "Add Supplier"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

