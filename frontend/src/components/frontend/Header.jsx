import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getAllCategories, getFrontendSettings } from "../../api/api";
import { HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState({ website_title: "", website_logo: "" });
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData || []);
        const settingsData = await getFrontendSettings();
        setSettings(settingsData || {});
      } catch (err) {
        console.error("Failed to fetch header data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Header Top */}
      <div className="bg-light-mint shadow-md relative">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
          {/* Logo (left) */}
          <Link to="/" className="flex items-center z-10">
            <img
              src={settings.website_logo ? `http://localhost:3000/uploads/${settings.website_logo}` : "/images/news.jpg"}
              alt="Logo"
              className="h-12 md:h-16"
            />
          </Link>

         {/* Title (center, desktop only) */}
<div className="hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 text-2xl font-bold text-deep-green z-0">
  {settings.website_title || "Website Title"}
</div>


          {/* Login Button (right desktop) */}
          <div className="hidden md:flex z-10">
            <Link
              to="/admin/login"
              className="px-4 py-1 bg-deep-green text-light-mint font-semibold rounded hover:bg-muted-green transition"
            >
              Login
            </Link>
          </div>

          {/* Hamburger (mobile only) */}
          <div className="md:hidden ml-auto z-10">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="focus:outline-none">
              {mobileOpen ? <HiX className="text-3xl text-deep-green" /> : <HiMenu className="text-3xl text-deep-green" />}
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Line */}
      <hr className="border-muted-green" />

      {/* Desktop Navbar (hidden on mobile) */}
      <nav className="hidden md:flex bg-light-mint shadow-sm">
        <div className="container mx-auto px-4 py-2 justify-center flex space-x-6 font-medium">
          <Link
            to="/"
            className={`hover:text-muted-green transition ${
              location.pathname === "/" ? "font-bold text-muted-green" : "text-deep-green"
            }`}
          >
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.slug}`}
              className={`hover:text-muted-green transition ${
                location.pathname === `/category/${cat.slug}` ? "font-bold text-muted-green" : "text-deep-green"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <ul className="md:hidden flex flex-col space-y-2 px-4 pb-4 font-medium bg-light-mint">
          <li>
            <Link
              to="/"
              className={`block px-2 py-1 hover:text-muted-green transition ${
                location.pathname === "/" ? "font-bold text-muted-green" : "text-deep-green"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat._id}>
              <Link
                to={`/category/${cat.slug}`}
                className={`block px-2 py-1 hover:text-muted-green transition ${
                  location.pathname === `/category/${cat.slug}` ? "font-bold text-muted-green" : "text-deep-green"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            </li>
          ))}
          {/* Mobile Login Button */}
          <li>
            <Link
              to="/admin/login"
              className="block px-2 py-1 mt-2 bg-deep-green text-light-mint font-semibold rounded hover:bg-muted-green transition"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>
      )}
    </>
  );
};

export default Header;
