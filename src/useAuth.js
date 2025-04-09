import { useState, useCallback } from "react";
import { signIn, getSession } from "next-auth/react";

//const FRONTEND_URL = window.location.origin;

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Session fetch failed");
      const data = await res.json();

      const skip = localStorage.getItem("skipSessionCheck") === "true";
      if (skip) {
        localStorage.removeItem("skipSessionCheck");
        setUser(null);
        setSession(null);
        setLoading(false);
        return;
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch {
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
  
      if (result?.error) {
        return { success: false, message: result.error || "Login failed" };
      }
  
      return { success: true };
      
    } catch (err) {
      return { success: false, message: err.message || "Unexpected error" };
    }
  };
  
  
  

  const register = async (name, email, password) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        return {
          success: false,
          message: error.message || "Registration failed",
        };
      }

      await login(email, password);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/session", {
        credentials: "include",
      });

      const data = await res.json();
      const email = data?.user?.email;
      if (!email) return;

      await fetch("/api/auth/custom-logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      localStorage.setItem("skipSessionCheck", "true");

      document.cookie = "next-auth.session-token=; Max-Age=0; path=/;";
      document.cookie = "next-auth.csrf-token=; Max-Age=0; path=/;";

      window.location.href = "/signin?logoutSuccess=true";
    } catch (err) {
      console.error("Logout error:", err);
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
  };
}

