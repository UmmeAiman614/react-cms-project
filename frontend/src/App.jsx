// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ---------- Admin Pages ----------
import Login from "./pages/admin/Login";
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

// ---------- Frontend Pages ----------
import Home from "./pages/frontend/Home";
import Category from "./pages/frontend/Category";
import SingleArticle from "./pages/frontend/SingleArticle";
import Author from "./pages/frontend/Author";
import Search from "./pages/frontend/Search";


// Admin Route wrapper
import AdminRoutes from "./routes/AdminRoutes";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* ---------- Admin Routes ---------- */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminRoutes />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="articles" element={<Articles />} />
          <Route path="articles/add" element={<AddArticle />} />
          <Route path="articles/update/:id" element={<UpdateArticle />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/update/:id" element={<UpdateCategory />} />
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/update/:id" element={<UpdateUser />} />
          <Route path="comments" element={<Comments />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ---------- Frontend Routes ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/single/:id" element={<SingleArticle />} />
        <Route path="/author/:name" element={<Author />} />
        <Route path="/search" element={<Search />} />

      </Routes>
    </Router>
  );
};

export default App;
