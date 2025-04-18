import { useState, useCallback } from "react";
import API_BASE_URL from "./lib/api";
import { fetchSessionRaw } from "./lib/fetchSession";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    const skip = localStorage.getItem("skipSessionCheck") === "true";
    if (skip) {
      localStorage.removeItem("skipSessionCheck");
      setUser(null);
      setSession(null);
      setLoading(false);
      return;
    }
  
    const session = await fetchSessionRaw();
  
    if (session) {
      setUser(session.user);
      setSession(session);
    } else {
      setUser(null);
      setSession(null);
    }
  
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, message: error.message || "Login failed" };
      }

      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, message: error.message || "Registration failed" };
      }

      return await login(email, password);
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
        credentials: "include",
      });

      const data = await res.json();
      const email = data?.user?.email;
      if (!email) return;

      await fetch(`${API_BASE_URL}/api/auth/custom-logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      localStorage.setItem("skipSessionCheck", "true");
      window.location.href = "/signin?logoutSuccess=true";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const signInWithGoogle = () => {
    const callback = `${window.location.origin}/dashboard`;
    window.location.href = `${API_BASE_URL}/api/auth/google-login?callbackUrl=${encodeURIComponent(callback)}`;
  };

  const signUpWithGoogle = () => {
    localStorage.setItem("firstGoogleLogin", "true");
    const callback = `${window.location.origin}/dashboard`;
    window.location.href = `${API_BASE_URL}/api/auth/google-login?callbackUrl=${encodeURIComponent(callback)}`;
  };

  const deleteAccount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        return { success: false, message: error.message };
      }

      localStorage.setItem("skipSessionCheck", "true");
      window.location.href = "/signin?accountDeleted=true";
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return {
    user,
    session,
    loading,
    login,
    register,
    logout,
    fetchSession,
    signInWithGoogle,
    signUpWithGoogle,
    deleteAccount,
  };
}

