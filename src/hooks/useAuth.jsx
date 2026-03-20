import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [menus, setMenus] = useState([]);
  const [role, setRole] = useState(null);
  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on mount
    const storedUser = localStorage.getItem("user");
    const storedMenus = localStorage.getItem("menus");
    const storedRole = localStorage.getItem("role");
    const storedBroker = localStorage.getItem("broker");

    if (storedUser && storedUser != "undefined") {
      setUser(JSON.parse(storedUser));
      setMenus(storedMenus ? JSON.parse(storedMenus) : []);
      setRole(storedRole);
      setBroker(JSON.parse(storedBroker));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/login", { username, password });
      console.log("response", response);

      const data = response.data.data;

      setUser(data.user);
      setRole(data.role);
      setMenus(data.menus || []);

      // Assume token is provided, or store user objects
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.role);
      localStorage.setItem("menus", JSON.stringify(data.menus || []));
      localStorage.setItem("broker", JSON.stringify(data.brokerDetails || {}));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setMenus([]);
    setBroker(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("menus");
    localStorage.removeItem("token");
    localStorage.removeItem("broker");
  };

  return (
    <AuthContext.Provider
      value={{ user, role, menus, broker, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
