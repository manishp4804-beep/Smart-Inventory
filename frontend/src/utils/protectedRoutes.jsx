import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (!payload?.exp) return true;
        return payload.exp * 1000 <= Date.now();
    } catch {
        return true;
    }
};

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem("pos-token");

    if (isTokenExpired(token)) {
        logout();
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
