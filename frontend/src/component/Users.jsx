import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../api/client";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/user");
        setUsers(response.data.users || []);
      } catch (e) {
        if (e?.response?.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        setError(e?.response?.data?.message || "Could not fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [logout, navigate]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">S.No</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={item._id}>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.email}</td>
                  <td className="border p-2">{item.address}</td>
                  <td className="border p-2 capitalize">{item.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
