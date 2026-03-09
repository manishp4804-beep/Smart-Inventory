import React from "react";
import {
  FaBox,
  FaCog,
  FaHome,
  FaShoppingCart,
  FaSignOutAlt,
  FaTable,
  FaTruck,
  FaUsers,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function SideBar() {
  const menuItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: <FaHome />, isParent:true},
    { name: "Categories", path: "/admin-dashboard/categories", icon: <FaTable />, isParent:false},
    { name: "Products", path: "/admin-dashboard/products", icon: <FaBox />, isParent:false},
    { name: "Suppliers", path: "/admin-dashboard/suppliers", icon: <FaTruck />, isParent:false},
    { name: "Orders", path: "/admin-dashboard/orders", icon: <FaShoppingCart />, isParent:false},
    { name: "Users", path: "/admin-dashboard/users", icon: <FaUsers />, isParent:false},
    { name: "Profile", path: "/admin-dashboard/profile", icon: <FaCog />, isParent:false},
    { name: "Logout", path: "/admin-dashboard/logout", icon: <FaSignOutAlt />, isParent:false},
  ];

  return (
    <div className="flex flex-col h-screen p-3 bg-black text-white w-16 md:w-64 fixed">
      <div className="h-16 flex items-center justify-center">
        <span className="font-bold hidden md:block text-xl">Inventory MS</span>
        <span className="md:hidden font-bold text-xl">IMS</span>
      </div>

      <div>
        <ul className="space-y-2 p-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
              end={item.isParent}
                to={item.path}
                className={({ isActive }) =>
                  (isActive ? "bg-gray-700 " : "") +
                  "flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition duration-200"
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="hidden md:block">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
