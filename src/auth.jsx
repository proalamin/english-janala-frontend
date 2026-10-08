import { createContext, useContext, useEffect, useState } from "react";
import { api, getTokens, setTokens } from "./api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const tokens = getTokens();
      if (!tokens?.access) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get("/auth/me/");
        setUser(response.data);
      } catch {
        setTokens(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login/", { email, password });
    setTokens({ access: response.data.access, refresh: response.data.refresh });
    setUser(response.data.user);
    return response.data.user;
  }

  async function register(payload) {
    await api.post("/auth/register/", payload);
    return login(payload.email, payload.password);
  }

  function logout() {
    setTokens(null);
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: Boolean(user?.is_staff),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
