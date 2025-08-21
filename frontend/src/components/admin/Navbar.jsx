import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({ siteTitle: "", logo: "" });
  const [role, setRole] = useState(""); // user role
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/admin/settings");
        setSettings(res.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // Fetch user role
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setRole(res.data.role);
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
  };

  // NavLink class (works with isActive)
  const linkClass = ({ isActive }) =>
    `px-3 py-1 rounded transition ${
      isActive
        ? "bg-light-mint text-deep-green font-bold"
        : "text-white hover:bg-light-mint"
    }`;

  // Mobile button class (matches NavLink styling)
  const mobileButtonClass =
    "px-3 py-1 rounded text-white hover:bg-light-mint transition block w-full text-left";

  const commonLinks = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/articles", label: "Article" },
    { to: "/admin/comments", label: "Comments" },
  ];

  const adminLinks = [
    { to: "/admin/categories", label: "Category" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/settings", label: "Settings" },
  ];

  return (
    <>
      {/* HEADER */}
      <div className="bg-pale-yellow shadow">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center gap-2 min-w-0">
            {settings.website_logo ? (
              <img
                className="h-10 w-auto md:h-14"
                src={`http://localhost:3000/uploads/${settings.website_logo}`}
                alt="Logo"
              />
            ) : (
              <img className="h-10 w-auto md:h-14" src="/images/news.jpg" alt="Logo" />
            )}
          </Link>

          {/* Title */}
          {settings.website_title && (
            <span className="hidden md:block text-deep-green font-extrabold text-xl md:text-2xl text-center truncate flex-1">
              {settings.website_title}
            </span>
          )}

          {/* Hamburger + Logout */}
          <div className="flex items-center gap-4">
            <button className="md:hidden text-deep-green" onClick={toggleMenu}>
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {/* Logout button desktop */}
            <button onClick={handleLogout} className="hidden md:flex text-deep-green font-bold items-center gap-1">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="bg-muted-green shadow">
        <div className="container mx-auto px-4">
          {/* Desktop Menu */}
          <ul className="hidden md:flex justify-center gap-4 py-2">
            {commonLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            {role === "admin" &&
              adminLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className={linkClass}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
          </ul>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <ul className="md:hidden flex flex-col gap-2 py-2">
              {commonLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} className="px-3 py-1 rounded text-white hover:bg-light-mint block w-full text-left">
                    {link.label}
                  </NavLink>
                </li>
              ))}
              {role === "admin" &&
                adminLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className="px-3 py-1 rounded text-white hover:bg-light-mint block w-full text-left">
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              <li>
                <button onClick={handleLogout} className={mobileButtonClass}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
