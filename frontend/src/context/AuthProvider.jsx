import {useState} from "react";
import AuthContext from "./AuthContext";

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

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("pos-token");
        const storedData = localStorage.getItem("pos-user");

        if (!storedData || isTokenExpired(token)) {
            localStorage.removeItem("pos-user");
            localStorage.removeItem("pos-token");
            return null;
        }

        return JSON.parse(storedData);
    });

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("pos-user", JSON.stringify(userData));
        localStorage.setItem("pos-token", token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("pos-user");
        localStorage.removeItem("pos-token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
