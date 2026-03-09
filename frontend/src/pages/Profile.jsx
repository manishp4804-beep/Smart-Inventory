import React from "react";
import { useAuth } from "../context/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white rounded-lg shadow p-4 max-w-xl">
        <p className="mb-2">
          <span className="font-semibold">Name:</span> {user?.name || "-"}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Email:</span> {user?.email || "-"}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {user?.role || "-"}
        </p>
      </div>
    </div>
  );
}
