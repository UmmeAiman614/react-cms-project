// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Articles from "./pages/admin/Articles";
import AddArticle from "./pages/admin/AddArticle";
import UpdateArticle from "./pages/admin/UpdateArticle";
import Categories from "./pages/admin/Categories";
import AddCategory from "./pages/admin/AddCategory";
import UpdateCategory from "./pages/admin/UpdateCategory";
import Users from "./pages/admin/Users";
import AddUser from "./pages/admin/AddUser";
import UpdateUser from "./pages/admin/UpdateUser";
import Comments from "./pages/admin/Comments";
import Settings from "./pages/admin/Settings";
import Login from "./pages/admin/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default redirect from "/" to "/admin/login" */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/articles" element={<Articles />} />
        <Route path="/admin/articles/add" element={<AddArticle />} />
        <Route path="/admin/articles/update/:id" element={<UpdateArticle />} />
        <Route path="/admin/categories" element={<Categories />} />
        <Route path="/admin/categories/add" element={<AddCategory />} />
        <Route path="/admin/categories/update/:id" element={<UpdateCategory />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/add" element={<AddUser />} />
        <Route path="/admin/users/update/:id" element={<UpdateUser />} />
        <Route path="/admin/comments" element={<Comments />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Catch all - redirect to login if route not found */}
        <Route path="*" element={<Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
