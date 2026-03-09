import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Root from "./component/Root";
import { Component } from "./pages/login";
import ProtectedRoute from "./utils/protectedRoutes";
import Dashboard from "./pages/Dashboard";
import Categories from "./component/Categories";
import Suppliers from "./component/Suppliers";
import Products from "./component/Products";
import Orders from "./component/Orders";
import Users from "./component/Users";
import Profile from "./pages/Profile";
import Logout from "./pages/Logout";
import CustomerDashboard from "./pages/CustomerDashboard";
import AdminSummary from "./pages/AdminSummary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Component />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <Dashboard/>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="categories" element={<Categories/>} />
          <Route path="products" element={<Products/>} />
          <Route path="suppliers" element={<Suppliers/>} />
          <Route path="orders" element={<Orders/>} />
          <Route path="users" element={<Users/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="logout" element={<Logout/>} />
        </Route>

        <Route
          path="/customer-dashboard"
          element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
