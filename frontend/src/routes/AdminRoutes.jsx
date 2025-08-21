import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const AdminRoutes = () => {
  const token = localStorage.getItem("token");
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRole = async () => {
      if (!token) {
        setLoading(false); // stop loading if no token
        return;
      }
      try {
        const res = await api.get("/admin/dashboard"); // assuming this returns role
        setRole(res.data.role);
      } catch (err) {
        console.error("Error fetching role:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [token]);

  // If no token, redirect immediately to login
  if (!token) return <Navigate to="/admin/login" replace />;

  // While fetching role, show loading
  if (loading) return <div className="text-center py-20">Loading...</div>;

  const pathname = location.pathname;

  // Admin-only paths
  const adminOnlyPaths = [
    "/admin/categories",
    "/admin/categories/add",
    "/admin/categories/update",
    "/admin/users",
    "/admin/users/add",
    "/admin/users/update",
    "/admin/settings",
  ];

  // Author-only paths
  const authorOnlyPaths = [
    "/admin/author/dashboard",
    "/admin/author/articles",
    "/admin/author/comments",
  ];

  // Restrict access based on role
  if (adminOnlyPaths.some((path) => pathname.startsWith(path)) && role !== "admin") {
    return <Navigate to="/admin/author/dashboard" replace />;
  }

  if (authorOnlyPaths.some((path) => pathname.startsWith(path)) && role !== "author") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoutes;
