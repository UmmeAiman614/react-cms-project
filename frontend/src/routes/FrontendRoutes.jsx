import { Routes, Route } from "react-router-dom";
import Home from "../pages/frontend/Home";
import Category from "../pages/frontend/Category";
import SingleArticle from "../pages/frontend/SingleArticle";
import Author from "../pages/frontend/Author";
import Search from "../pages/frontend/Search";
import Error from "../pages/frontend/Error";
import Signup from "../pages/frontend/Signup";
import Login from "../pages/frontend/Login";
// import AuthorDashboard from "../pages/AuthorDashboard";

const FrontendRoutes = () => {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<Home />} />

      {/* Category page */}
      <Route path="/category/:slug" element={<Category />} />

      {/* Single article page */}
      <Route path="/single/:id" element={<SingleArticle />} />

      {/* Author profile page */}
      <Route path="/author/:id" element={<Author />} />

      {/* Author Dashboard (protected, authors only) */}
      {/* <Route path="/author/dashboard" element={<AuthorDashboard />} /> */}

      {/* Signup/Login pages */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Search results page */}
      <Route path="/search" element={<Search />} />

      {/* Catch-all route for 404 */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default FrontendRoutes;
