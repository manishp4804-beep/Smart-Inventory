import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../api/client";

const cards = [
  { key: "categories", label: "Categories" },
  { key: "suppliers", label: "Suppliers" },
  { key: "products", label: "Products" },
  { key: "orders", label: "Orders" },
  { key: "users", label: "Users" },
];

export default function AdminSummary() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/stats");
        setStats(response.data.stats || {});
      } catch (e) {
        if (e?.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        setError(e?.response?.data?.message || "Could not load dashboard stats");
      }
    };

    fetchStats();
  }, [logout, navigate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div key={card.key} className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold mt-2">{stats[card.key] ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
