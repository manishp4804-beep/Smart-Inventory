import React from "react";
import { useAuth } from "../context/useAuth";

export default function CustomerDashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">Customer Dashboard</h1>
        <p className="text-gray-600">Welcome, {user?.name || "Customer"}.</p>
      </div>
    </div>
  );
}
