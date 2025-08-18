import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ role }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Menu items
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Article', path: '/admin/article' },
    ...(role === 'admin'
      ? [
          { name: 'Category', path: '/admin/category' },
          { name: 'Users', path: '/admin/users' },
        ]
      : []),
    { name: 'Comments', path: '/admin/comment' },
    ...(role === 'admin' ? [{ name: 'Settings', path: '/admin/settings' }] : []),
  ];

  return (
    <header className="bg-light-mint shadow">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap px-4 py-2">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/admin/dashboard">
            <img
              className="h-12 md:h-14 w-auto"
              src="/images/news.jpg"
              alt="Logo"
            />
          </Link>
        </div>

        {/* Hamburger & Logout */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            className="md:hidden text-deep-green text-2xl"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <i className="fa fa-times"></i>
            ) : (
              <i className="fa fa-bars"></i>
            )}
          </button>

          <a
            href="/admin/logout"
            className="font-bold text-deep-green flex items-center gap-1 hover:text-muted-green transition-colors"
          >
            <i className="fa fa-sign-out"></i> Logout
          </a>
        </div>
      </div>

      {/* Desktop Menu */}
      <nav className="bg-muted-green hidden md:flex shadow">
        <ul className="flex justify-center flex-grow list-none">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`block px-4 py-2 text-white font-semibold hover:bg-light-mint hover:text-deep-green transition-colors ${
                  location.pathname === item.path ? 'bg-light-mint text-deep-green font-bold' : ''
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="bg-muted-green md:hidden shadow">
          <ul className="flex flex-col list-none p-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`block px-4 py-2 text-white font-semibold rounded hover:bg-light-mint hover:text-deep-green transition-colors ${
                    location.pathname === item.path ? 'bg-light-mint text-deep-green font-bold' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
