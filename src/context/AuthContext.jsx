import { createContext, useState } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post("/auth/login", {
      email,
      password,
    });

    const token = res.data.token;

    localStorage.setItem("token", token);

    const userRes = await axios.get("/auth/me");
    setUser(userRes.data);

    return userRes.data; // important for role check
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
